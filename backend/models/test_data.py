from pydantic import BaseModel
from typing import Any, Dict
from configs.database import db

class TestResults(BaseModel):
    totalPrompts: int
    TruePositives: int
    TrueNegatives: int
    FalsePositives: int
    FalseNegatives: int

class TestChats(BaseModel):
    query: str
    response: str
    context: str
    expectedResult: Any
    calculatedResults: Dict[str, Any]  
