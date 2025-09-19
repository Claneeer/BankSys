from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.no_info_after_validator_function(cls.validate, core_schema.str_schema())

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    def __str__(self):
        return str(super())

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