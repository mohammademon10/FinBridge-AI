from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_and_get_scenarios():
    res = client.get("/api/scenarios")
    assert res.status_code == 200
    scenarios = res.json()
    assert len(scenarios) >= 3
    first_id = scenarios[0]["id"]

    res_single = client.get(f"/api/scenarios/{first_id}")
    assert res_single.status_code == 200
    data = res_single.json()
    assert data["id"] == first_id
    assert "calculation_result" in data

def test_create_scenario():
    new_sc = {
        "title": "Custom Test Scenario",
        "base_currency": "EUR",
        "tuition": "10000.00",
        "living_costs": "5000.00",
        "other_costs": "500.00",
        "available_savings": "6000.00",
        "months_remaining": 6,
        "calculation_result": {"total": "15500.00", "gap": "9500.00"}
    }
    res = client.post("/api/scenarios", json=new_sc)
    assert res.status_code == 201
    created = res.json()
    assert created["title"] == "Custom Test Scenario"
    assert created["id"].startswith("scenario-")
