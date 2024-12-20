from pydantic import BaseModel, EmailStr
from typing import Dict, List,Union

class SignUpRequest(BaseModel):
    username: str
    email: EmailStr
    avatar: str
    password: str

class SignInRequest(BaseModel):
    username: str
    password: str
