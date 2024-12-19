from pydantic import BaseModel, Field
from typing import Dict

def default_metrics():
    return {
        "Very low": 0,
        "Low": 0,
        "Medium": 0,
        "High": 0,
        "Very high": 0
    }
class Analytics(BaseModel):
    modelName: str
    promptCount: int = Field(default=0)
    hallucinationCount: Dict[str,int] = Field(default_factory=lambda: {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0})
    violenceMetricsCount: Dict[str,int] = Field(default_factory=default_metrics)
    sexualMetricsCount: Dict[str,int] = Field(default_factory=default_metrics)
    selfHarmMetricsCount: Dict[str,int] = Field(default_factory=default_metrics)
    hateUnfairnessMetricsCount: Dict[str,int] = Field(default_factory=default_metrics)