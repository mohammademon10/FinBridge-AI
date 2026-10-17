import sqlite3
import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from app.core.config import settings

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Ensure table is initialized on module load
init_done = False

def ensure_initialized():
    global init_done
    if not init_done:
        init_db()
        init_done = True

def init_db():
    """
    Initializes SQLite database and tables.
    Seeds default realistic benchmark student scenarios.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scenarios (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                title TEXT NOT NULL,
                base_currency TEXT NOT NULL,
                target_currency TEXT,
                tuition TEXT NOT NULL,
                living_costs TEXT NOT NULL,
                other_costs TEXT NOT NULL,
                available_savings TEXT NOT NULL,
                months_remaining INTEGER,
                monthly_savings_capacity TEXT,
                calculation_result_json TEXT NOT NULL
            )
        """)
        conn.commit()

        # Check if table already has rows
        cursor.execute("SELECT COUNT(*) FROM scenarios")
        count = cursor.fetchone()[0]
        if count == 0:
            seed_default_scenarios(conn)

def seed_default_scenarios(conn: sqlite3.Connection):
    """
    Seeds initial realistic student scenarios for demo testing.
    """
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    scenarios = [
        (
            "scenario-tum-germany",
            now,
            "MSc Computer Science — TU Munich (Germany)",
            "EUR",
            "EUR",
            "3000.00",
            "10800.00",
            "1200.00",
            "5000.00",
            10,
            "800.00",
            json.dumps({
                "currency": "EUR",
                "total_estimated_cost": "15000.00",
                "available_savings": "5000.00",
                "funding_gap": "10000.00",
                "surplus": "0.00",
                "required_monthly_savings": "1000.00",
                "monthly_savings_capacity": "800.00",
                "savings_capacity_shortfall": "200.00",
                "is_feasible": False
            })
        ),
        (
            "scenario-imperial-uk",
            now,
            "MSc FinTech — Imperial College London (UK)",
            "GBP",
            "GBP",
            "39500.00",
            "16500.00",
            "2000.00",
            "20000.00",
            12,
            "2500.00",
            json.dumps({
                "currency": "GBP",
                "total_estimated_cost": "58000.00",
                "available_savings": "20000.00",
                "funding_gap": "38000.00",
                "surplus": "0.00",
                "required_monthly_savings": "3166.67",
                "monthly_savings_capacity": "2500.00",
                "savings_capacity_shortfall": "666.67",
                "is_feasible": False
            })
        ),
        (
            "scenario-toronto-canada",
            now,
            "BSc Data Science — University of Toronto (Canada)",
            "CAD",
            "CAD",
            "32000.00",
            "14000.00",
            "1500.00",
            "15000.00",
            8,
            "4000.00",
            json.dumps({
                "currency": "CAD",
                "total_estimated_cost": "47500.00",
                "available_savings": "15000.00",
                "funding_gap": "32500.00",
                "surplus": "0.00",
                "required_monthly_savings": "4062.50",
                "monthly_savings_capacity": "4000.00",
                "savings_capacity_shortfall": "62.50",
                "is_feasible": False
            })
        )
    ]
    cursor = conn.cursor()
    cursor.executemany("""
        INSERT INTO scenarios (
            id, created_at, title, base_currency, target_currency,
            tuition, living_costs, other_costs, available_savings,
            months_remaining, monthly_savings_capacity, calculation_result_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, scenarios)
    conn.commit()

def list_scenarios() -> List[Dict[str, Any]]:
    ensure_initialized()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM scenarios ORDER BY created_at DESC")
        rows = cursor.fetchall()
        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "created_at": r["created_at"],
                "title": r["title"],
                "base_currency": r["base_currency"],
                "target_currency": r["target_currency"],
                "tuition": r["tuition"],
                "living_costs": r["living_costs"],
                "other_costs": r["other_costs"],
                "available_savings": r["available_savings"],
                "months_remaining": r["months_remaining"],
                "monthly_savings_capacity": r["monthly_savings_capacity"],
                "calculation_result": json.loads(r["calculation_result_json"]),
            })
        return results

def get_scenario_by_id(scenario_id: str) -> Optional[Dict[str, Any]]:
    ensure_initialized()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM scenarios WHERE id = ?", (scenario_id,))
        r = cursor.fetchone()
        if not r:
            return None
        return {
            "id": r["id"],
            "created_at": r["created_at"],
            "title": r["title"],
            "base_currency": r["base_currency"],
            "target_currency": r["target_currency"],
            "tuition": r["tuition"],
            "living_costs": r["living_costs"],
            "other_costs": r["other_costs"],
            "available_savings": r["available_savings"],
            "months_remaining": r["months_remaining"],
            "monthly_savings_capacity": r["monthly_savings_capacity"],
            "calculation_result": json.loads(r["calculation_result_json"]),
        }

def save_scenario(data: Dict[str, Any]) -> Dict[str, Any]:
    ensure_initialized()
    sc_id = f"scenario-{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO scenarios (
                id, created_at, title, base_currency, target_currency,
                tuition, living_costs, other_costs, available_savings,
                months_remaining, monthly_savings_capacity, calculation_result_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            sc_id,
            now,
            data["title"],
            data.get("base_currency", "EUR"),
            data.get("target_currency"),
            str(data["tuition"]),
            str(data["living_costs"]),
            str(data.get("other_costs", "0.00")),
            str(data["available_savings"]),
            data.get("months_remaining"),
            data.get("monthly_savings_capacity"),
            json.dumps(data.get("calculation_result", {})),
        ))
        conn.commit()
    return get_scenario_by_id(sc_id)  # type: ignore
