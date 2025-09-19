from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

from ..models.user import User
from ..models.account import Account, CreditCard, AccountResponse, CreditCardResponse
from ..controllers.auth_controller import get_current_user
from ..database import get_database

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.get("/", response_model=List[AccountResponse])
async def get_user_accounts(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    accounts = await db.accounts.find({"user_id": current_user.id}).to_list(100)
    return [
        AccountResponse(
            id=str(account["_id"]),
            account_number=account["account_number"],
            account_type=account["account_type"],
            balance=account["balance"],
            available_balance=account["available_balance"],
            credit_limit=account.get("credit_limit")
        )
        for account in accounts
    ]

@router.get("/balance")
async def get_account_balance(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    account = await db.accounts.find_one({"user_id": current_user.id})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return {
        "balance": account["balance"],
        "available_balance": account["available_balance"],
        "account_number": account["account_number"]
    }

@router.get("/credit-cards", response_model=List[CreditCardResponse])
async def get_credit_cards(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Create a mock credit card if none exists
    existing_card = await db.credit_cards.find_one({"user_id": current_user.id})
    
    if not existing_card:
        from datetime import datetime, timedelta
        import random
        
        mock_card = CreditCard(
            user_id=current_user.id,
            card_number=f"**** **** **** {random.randint(1000, 9999)}",
            card_name="BankSys Platinum",
            credit_limit=5000.0,
            available_limit=4200.0,
            current_balance=800.0,
            due_date=datetime.now() + timedelta(days=15),
            minimum_payment=40.0
        )
        
        await db.credit_cards.insert_one(mock_card.dict(by_alias=True))
        existing_card = mock_card.dict(by_alias=True)
        existing_card["_id"] = mock_card.id
    
    cards = await db.credit_cards.find({"user_id": current_user.id}).to_list(10)
    
    return [
        CreditCardResponse(
            id=str(card["_id"]),
            card_number=card["card_number"],
            card_name=card["card_name"],
            credit_limit=card["credit_limit"],
            available_limit=card["available_limit"],
            current_balance=card["current_balance"],
            due_date=card["due_date"],
            minimum_payment=card["minimum_payment"]
        )
        for card in cards
    ]

@router.post("/update-balance")
async def update_balance(
    amount: float,
    operation: str,  # "add" or "subtract"
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    account = await db.accounts.find_one({"user_id": current_user.id})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    new_balance = account["balance"]
    if operation == "add":
        new_balance += amount
    elif operation == "subtract":
        if account["balance"] < amount:
            raise HTTPException(status_code=400, detail="Insufficient funds")
        new_balance -= amount
    else:
        raise HTTPException(status_code=400, detail="Invalid operation")
    
    await db.accounts.update_one(
        {"user_id": current_user.id},
        {
            "$set": {
                "balance": new_balance,
                "available_balance": new_balance,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"new_balance": new_balance}