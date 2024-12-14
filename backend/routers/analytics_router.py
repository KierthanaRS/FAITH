from fastapi import APIRouter, HTTPException
from configs.database import db
from models.analytics import Analytics

router = APIRouter()
# @router.get("/analytics/{model_name}")
# async def get_analytics(model_name: str):
#     analytics = await db["analytics"].find_one({"modelName": model_name})
#     if not analytics:
#         raise HTTPException(status_code=404, detail="Analytics not found")
#     return analytics