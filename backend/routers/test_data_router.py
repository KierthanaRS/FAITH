from fastapi import APIRouter, HTTPException
from configs.database import db
from models.test_data import TestResults

router = APIRouter()

# @router.get("/test-results/{result_id}")
# async def get_test_results(result_id: str):
#     test_result = await db["test_results"].find_one({"_id": result_id})
#     if not test_result:
#         raise HTTPException(status_code=404, detail="Test result not found")
#     return test_result