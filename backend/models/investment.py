from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId
from enum import Enum

class InvestmentType(str, Enum):
    CRYPTOCURRENCY = "cryptocurrency"
    CDB = "cdb"
    STOCKS = "stocks"
    MUTUAL_FUND = "mutual_fund"

class Investment(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    investment_type: InvestmentType
    asset_name: str
    symbol: Optional[str] = None  # For crypto/stocks
    quantity: float
    purchase_price: float
    current_price: float
    total_invested: float
    current_value: float
    profit_loss: float
    profit_loss_percentage: float
    purchase_date: datetime
    maturity_date: Optional[datetime] = None  # For CDB
    interest_rate: Optional[float] = None  # For CDB
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CryptoCurrency(BaseModel):
    symbol: str
    name: str
    current_price: float
    price_change_24h: float
    price_change_percentage_24h: float
    market_cap: float
    volume_24h: float

class CDBOption(BaseModel):
    id: str
    name: str
    bank_name: str = "BankSys"
    interest_rate: float
    minimum_investment: float
    maturity_months: int
    type: str = "prefixed"  # prefixed, postfixed
    description: str

class InvestmentCreate(BaseModel):
    investment_type: InvestmentType
    asset_name: str
    symbol: Optional[str] = None
    quantity: float
    purchase_price: float

class InvestmentResponse(BaseModel):
    id: str
    investment_type: InvestmentType
    asset_name: str
    symbol: Optional[str] = None
    quantity: float
    purchase_price: float
    current_price: float
    current_value: float
    profit_loss: float
    profit_loss_percentage: float
    purchase_date: datetime

class PortfolioSummary(BaseModel):
    total_invested: float
    current_value: float
    total_profit_loss: float
    total_profit_loss_percentage: float
    investments_by_type: List[dict]