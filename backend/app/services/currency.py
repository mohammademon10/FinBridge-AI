from decimal import Decimal
from datetime import datetime, timezone
from typing import Dict, List, Optional
from app.core.decimal_utils import to_decimal, round_currency, format_currency
from app.schemas.currency import CurrencyConversionRequest, CurrencyConversionResponse, CurrencyRate

# Benchmark illustrative rates table for student budgeting
# Clearly labelled as illustrative demo rates to comply with rules.md
ILLUSTRATIVE_RATES: Dict[str, str] = {
    "EUR/USD": "1.0850",
    "USD/EUR": "0.9217",
    "GBP/USD": "1.2950",
    "USD/GBP": "0.7722",
    "EUR/GBP": "0.8378",
    "GBP/EUR": "1.1936",
    "USD/CNY": "7.2350",
    "CNY/USD": "0.1382",
    "EUR/CNY": "7.8490",
    "CNY/EUR": "0.1274",
    "USD/CAD": "1.3780",
    "CAD/USD": "0.7257",
    "EUR/CAD": "1.4950",
    "CAD/EUR": "0.6689",
    "USD/AUD": "1.5240",
    "AUD/USD": "0.6562",
    "EUR/AUD": "1.6530",
    "AUD/EUR": "0.6050",
    "USD/HKD": "7.8100",
    "HKD/USD": "0.1280",
    "EUR/HKD": "8.4730",
    "HKD/EUR": "0.1180",
    "USD/SGD": "1.3450",
    "SGD/USD": "0.7435",
    "EUR/SGD": "1.4590",
    "SGD/EUR": "0.6854",
    "USD/JPY": "153.20",
    "JPY/USD": "0.00653",
}

def get_currency_rates_list() -> List[CurrencyRate]:
    """
    Returns list of supported illustrative currency exchange rates.
    """
    rates: List[CurrencyRate] = []
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    for pair, rate in ILLUSTRATIVE_RATES.items():
        from_cur, to_cur = pair.split("/")
        rates.append(
            CurrencyRate(
                pair=pair,
                from_currency=from_cur,
                to_currency=to_cur,
                rate=rate,
                source="FinBridge Illustrative Benchmark Matrix",
                timestamp=now_iso,
                is_illustrative=True,
            )
        )
    return rates

def resolve_exchange_rate(from_curr: str, to_curr: str, custom_rate: Optional[str] = None) -> tuple[Decimal, str, str, bool]:
    """
    Resolves rate value, source description, timestamp, and illustrative flag.
    """
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    if from_curr == to_curr:
        return Decimal("1.0000"), "Identity (1:1)", now_iso, False

    if custom_rate is not None and custom_rate.strip() != "":
        rate_dec = to_decimal(custom_rate, "custom_rate")
        if rate_dec <= Decimal("0.00"):
            raise ValueError("Exchange rate must be strictly greater than zero.")
        return rate_dec, "User-Supplied Rate", now_iso, False

    pair = f"{from_curr}/{to_curr}"
    if pair in ILLUSTRATIVE_RATES:
        rate_dec = to_decimal(ILLUSTRATIVE_RATES[pair])
        return rate_dec, "FinBridge Illustrative Benchmark Matrix", now_iso, True

    # Try inverse lookup
    inverse_pair = f"{to_curr}/{from_curr}"
    if inverse_pair in ILLUSTRATIVE_RATES:
        inv_dec = to_decimal(ILLUSTRATIVE_RATES[inverse_pair])
        rate_dec = round_currency(Decimal("1.000000") / inv_dec)
        return rate_dec, f"Calculated inverse of {inverse_pair} (Illustrative)", now_iso, True

    raise ValueError(
        f"Exchange rate for {pair} is unavailable. Please provide a custom exchange rate assumption."
    )

def convert_currency(request: CurrencyConversionRequest) -> CurrencyConversionResponse:
    """
    Deterministic currency conversion using Python Decimal.
    Multiplies source amount by exchange rate and rounds to 2 decimal places.
    """
    amount_dec = round_currency(to_decimal(request.amount, "amount"))
    rate_dec, source_label, timestamp_str, is_illustrative = resolve_exchange_rate(
        request.from_currency, request.to_currency, request.custom_rate
    )

    converted_dec = round_currency(amount_dec * rate_dec)

    assumptions = [
        f"Converted {request.from_currency} to {request.to_currency} at rate {rate_dec}.",
        f"Rate source: {source_label}.",
        "Calculations performed deterministically via Python Decimal.",
    ]
    if is_illustrative:
        assumptions.append("Rate is illustrative demo data and not a live bank market quote.")

    return CurrencyConversionResponse(
        source_amount=format_currency(amount_dec),
        from_currency=request.from_currency,
        to_currency=request.to_currency,
        rate=str(rate_dec),
        converted_amount=format_currency(converted_dec),
        rate_source=source_label,
        rate_timestamp=timestamp_str,
        is_illustrative=is_illustrative,
        assumptions=assumptions,
    )
