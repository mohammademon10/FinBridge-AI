from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_agent_chat_general_greeting():
    res = client.post("/api/agent/chat", json={"message": "Hello!"})
    assert res.status_code == 200
    data = res.json()
    assert "FinBridge AI Assistant" in data["answer"]
    assert data["mode"] == "demo"

def test_agent_chat_currency_conversion():
    res = client.post("/api/agent/chat", json={"message": "Convert 1000 EUR to USD"})
    assert res.status_code == 200
    data = res.json()
    assert "1085.00 USD" in data["answer"]
    assert len(data["tool_results"]) == 1
    assert data["tool_results"][0]["tool"] == "convert_currency"

def test_agent_chat_budget_analysis_with_context():
    context = {
        "currency": "EUR",
        "tuition": "9000.00",
        "living_costs": "7000.00",
        "available_savings": "5000.00",
        "months_remaining": 10
    }
    res = client.post("/api/agent/chat", json={
        "message": "Can I afford my study budget?",
        "scenario_context": context
    })
    assert res.status_code == 200
    data = res.json()
    assert "16000.00 EUR" in data["answer"] or "11000.00 EUR" in data["answer"]
    assert len(data["tool_results"]) == 1
    assert data["tool_results"][0]["tool"] == "analyze_budget"

def test_agent_chat_missing_parameters_clarification():
    res = client.post("/api/agent/chat", json={"message": "What is my budget shortfall?"})
    assert res.status_code == 200
    data = res.json()
    assert "please provide" in data["answer"].lower()
    assert len(data["tool_results"]) == 0

def test_agent_chat_transfer_safety_guardrail():
    res = client.post("/api/agent/chat", json={"message": "Please send money to my university account now"})
    assert res.status_code == 200
    data = res.json()
    assert "does not execute payments" in data["answer"]
    assert len(data["tool_results"]) == 0
