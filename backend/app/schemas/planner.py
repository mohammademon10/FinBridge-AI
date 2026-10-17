from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Literal
from decimal import Decimal
from app.core.decimal_utils import to_decimal

class TuitionPlannerRequest(BaseModel):
    currency: str = Field(default="EUR", min_length=3, max_length=5)
    target_amount: str = Field(..., description="Target tuition or total cost required")
    available_savings: str = Field(..., description="Current available savings")
    months_remaining: int = Field(..., ge=1, le=120, description="Months remaining until payment deadline")
    monthly_savings_capacity: Optional[str] = Field(default=None, description="Current monthly savings capacity")
    payment_deadline: Optional[str] = Field(default=None, description="ISO Date string for deadline (e.g. 2026-09-01)")

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("target_amount", "available_savings", mode="before")
    @classmethod
    def validate_amounts(cls, v: str) -> str:
        dec = to_decimal(v)
        if dec < Decimal("0.00"):
            raise ValueError("Amount cannot be negative.")
        return str(v).strip()

    @field_validator("monthly_savings_capacity", mode="before")
    @classmethod
    def validate_capacity(cls, v: Optional[str]) -> Optional[str]:
        if v is None or str(v).strip() == "":
            return None
        dec = to_decimal(v)
        if dec < Decimal("0.00"):
            raise ValueError("Savings capacity cannot be negative.")
        return str(v).strip()

class TuitionPlannerResponse(BaseModel):
    currency: str
    target_amount: str
    available_savings: str
    funding_gap: str
    months_remaining: int
    payment_deadline: Optional[str] = None
    required_monthly_savings: str
    monthly_savings_capacity: Optional[str] = None
    savings_capacity_shortfall: Optional[str] = None
    status: Literal["achieved", "on_track", "shortfall"]
    feasibility_message: str
    assumptions: List[str]

class ScenarioComparisonItem(BaseModel):
    label: str
    total_cost: str
    savings: str
    gap: str
    required_monthly: str
    is_feasible: bool

class ScenarioComparisonRequest(BaseModel):
    currency: str = Field(default="EUR")
    baseline_target: str
    baseline_savings: str
    baseline_months: int
    baseline_capacity: Optional[str] = None

    alternative_target: str
    alternative_savings: str
    alternative_months: int
    alternative_capacity: Optional[str] = None

class ScenarioComparisonResponse(BaseModel):
    currency: str
    baseline: ScenarioComparisonItem
    alternative: ScenarioComparisonItem
    difference_gap: str
    difference_monthly: str
    summary: str
