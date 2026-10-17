from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_currency_conversion_illustrative():
    payload = {
        "amount": "1000.00",
        "from_currency": "EUR",
        "to_currency": "USD"
    }
    res = client.post("/api/currency/convert", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["source_amount"] == "1000.00"
    assert data["from_currency"] == "EUR"
    assert data["to_currency"] == "USD"
    assert data["rate"] == "1.0850"
    assert data["converted_amount"] == "1085.00"
    assert data["is_illustrative"] is True

def test_currency_conversion_custom_rate():
    payload = {
        "amount": "500.00",
        "from_currency": "EUR",
        "to_currency": "CNY",
        "custom_rate": "8.0000"
    }
    res = client.post("/api/currency/convert", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["converted_amount"] == "4000.00"
    assert data["is_illustrative"] is False
    assert data["rate_source"] == "User-Supplied Rate"

def test_currency_identity():
    payload = {
        "amount": "250.50",
        "from_currency": "USD",
        "to_currency": "USD"
    }
    res = client.post("/api/currency/convert", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["converted_amount"] == "250.50"
    assert data["rate"] == "1.0000"

def test_currency_invalid_rate():
    payload = {
        "amount": "100.00",
        "from_currency": "EUR",
        "to_currency": "USD",
        "custom_rate": "-1.5"
    }
    res = client.post("/api/currency/convert", json=payload)
    assert res.status_code == 422
    data = res.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_list_supported_rates():
    res = client.get("/api/currency/rates")
    assert res.status_code == 200
    rates = res.json()
    assert len(rates) > 10
    assert any(r["pair"] == "EUR/USD" for r in rates)
