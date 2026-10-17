from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
from typing import Union

TWO_PLACES = Decimal("0.01")

def to_decimal(value: Union[str, int, float, Decimal], field_name: str = "amount") -> Decimal:
    """
    Safely converts an input into a Decimal.
    Rejects NaN, Inf, and invalid strings.
    """
    if value is None:
        raise ValueError(f"'{field_name}' cannot be None.")
    
    # Avoid float inaccuracies by converting via str
    try:
        dec = Decimal(str(value).strip())
    except (InvalidOperation, ValueError):
        raise ValueError(f"'{field_name}' must be a valid numeric amount.")
    
    if dec.is_nan() or dec.is_infinite():
        raise ValueError(f"'{field_name}' must be a finite number.")
    
    return dec

def round_currency(value: Union[str, int, float, Decimal]) -> Decimal:
    """
    Rounds a Decimal value to 2 decimal places using standard financial ROUND_HALF_UP.
    """
    dec = to_decimal(value)
    return dec.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)

def format_currency(value: Union[str, int, float, Decimal]) -> str:
    """
    Returns a standardized 2-decimal-place string representation (e.g. '1250.50').
    """
    return f"{round_currency(value):.2f}"

def validate_non_negative(value: Decimal, field_name: str = "amount") -> Decimal:
    """
    Ensures that a monetary value is not negative.
    """
    if value < Decimal("0.00"):
        raise ValueError(f"'{field_name}' cannot be negative.")
    return value
