from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timedelta
import random

from ..models.user import User
from ..models.transaction import (
    Transaction, TransactionCreate, TransactionResponse, 
    PixPayment, TransactionType, TransactionCategory, TransactionAnalytics
)
from ..controllers.auth_controller import get_current_user
from ..database import get_database

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/", response_model=TransactionResponse)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Get user's account
    account = await db.accounts.find_one({"user_id": current_user.id})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    # Check balance for debit transactions
    if transaction_data.transaction_type in [TransactionType.DEBIT, TransactionType.PIX_SENT, TransactionType.BILL_PAYMENT]:
        if account["balance"] < transaction_data.amount:
            raise HTTPException(status_code=400, detail="Insufficient funds")
    
    # Create transaction
    transaction = Transaction(
        user_id=current_user.id,
        account_id=account["_id"],
        **transaction_data.dict()
    )
    
    # Calculate new balance
    if transaction_data.transaction_type in [TransactionType.CREDIT, TransactionType.PIX_RECEIVED]:
        new_balance = account["balance"] + transaction_data.amount
    else:
        new_balance = account["balance"] - transaction_data.amount
    
    transaction.balance_after = new_balance
    
    # Insert transaction
    result = await db.transactions.insert_one(transaction.dict(by_alias=True))
    
    # Update account balance
    await db.accounts.update_one(
        {"_id": account["_id"]},
        {
            "$set": {
                "balance": new_balance,
                "available_balance": new_balance,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return TransactionResponse(
        id=str(result.inserted_id),
        transaction_type=transaction.transaction_type,
        category=transaction.category,
        amount=transaction.amount,
        description=transaction.description,
        merchant_name=transaction.merchant_name,
        recipient_name=transaction.recipient_name,
        transaction_date=transaction.transaction_date,
        status=transaction.status,
        balance_after=transaction.balance_after
    )

@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    category: Optional[TransactionCategory] = None,
    transaction_type: Optional[TransactionType] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Build filter
    filter_dict = {"user_id": current_user.id}
    if category:
        filter_dict["category"] = category
    if transaction_type:
        filter_dict["transaction_type"] = transaction_type
    
    transactions = await db.transactions.find(filter_dict).sort("transaction_date", -1).skip(skip).limit(limit).to_list(limit)
    
    return [
        TransactionResponse(
            id=str(transaction["_id"]),
            transaction_type=transaction["transaction_type"],
            category=transaction["category"],
            amount=transaction["amount"],
            description=transaction["description"],
            merchant_name=transaction.get("merchant_name"),
            recipient_name=transaction.get("recipient_name"),
            transaction_date=transaction["transaction_date"],
            status=transaction["status"],
            balance_after=transaction.get("balance_after")
        )
        for transaction in transactions
    ]

@router.post("/pix")
async def send_pix(
    pix_data: PixPayment,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Create PIX transaction
    transaction_data = TransactionCreate(
        transaction_type=TransactionType.PIX_SENT,
        category=TransactionCategory.TRANSFER,
        amount=pix_data.amount,
        description=pix_data.description,
        pix_key=pix_data.pix_key,
        recipient_name=pix_data.recipient_name
    )
    
    return await create_transaction(transaction_data, current_user, db)

@router.get("/analytics", response_model=TransactionAnalytics)
async def get_transaction_analytics(
    months: int = Query(6, ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=months * 30)
    
    # Get transactions in date range
    transactions = await db.transactions.find({
        "user_id": current_user.id,
        "transaction_date": {"$gte": start_date, "$lte": end_date}
    }).to_list(1000)
    
    # Calculate analytics
    total_income = sum(t["amount"] for t in transactions if t["transaction_type"] in ["credit", "pix_received"])
    total_expenses = sum(t["amount"] for t in transactions if t["transaction_type"] in ["debit", "pix_sent", "bill_payment"])
    
    # Monthly spending
    monthly_spending = {}
    for transaction in transactions:
        month_key = transaction["transaction_date"].strftime("%Y-%m")
        if month_key not in monthly_spending:
            monthly_spending[month_key] = 0
        if transaction["transaction_type"] in ["debit", "pix_sent", "bill_payment"]:
            monthly_spending[month_key] += transaction["amount"]
    
    monthly_spending_list = [{"month": k, "amount": v} for k, v in monthly_spending.items()]
    
    # Category breakdown
    category_breakdown = {}
    for transaction in transactions:
        if transaction["transaction_type"] in ["debit", "pix_sent", "bill_payment"]:
            category = transaction["category"]
            if category not in category_breakdown:
                category_breakdown[category] = 0
            category_breakdown[category] += transaction["amount"]
    
    category_breakdown_list = [{"category": k, "amount": v} for k, v in category_breakdown.items()]
    
    # Top merchants
    merchant_spending = {}
    for transaction in transactions:
        merchant = transaction.get("merchant_name")
        if merchant and transaction["transaction_type"] in ["debit", "pix_sent", "bill_payment"]:
            if merchant not in merchant_spending:
                merchant_spending[merchant] = 0
            merchant_spending[merchant] += transaction["amount"]
    
    top_merchants = [{"merchant": k, "amount": v} for k, v in sorted(merchant_spending.items(), key=lambda x: x[1], reverse=True)[:5]]
    
    return TransactionAnalytics(
        total_income=total_income,
        total_expenses=total_expenses,
        monthly_spending=monthly_spending_list,
        category_breakdown=category_breakdown_list,
        top_merchants=top_merchants
    )

@router.post("/seed-data")
async def seed_transaction_data(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create sample transaction data for demonstration"""
    
    sample_transactions = [
        # Recent transactions
        {"type": TransactionType.DEBIT, "category": TransactionCategory.FOOD, "amount": 45.50, "description": "Lunch at Restaurant ABC", "merchant": "Restaurant ABC", "days_ago": 1},
        {"type": TransactionType.PIX_SENT, "category": TransactionCategory.TRANSFER, "amount": 200.00, "description": "Payment to friend", "recipient": "João Silva", "days_ago": 2},
        {"type": TransactionType.BILL_PAYMENT, "category": TransactionCategory.BILLS, "amount": 150.00, "description": "Electricity bill", "merchant": "Light Company", "days_ago": 3},
        {"type": TransactionType.DEBIT, "category": TransactionCategory.TRANSPORT, "amount": 25.00, "description": "Uber ride", "merchant": "Uber", "days_ago": 4},
        {"type": TransactionType.CREDIT, "category": TransactionCategory.OTHER, "amount": 1500.00, "description": "Salary deposit", "merchant": "Company XYZ", "days_ago": 5},
        {"type": TransactionType.DEBIT, "category": TransactionCategory.SHOPPING, "amount": 89.90, "description": "Online shopping", "merchant": "Amazon", "days_ago": 6},
        {"type": TransactionType.PIX_RECEIVED, "category": TransactionCategory.TRANSFER, "amount": 100.00, "description": "Payment received", "recipient": "Maria Santos", "days_ago": 7},
        {"type": TransactionType.DEBIT, "category": TransactionCategory.ENTERTAINMENT, "amount": 35.00, "description": "Movie tickets", "merchant": "Cinema 123", "days_ago": 8},
        {"type": TransactionType.BILL_PAYMENT, "category": TransactionCategory.BILLS, "amount": 80.00, "description": "Internet bill", "merchant": "ISP Provider", "days_ago": 10},
        {"type": TransactionType.DEBIT, "category": TransactionCategory.HEALTH, "amount": 120.00, "description": "Pharmacy", "merchant": "Pharmacy ABC", "days_ago": 12},
    ]
    
    account = await db.accounts.find_one({"user_id": current_user.id})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    for sample in sample_transactions:
        transaction_date = datetime.now() - timedelta(days=sample["days_ago"])
        
        transaction = Transaction(
            user_id=current_user.id,
            account_id=account["_id"],
            transaction_type=sample["type"],
            category=sample["category"],
            amount=sample["amount"],
            description=sample["description"],
            merchant_name=sample.get("merchant"),
            recipient_name=sample.get("recipient"),
            transaction_date=transaction_date,
            status="completed"
        )
        
        await db.transactions.insert_one(transaction.dict(by_alias=True))
    
    return {"message": f"Created {len(sample_transactions)} sample transactions"}