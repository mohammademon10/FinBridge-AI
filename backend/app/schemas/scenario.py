from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class ScenarioCreate(BaseModel):
    title: str = Field(..., max_length=100)
    base_currency: str = Field(default="EUR")
    target_currency: Optional[str] = Field(default=None)
    tuition: str
    living_costs: str
    other_costs: str = "0.00"
    available_savings: str
    months_remaining: Optional[int] = None
    monthly_savings_capacity: Optional[str] = None
    calculation_result: Dict[str, Any]

class ScenarioResponse(BaseModel):
    id: str
    created_at: str
    title: str
    base_currency: str
    target_currency: Optional[str] = None
    tuition: str
    living_costs: str
    other_costs: str
    available_savings: str
    months_remaining: Optional[int] = None
    monthly_savings_capacity: Optional[str] = None
    calculation_result: Dict[str, Any]
