from fastapi import APIRouter, HTTPException
from backend.configs.database import db
from backend.models.user import User

router = APIRouter()
@router.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await db["user"].find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user