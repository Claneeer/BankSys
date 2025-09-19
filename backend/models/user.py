from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    cpf: str
    password: str
    full_name: str
    email: str
    phone: str
    profile_image: Optional[str] = None  # base64 encoded image
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    biometric_enabled: bool = False

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    cpf: str
    password: str
    full_name: str
    email: str
    phone: str

class UserLogin(BaseModel):
    cpf: str
    password: str

class UserResponse(BaseModel):
    id: str
    cpf: str
    full_name: str
    email: str
    phone: str
    profile_image: Optional[str] = None
    biometric_enabled: bool = False
    created_at: datetime