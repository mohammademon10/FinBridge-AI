from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from decimal import Decimal
from app.core.decimal_utils import to_decimal

class BudgetAnalysisRequest(BaseModel):
    currency: str = Field(default="EUR", min_length=3, max_length=5, description="ISO Currency Code (e.g. EUR, USD, GBP, CNY)")
    tuition: str = Field(..., description="Estimated tuition fees as decimal string")
    living_costs: str = Field(..., description="Estimated accommodation and living expenses as decimal string")
    other_costs: str = Field(default="0.00", description="Other expenses like visa, insurance, flight")
    available_savings: str = Field(..., description="Currently available savings as decimal string")
    months_remaining: Optional[int] = Field(default=None, ge=1, le=120, description="Months remaining until payment deadline")
    monthly_savings_capacity: Optional[str] = Field(default=None, description="Current monthly savings capacity of the student/family")

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("tuition", "living_costs", "other_costs", "available_savings", mode="before")
    @classmethod
    def validate_amounts(cls, v: str) -> str:
        dec = to_decimal(v)
        if dec < Decimal("0.00"):
            raise ValueError("Monetary amount cannot be negative.")
        return str(v).strip()

    @field_validator("monthly_savings_capacity", mode="before")
    @classmethod
    def validate_optional_capacity(cls, v: Optional[str]) -> Optional[str]:
        if v is None or str(v).strip() == "":
            return None
        dec = to_decimal(v)
        if dec < Decimal("0.00"):
            raise ValueError("Monthly savings capacity cannot be negative.")
        return str(v).strip()


class CostBreakdownItem(BaseModel):
    category: str
    amount: str
    percentage: float


class BudgetAnalysisResponse(BaseModel):
    currency: str
    total_estimated_cost: str
    available_savings: str
    funding_gap: str
    surplus: str
    months_remaining: Optional[int] = None
    required_monthly_savings: Optional[str] = None
    monthly_savings_capacity: Optional[str] = None
    savings_capacity_shortfall: Optional[str] = None
    is_feasible: Optional[bool] = None
    cost_breakdown: List[CostBreakdownItem]
    assumptions: List[str]
