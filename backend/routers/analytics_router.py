from fastapi import APIRouter, HTTPException
from configs.database import db
from models.analytics import Analytics
from typing import List

router = APIRouter()
# @router.get("/analytics/{model_name}")
# async def get_analytics(model_name: str):
#     analytics = await db["analytics"].find_one({"modelName": model_name})
#     if not analytics:
#         raise HTTPException(status_code=404, detail="Analytics not found")
#     return analytics

@router.get("/")
async def get_analytics():
    try:
        analytics_collection = db["Analytics"]
        data = await analytics_collection.find().to_list()
        models = []
        for i in data:
            models.append(i["modelName"])
            del i["_id"]
  
        return {"data": data, "models": models}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))