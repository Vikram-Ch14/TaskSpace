from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class RegisterUserSchema(BaseModel):
    username: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserResponseSchema(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime
    last_login_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
