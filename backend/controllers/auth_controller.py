from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from ..models.user import User, UserCreate, UserLogin, UserResponse
from ..database import get_database

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "banksys-secret-key-2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncIOMotorDatabase = Depends(get_database)):
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
    return User(**user)

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Check if user already exists
    existing_user = await db.users.find_one({"cpf": user_data.cpf})
    if existing_user:
        raise HTTPException(status_code=400, detail="CPF already registered")
    
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user
    user_dict = user_data.dict()
    user_dict["password"] = hashed_password
    user = User(**user_dict)
    
    result = await db.users.insert_one(user.dict(by_alias=True))
    
    # Create default account for user
    from ..models.account import Account
    import random
    
    account = Account(
        user_id=result.inserted_id,
        account_number=f"0001-{random.randint(10000, 99999)}",
        balance=1000.0,  # Starting balance
        available_balance=1000.0
    )
    await db.accounts.insert_one(account.dict(by_alias=True))
    
    # Return user response
    user_response = UserResponse(
        id=str(result.inserted_id),
        cpf=user.cpf,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        profile_image=user.profile_image,
        biometric_enabled=user.biometric_enabled,
        created_at=user.created_at
    )
    
    return user_response

@router.post("/login")
async def login(user_credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Find user by CPF
    user_doc = await db.users.find_one({"cpf": user_credentials.cpf})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid CPF or password")
    
    user = User(**user_doc)
    
    # Verify password
    if not verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid CPF or password")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=str(user.id),
            cpf=user.cpf,
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            profile_image=user.profile_image,
            biometric_enabled=user.biometric_enabled,
            created_at=user.created_at
        )
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        cpf=current_user.cpf,
        full_name=current_user.full_name,
        email=current_user.email,
        phone=current_user.phone,
        profile_image=current_user.profile_image,
        biometric_enabled=current_user.biometric_enabled,
        created_at=current_user.created_at
    )