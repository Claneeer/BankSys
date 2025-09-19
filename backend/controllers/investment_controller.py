from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import random
from datetime import datetime

from ..models.user import User
from ..models.investment import (
    Investment, InvestmentCreate, InvestmentResponse, 
    PortfolioSummary, CryptoCurrency, CDBOption, InvestmentType
)
from ..controllers.auth_controller import get_current_user
from ..database import get_database

router = APIRouter(prefix="/investments", tags=["investments"])

# Mock cryptocurrency data
MOCK_CRYPTO_DATA = [
    {"symbol": "BTC", "name": "Bitcoin", "current_price": 98500.0, "price_change_24h": 1250.0, "price_change_percentage_24h": 1.28, "market_cap": 1950000000000, "volume_24h": 32000000000},
    {"symbol": "ETH", "name": "Ethereum", "current_price": 3850.0, "price_change_24h": -45.0, "price_change_percentage_24h": -1.15, "market_cap": 463000000000, "volume_24h": 18500000000},
    {"symbol": "ADA", "name": "Cardano", "current_price": 1.25, "price_change_24h": 0.08, "price_change_percentage_24h": 6.84, "market_cap": 44500000000, "volume_24h": 1200000000},
    {"symbol": "SOL", "name": "Solana", "current_price": 245.0, "price_change_24h": 12.5, "price_change_percentage_24h": 5.38, "market_cap": 115000000000, "volume_24h": 3500000000},
]

# Mock CDB options
MOCK_CDB_OPTIONS = [
    {"id": "cdb_001", "name": "CDB Prefixado 100% CDI", "bank_name": "BankSys", "interest_rate": 12.5, "minimum_investment": 1000.0, "maturity_months": 12, "type": "prefixed", "description": "Rendimento garantido de 12,5% ao ano"},
    {"id": "cdb_002", "name": "CDB Pós-fixado 110% CDI", "bank_name": "BankSys", "interest_rate": 13.75, "minimum_investment": 5000.0, "maturity_months": 24, "type": "postfixed", "description": "Rendimento atrelado a 110% do CDI"},
    {"id": "cdb_003", "name": "CDB Premium 120% CDI", "bank_name": "BankSys", "interest_rate": 15.0, "minimum_investment": 10000.0, "maturity_months": 36, "type": "postfixed", "description": "Nosso melhor CDB com 120% do CDI"},
]

@router.get("/portfolio", response_model=PortfolioSummary)
async def get_portfolio_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    investments = await db.investments.find({"user_id": current_user.id, "is_active": True}).to_list(100)
    
    if not investments:
        return PortfolioSummary(
            total_invested=0.0,
            current_value=0.0,
            total_profit_loss=0.0,
            total_profit_loss_percentage=0.0,
            investments_by_type=[]
        )
    
    total_invested = sum(inv["total_invested"] for inv in investments)
    current_value = sum(inv["current_value"] for inv in investments)
    total_profit_loss = current_value - total_invested
    total_profit_loss_percentage = (total_profit_loss / total_invested * 100) if total_invested > 0 else 0
    
    # Group by investment type
    investments_by_type = {}
    for inv in investments:
        inv_type = inv["investment_type"]
        if inv_type not in investments_by_type:
            investments_by_type[inv_type] = {"invested": 0, "current_value": 0, "count": 0}
        investments_by_type[inv_type]["invested"] += inv["total_invested"]
        investments_by_type[inv_type]["current_value"] += inv["current_value"]
        investments_by_type[inv_type]["count"] += 1
    
    investments_by_type_list = [
        {
            "type": k, 
            "invested": v["invested"], 
            "current_value": v["current_value"], 
            "count": v["count"],
            "profit_loss": v["current_value"] - v["invested"],
            "profit_loss_percentage": ((v["current_value"] - v["invested"]) / v["invested"] * 100) if v["invested"] > 0 else 0
        }
        for k, v in investments_by_type.items()
    ]
    
    return PortfolioSummary(
        total_invested=total_invested,
        current_value=current_value,
        total_profit_loss=total_profit_loss,
        total_profit_loss_percentage=total_profit_loss_percentage,
        investments_by_type=investments_by_type_list
    )

@router.get("/", response_model=List[InvestmentResponse])
async def get_investments(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    investments = await db.investments.find({"user_id": current_user.id, "is_active": True}).sort("created_at", -1).to_list(100)
    
    return [
        InvestmentResponse(
            id=str(investment["_id"]),
            investment_type=investment["investment_type"],
            asset_name=investment["asset_name"],
            symbol=investment.get("symbol"),
            quantity=investment["quantity"],
            purchase_price=investment["purchase_price"],
            current_price=investment["current_price"],
            current_value=investment["current_value"],
            profit_loss=investment["profit_loss"],
            profit_loss_percentage=investment["profit_loss_percentage"],
            purchase_date=investment["purchase_date"]
        )
        for investment in investments
    ]

@router.post("/", response_model=InvestmentResponse)
async def create_investment(
    investment_data: InvestmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if user has sufficient balance
    account = await db.accounts.find_one({"user_id": current_user.id})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    total_cost = investment_data.quantity * investment_data.purchase_price
    if account["balance"] < total_cost:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    
    # Create investment
    current_price = investment_data.purchase_price
    # Add some random variation for current price (simulating market changes)
    if investment_data.investment_type == InvestmentType.CRYPTOCURRENCY:
        price_variation = random.uniform(-0.1, 0.15)  # -10% to +15%
        current_price = investment_data.purchase_price * (1 + price_variation)
    elif investment_data.investment_type == InvestmentType.CDB:
        # CDB typically doesn't fluctuate much, just slight appreciation
        current_price = investment_data.purchase_price * 1.001  # Small appreciation
    
    current_value = investment_data.quantity * current_price
    profit_loss = current_value - total_cost
    profit_loss_percentage = (profit_loss / total_cost * 100) if total_cost > 0 else 0
    
    investment = Investment(
        user_id=current_user.id,
        investment_type=investment_data.investment_type,
        asset_name=investment_data.asset_name,
        symbol=investment_data.symbol,
        quantity=investment_data.quantity,
        purchase_price=investment_data.purchase_price,
        current_price=current_price,
        total_invested=total_cost,
        current_value=current_value,
        profit_loss=profit_loss,
        profit_loss_percentage=profit_loss_percentage,
        purchase_date=datetime.utcnow()
    )
    
    result = await db.investments.insert_one(investment.dict(by_alias=True))
    
    # Update account balance
    await db.accounts.update_one(
        {"_id": account["_id"]},
        {
            "$set": {
                "balance": account["balance"] - total_cost,
                "available_balance": account["available_balance"] - total_cost,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Create transaction record
    from ..models.transaction import Transaction, TransactionType, TransactionCategory
    transaction = Transaction(
        user_id=current_user.id,
        account_id=account["_id"],
        transaction_type=TransactionType.INVESTMENT,
        category=TransactionCategory.INVESTMENT,
        amount=total_cost,
        description=f"Investment in {investment_data.asset_name}",
        merchant_name="BankSys Investments",
        balance_after=account["balance"] - total_cost
    )
    await db.transactions.insert_one(transaction.dict(by_alias=True))
    
    return InvestmentResponse(
        id=str(result.inserted_id),
        investment_type=investment.investment_type,
        asset_name=investment.asset_name,
        symbol=investment.symbol,
        quantity=investment.quantity,
        purchase_price=investment.purchase_price,
        current_price=investment.current_price,
        current_value=investment.current_value,
        profit_loss=investment.profit_loss,
        profit_loss_percentage=investment.profit_loss_percentage,
        purchase_date=investment.purchase_date
    )

@router.get("/cryptocurrencies", response_model=List[CryptoCurrency])
async def get_cryptocurrencies():
    return [CryptoCurrency(**crypto) for crypto in MOCK_CRYPTO_DATA]

@router.get("/cdb-options", response_model=List[CDBOption])
async def get_cdb_options():
    return [CDBOption(**cdb) for cdb in MOCK_CDB_OPTIONS]

@router.post("/update-prices")
async def update_investment_prices(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update current prices for user's investments (simulate market changes)"""
    
    investments = await db.investments.find({"user_id": current_user.id, "is_active": True}).to_list(100)
    
    updated_count = 0
    for investment in investments:
        # Simulate price changes
        if investment["investment_type"] == InvestmentType.CRYPTOCURRENCY:
            price_change = random.uniform(-0.05, 0.08)  # -5% to +8%
        elif investment["investment_type"] == InvestmentType.CDB:
            price_change = random.uniform(0.0001, 0.002)  # Small positive changes for CDB
        else:
            price_change = random.uniform(-0.03, 0.05)  # -3% to +5%
        
        new_price = investment["purchase_price"] * (1 + price_change)
        new_current_value = investment["quantity"] * new_price
        new_profit_loss = new_current_value - investment["total_invested"]
        new_profit_loss_percentage = (new_profit_loss / investment["total_invested"] * 100) if investment["total_invested"] > 0 else 0
        
        await db.investments.update_one(
            {"_id": investment["_id"]},
            {
                "$set": {
                    "current_price": new_price,
                    "current_value": new_current_value,
                    "profit_loss": new_profit_loss,
                    "profit_loss_percentage": new_profit_loss_percentage,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        updated_count += 1
    
    return {"message": f"Updated prices for {updated_count} investments"}

@router.post("/seed-data")
async def seed_investment_data(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create sample investment data for demonstration"""
    
    sample_investments = [
        {
            "investment_type": InvestmentType.CRYPTOCURRENCY,
            "asset_name": "Bitcoin",
            "symbol": "BTC",
            "quantity": 0.01,
            "purchase_price": 95000.0
        },
        {
            "investment_type": InvestmentType.CRYPTOCURRENCY,
            "asset_name": "Ethereum",
            "symbol": "ETH",
            "quantity": 0.5,
            "purchase_price": 3800.0
        },
        {
            "investment_type": InvestmentType.CDB,
            "asset_name": "CDB Prefixado 100% CDI",
            "symbol": None,
            "quantity": 1,
            "purchase_price": 5000.0
        }
    ]
    
    created_count = 0
    for sample in sample_investments:
        try:
            investment_data = InvestmentCreate(**sample)
            await create_investment(investment_data, current_user, db)
            created_count += 1
        except HTTPException:
            # Skip if insufficient funds
            continue
    
    return {"message": f"Created {created_count} sample investments"}