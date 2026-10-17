from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from decimal import Decimal
from app.core.decimal_utils import to_decimal

class CurrencyRate(BaseModel):
    pair: str
    from_currency: str
    to_currency: str
    rate: str
    source: str
    timestamp: str
    is_illustrative: bool

class CurrencyConversionRequest(BaseModel):
    amount: str = Field(..., description="Monetary amount as a decimal string")
    from_currency: str = Field(..., min_length=3, max_length=5, description="Source ISO currency code")
    to_currency: str = Field(..., min_length=3, max_length=5, description="Target ISO currency code")
    custom_rate: Optional[str] = Field(default=None, description="Optional custom user-supplied rate")

    @field_validator("from_currency", "to_currency")
    @classmethod
    def normalize_code(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("amount", mode="before")
    @classmethod
    def validate_amount(cls, v: str) -> str:
        dec = to_decimal(v)
        if dec < Decimal("0.00"):
            raise ValueError("Amount cannot be negative.")
        return str(v).strip()

    @field_validator("custom_rate", mode="before")
    @classmethod
    def validate_rate(cls, v: Optional[str]) -> Optional[str]:
        if v is None or str(v).strip() == "":
            return None
        dec = to_decimal(v)
        if dec <= Decimal("0.00"):
            raise ValueError("Exchange rate must be strictly positive.")
        return str(v).strip()

class CurrencyConversionResponse(BaseModel):
    source_amount: str
    from_currency: str
    to_currency: str
    rate: str
    converted_amount: str
    rate_source: str
    rate_timestamp: str
    is_illustrative: bool
    assumptions: List[str]
