from pydantic import BaseModel

class Analytics(BaseModel):
    modelName: dict 
    promptCount: int
    hallucinationCount: int
