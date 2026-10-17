from fastapi import APIRouter
from typing import List
from app.schemas.currency import CurrencyConversionRequest, CurrencyConversionResponse, CurrencyRate
from app.services.currency import convert_currency, get_currency_rates_list

router = APIRouter(prefix="/api/currency", tags=["Currency"])

@router.post("/convert", response_model=CurrencyConversionResponse)
def convert_amount(request: CurrencyConversionRequest) -> CurrencyConversionResponse:
    """
    Converts monetary amount between currencies using deterministic Decimal arithmetic.
    """
    return convert_currency(request)

@router.get("/rates", response_model=List[CurrencyRate])
def list_supported_rates() -> List[CurrencyRate]:
    """
    Returns available benchmark illustrative exchange rates with timestamps.
    """
    return get_currency_rates_list()
