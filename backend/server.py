from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
from bson import ObjectId
from pydantic import BaseModel, Field
import os
import logging
import random
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'banksys')]

# Auth setup
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "banksys-secret-key-2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class UserLogin(BaseModel):
    cpf: str
    password: str

class UserCreate(BaseModel):
    cpf: str
    password: str
    full_name: str
    email: str
    phone: str

class UserResponse(BaseModel):
    id: str
    cpf: str
    full_name: str
    email: str
    phone: str
    profile_image: Optional[str] = None
    biometric_enabled: bool = False
    created_at: datetime

class TransactionCreate(BaseModel):
    transaction_type: str
    category: str = "other"
    amount: float
    description: str
    merchant_name: Optional[str] = None
    recipient_name: Optional[str] = None

class PixPayment(BaseModel):
    pix_key: str
    amount: float
    description: str
    recipient_name: str

# Create the main app
app = FastAPI(title="BankSys API", description="Mobile Banking Application API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return user

# Root endpoints
@api_router.get("/")
async def root():
    return {"message": "BankSys API - Mobile Banking Application", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "banksys-api"}

# Auth endpoints
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"cpf": user_data.cpf})
    if existing_user:
        raise HTTPException(status_code=400, detail="CPF already registered")
    
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    user_dict["password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    user_dict["is_active"] = True
    user_dict["biometric_enabled"] = False
    
    result = await db.users.insert_one(user_dict)
    
    # Create default account for user
    account = {
        "user_id": result.inserted_id,
        "account_number": f"0001-{random.randint(10000, 99999)}",
        "account_type": "checking",
        "balance": 1000.0,
        "available_balance": 1000.0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True
    }
    await db.accounts.insert_one(account)
    
    return UserResponse(
        id=str(result.inserted_id),
        cpf=user_data.cpf,
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        profile_image=None,
        biometric_enabled=False,
        created_at=user_dict["created_at"]
    )

@api_router.post("/auth/login")
async def login(user_credentials: UserLogin):
    # Find user by CPF
    user_doc = await db.users.find_one({"cpf": user_credentials.cpf})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid CPF or password")
    
    # Verify password
    if not verify_password(user_credentials.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid CPF or password")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user_doc["_id"])}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=str(user_doc["_id"]),
            cpf=user_doc["cpf"],
            full_name=user_doc["full_name"],
            email=user_doc["email"],
            phone=user_doc["phone"],
            profile_image=user_doc.get("profile_image"),
            biometric_enabled=user_doc.get("biometric_enabled", False),
            created_at=user_doc["created_at"]
        )
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        cpf=current_user["cpf"],
        full_name=current_user["full_name"],
        email=current_user["email"],
        phone=current_user["phone"],
        profile_image=current_user.get("profile_image"),
        biometric_enabled=current_user.get("biometric_enabled", False),
        created_at=current_user["created_at"]
    )

# Account endpoints
@api_router.get("/accounts/balance")
async def get_account_balance(current_user = Depends(get_current_user)):
    account = await db.accounts.find_one({"user_id": current_user["_id"]})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return {
        "balance": account["balance"],
        "available_balance": account["available_balance"],
        "account_number": account["account_number"]
    }

@api_router.get("/accounts/credit-cards")
async def get_credit_cards(current_user = Depends(get_current_user)):
    # Create a mock credit card if none exists
    existing_card = await db.credit_cards.find_one({"user_id": current_user["_id"]})
    
    if not existing_card:
        mock_card = {
            "user_id": current_user["_id"],
            "card_number": f"**** **** **** {random.randint(1000, 9999)}",
            "card_name": "BankSys Platinum",
            "credit_limit": 5000.0,
            "available_limit": 4200.0,
            "current_balance": 800.0,
            "due_date": datetime.now() + timedelta(days=15),
            "minimum_payment": 40.0,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        result = await db.credit_cards.insert_one(mock_card)
        mock_card["_id"] = result.inserted_id
        existing_card = mock_card
    
    cards = await db.credit_cards.find({"user_id": current_user["_id"]}).to_list(10)
    
    return [
        {
            "id": str(card["_id"]),
            "card_number": card["card_number"],
            "card_name": card["card_name"],
            "credit_limit": card["credit_limit"],
            "available_limit": card["available_limit"],
            "current_balance": card["current_balance"],
            "due_date": card["due_date"],
            "minimum_payment": card["minimum_payment"]
        }
        for card in cards
    ]

# Transaction endpoints
@api_router.post("/transactions/")
async def create_transaction(transaction_data: TransactionCreate, current_user = Depends(get_current_user)):
    # Get user's account
    account = await db.accounts.find_one({"user_id": current_user["_id"]})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    # Check balance for debit transactions
    if transaction_data.transaction_type in ["debit", "pix_sent", "bill_payment"]:
        if account["balance"] < transaction_data.amount:
            raise HTTPException(status_code=400, detail="Insufficient funds")
    
    # Calculate new balance
    if transaction_data.transaction_type in ["credit", "pix_received"]:
        new_balance = account["balance"] + transaction_data.amount
    else:
        new_balance = account["balance"] - transaction_data.amount
    
    # Create transaction
    transaction = {
        "user_id": current_user["_id"],
        "account_id": account["_id"],
        "transaction_type": transaction_data.transaction_type,
        "category": transaction_data.category,
        "amount": transaction_data.amount,
        "description": transaction_data.description,
        "merchant_name": transaction_data.merchant_name,
        "recipient_name": transaction_data.recipient_name,
        "transaction_date": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "status": "completed",
        "balance_after": new_balance
    }
    
    result = await db.transactions.insert_one(transaction)
    
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
    
    return {
        "id": str(result.inserted_id),
        "transaction_type": transaction["transaction_type"],
        "category": transaction["category"],
        "amount": transaction["amount"],
        "description": transaction["description"],
        "merchant_name": transaction["merchant_name"],
        "recipient_name": transaction["recipient_name"],
        "transaction_date": transaction["transaction_date"],
        "status": transaction["status"],
        "balance_after": transaction["balance_after"]
    }

@api_router.get("/transactions/")
async def get_transactions(
    limit: int = Query(50, le=100),
    skip: int = Query(0, ge=0),
    current_user = Depends(get_current_user)
):
    transactions = await db.transactions.find({"user_id": current_user["_id"]}).sort("transaction_date", -1).skip(skip).limit(limit).to_list(limit)
    
    return [
        {
            "id": str(transaction["_id"]),
            "transaction_type": transaction["transaction_type"],
            "category": transaction["category"],
            "amount": transaction["amount"],
            "description": transaction["description"],
            "merchant_name": transaction.get("merchant_name"),
            "recipient_name": transaction.get("recipient_name"),
            "transaction_date": transaction["transaction_date"],
            "status": transaction["status"],
            "balance_after": transaction.get("balance_after")
        }
        for transaction in transactions
    ]

@api_router.post("/transactions/pix")
async def send_pix(pix_data: PixPayment, current_user = Depends(get_current_user)):
    # Create PIX transaction
    transaction_data = TransactionCreate(
        transaction_type="pix_sent",
        category="transfer",
        amount=pix_data.amount,
        description=pix_data.description,
        recipient_name=pix_data.recipient_name
    )
    
    return await create_transaction(transaction_data, current_user)

@api_router.post("/transactions/seed-data")
async def seed_transaction_data(current_user = Depends(get_current_user)):
    """Create sample transaction data for demonstration"""
    
    sample_transactions = [
        {"type": "debit", "category": "food", "amount": 45.50, "description": "Lunch at Restaurant ABC", "merchant": "Restaurant ABC", "days_ago": 1},
        {"type": "pix_sent", "category": "transfer", "amount": 200.00, "description": "Payment to friend", "recipient": "João Silva", "days_ago": 2},
        {"type": "bill_payment", "category": "bills", "amount": 150.00, "description": "Electricity bill", "merchant": "Light Company", "days_ago": 3},
        {"type": "debit", "category": "transport", "amount": 25.00, "description": "Uber ride", "merchant": "Uber", "days_ago": 4},
        {"type": "credit", "category": "other", "amount": 1500.00, "description": "Salary deposit", "merchant": "Company XYZ", "days_ago": 5},
        {"type": "debit", "category": "shopping", "amount": 89.90, "description": "Online shopping", "merchant": "Amazon", "days_ago": 6},
        {"type": "pix_received", "category": "transfer", "amount": 100.00, "description": "Payment received", "recipient": "Maria Santos", "days_ago": 7},
        {"type": "debit", "category": "entertainment", "amount": 35.00, "description": "Movie tickets", "merchant": "Cinema 123", "days_ago": 8},
    ]
    
    account = await db.accounts.find_one({"user_id": current_user["_id"]})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    for sample in sample_transactions:
        transaction_date = datetime.now() - timedelta(days=sample["days_ago"])
        
        transaction = {
            "user_id": current_user["_id"],
            "account_id": account["_id"],
            "transaction_type": sample["type"],
            "category": sample["category"],
            "amount": sample["amount"],
            "description": sample["description"],
            "merchant_name": sample.get("merchant"),
            "recipient_name": sample.get("recipient"),
            "transaction_date": transaction_date,
            "created_at": datetime.utcnow(),
            "status": "completed"
        }
        
        await db.transactions.insert_one(transaction)
    
    return {"message": f"Created {len(sample_transactions)} sample transactions"}

# Include the main API router in the app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown"""
    try:
        client.close()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error closing database connection: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)