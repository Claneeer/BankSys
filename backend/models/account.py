from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId

class Account(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    account_number: str
    account_type: str = "checking"  # checking, savings
    balance: float = 0.0
    available_balance: float = 0.0
    credit_limit: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CreditCard(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    card_number: str
    card_name: str
    credit_limit: float
    available_limit: float
    current_balance: float = 0.0
    due_date: datetime
    minimum_payment: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class AccountResponse(BaseModel):
    id: str
    account_number: str
    account_type: str
    balance: float
    available_balance: float
    credit_limit: Optional[float] = None

class CreditCardResponse(BaseModel):
    id: str
    card_number: str
    card_name: str
    credit_limit: float
    available_limit: float
    current_balance: float
    due_date: datetime
    minimum_payment: float