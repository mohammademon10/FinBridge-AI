from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_budget_analysis_standard():
    payload = {
        "currency": "EUR",
        "tuition": "9000.00",
        "living_costs": "7000.00",
        "other_costs": "800.00",
        "available_savings": "5000.00",
        "months_remaining": 10,
        "monthly_savings_capacity": "1000.00"
    }
    res = client.post("/api/budget/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["currency"] == "EUR"
    assert data["total_estimated_cost"] == "16800.00"
    assert data["available_savings"] == "5000.00"
    assert data["funding_gap"] == "11800.00"
    assert data["surplus"] == "0.00"
    assert data["required_monthly_savings"] == "1180.00"
    assert data["is_feasible"] is False
    assert data["savings_capacity_shortfall"] == "180.00"
    assert len(data["cost_breakdown"]) == 3

def test_budget_analysis_surplus():
    payload = {
        "currency": "USD",
        "tuition": "5000.00",
        "living_costs": "3000.00",
        "other_costs": "500.00",
        "available_savings": "10000.00",
        "months_remaining": 6
    }
    res = client.post("/api/budget/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_estimated_cost"] == "8500.00"
    assert data["funding_gap"] == "0.00"
    assert data["surplus"] == "1500.00"
    assert data["required_monthly_savings"] == "0.00"

def test_budget_analysis_no_deadline():
    payload = {
        "currency": "GBP",
        "tuition": "12000.00",
        "living_costs": "6000.00",
        "other_costs": "0.00",
        "available_savings": "5000.00"
    }
    res = client.post("/api/budget/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["funding_gap"] == "13000.00"
    assert data["required_monthly_savings"] is None

def test_budget_analysis_negative_amount_rejected():
    payload = {
        "currency": "EUR",
        "tuition": "-1000.00",
        "living_costs": "5000.00",
        "other_costs": "0.00",
        "available_savings": "2000.00"
    }
    res = client.post("/api/budget/analyze", json=payload)
    assert res.status_code == 422
    data = res.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_budget_rounding_precision():
    # 1000 / 3 months = 333.33333... -> 333.33
    payload = {
        "currency": "EUR",
        "tuition": "1000.00",
        "living_costs": "0.00",
        "other_costs": "0.00",
        "available_savings": "0.00",
        "months_remaining": 3
    }
    res = client.post("/api/budget/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["required_monthly_savings"] == "333.33"
