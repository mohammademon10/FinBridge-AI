from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_tuition_planner_shortfall():
    payload = {
        "currency": "EUR",
        "target_amount": "12000.00",
        "available_savings": "2000.00",
        "months_remaining": 10,
        "monthly_savings_capacity": "500.00",
        "payment_deadline": "2026-09-01"
    }
    res = client.post("/api/planner/tuition", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["funding_gap"] == "10000.00"
    assert data["required_monthly_savings"] == "1000.00"
    assert data["status"] == "shortfall"
    assert data["savings_capacity_shortfall"] == "500.00"
    assert "Monthly shortfall" in data["feasibility_message"]

def test_tuition_planner_achieved():
    payload = {
        "currency": "GBP",
        "target_amount": "8000.00",
        "available_savings": "9000.00",
        "months_remaining": 6
    }
    res = client.post("/api/planner/tuition", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["funding_gap"] == "0.00"
    assert data["required_monthly_savings"] == "0.00"
    assert data["status"] == "achieved"

def test_scenario_comparison():
    payload = {
        "currency": "EUR",
        "baseline_target": "18000.00",
        "baseline_savings": "4000.00",
        "baseline_months": 10,
        "baseline_capacity": "1000.00",
        "alternative_target": "14000.00",
        "alternative_savings": "4000.00",
        "alternative_months": 10,
        "alternative_capacity": "1000.00"
    }
    res = client.post("/api/planner/compare", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["baseline"]["gap"] == "14000.00"
    assert data["alternative"]["gap"] == "10000.00"
    assert data["difference_gap"] == "4000.00"
    assert data["difference_monthly"] == "400.00"
    assert "reduces the overall funding gap" in data["summary"]
