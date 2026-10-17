from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app_name"] == "FinBridge AI"
    assert "version" in data
    assert "features" in data
    assert data["features"]["deterministic_finance"] is True

def test_root_endpoint_returns_info():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "FinBridge AI"
    assert "health_url" in data
