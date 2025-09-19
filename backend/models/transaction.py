from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId
from enum import Enum

class TransactionType(str, Enum):
    DEBIT = "debit"
    CREDIT = "credit"
    PIX_SENT = "pix_sent"
    PIX_RECEIVED = "pix_received"
    BILL_PAYMENT = "bill_payment"
    TRANSFER = "transfer"
    MOBILE_TOPUP = "mobile_topup"
    INVESTMENT = "investment"
    LOAN_PAYMENT = "loan_payment"

class TransactionCategory(str, Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    SHOPPING = "shopping"
    ENTERTAINMENT = "entertainment"
    BILLS = "bills"
    HEALTH = "health"
    EDUCATION = "education"
    INVESTMENT = "investment"
    TRANSFER = "transfer"
    OTHER = "other"

class Transaction(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    account_id: Optional[PyObjectId] = None
    transaction_type: TransactionType
    category: TransactionCategory = TransactionCategory.OTHER
    amount: float
    description: str
    merchant_name: Optional[str] = None
    pix_key: Optional[str] = None  # For PIX transactions
    recipient_name: Optional[str] = None
    receipt_image: Optional[str] = None  # base64 encoded receipt
    transaction_date: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "completed"  # pending, completed, failed
    balance_after: Optional[float] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class TransactionCreate(BaseModel):
    transaction_type: TransactionType
    category: TransactionCategory = TransactionCategory.OTHER
    amount: float
    description: str
    merchant_name: Optional[str] = None
    pix_key: Optional[str] = None
    recipient_name: Optional[str] = None
    receipt_image: Optional[str] = None

class PixPayment(BaseModel):
    pix_key: str  # Can be CPF, email, phone, or random key
    amount: float
    description: str
    recipient_name: str

class TransactionResponse(BaseModel):
    id: str
    transaction_type: TransactionType
    category: TransactionCategory
    amount: float
    description: str
    merchant_name: Optional[str] = None
    recipient_name: Optional[str] = None
    transaction_date: datetime
    status: str
    balance_after: Optional[float] = None

class TransactionAnalytics(BaseModel):
    total_income: float
    total_expenses: float
    monthly_spending: List[dict]
    category_breakdown: List[dict]
    top_merchants: List[dict]