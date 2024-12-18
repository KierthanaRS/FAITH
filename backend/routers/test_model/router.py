from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .handler.modelTest_handler import test_model_handler

router = APIRouter()

class DataType(BaseModel):
    query: str
    response: str
    context: str
    result: str


@router.post("/")
async def test_model(data: DataType):
    print(data)
    try:
        query = data.query
        response = data.response
        context = data.context
        result = data.result
        result = await test_model_handler(query, response, context, result)
        print(result)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
