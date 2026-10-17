from typing import Dict, Any
from app.schemas.budget import BudgetAnalysisRequest
from app.schemas.currency import CurrencyConversionRequest
from app.schemas.planner import TuitionPlannerRequest, ScenarioComparisonRequest
from app.services.budget import calculate_budget
from app.services.currency import convert_currency
from app.services.planner import plan_tuition, compare_scenarios

ALLOWLISTED_TOOLS = [
    {
        "name": "analyze_budget",
        "description": "Calculates total cost, funding gap, surplus, and required monthly savings from tuition, living, and savings.",
        "parameters": {
            "type": "object",
            "properties": {
                "currency": {"type": "string", "default": "EUR"},
                "tuition": {"type": "string", "description": "Tuition fees as decimal string"},
                "living_costs": {"type": "string", "description": "Living expenses as decimal string"},
                "other_costs": {"type": "string", "default": "0.00"},
                "available_savings": {"type": "string", "description": "Savings as decimal string"},
                "months_remaining": {"type": "integer", "description": "Months until payment deadline"},
                "monthly_savings_capacity": {"type": "string", "description": "Monthly savings capacity"}
            },
            "required": ["tuition", "living_costs", "available_savings"]
        }
    },
    {
        "name": "convert_currency",
        "description": "Converts money between currencies using verified or benchmark illustrative exchange rates.",
        "parameters": {
            "type": "object",
            "properties": {
                "amount": {"type": "string"},
                "from_currency": {"type": "string"},
                "to_currency": {"type": "string"},
                "custom_rate": {"type": "string", "description": "Optional custom rate"}
            },
            "required": ["amount", "from_currency", "to_currency"]
        }
    },
    {
        "name": "plan_tuition",
        "description": "Calculates tuition target feasibility, funding gap, and required monthly savings.",
        "parameters": {
            "type": "object",
            "properties": {
                "currency": {"type": "string", "default": "EUR"},
                "target_amount": {"type": "string"},
                "available_savings": {"type": "string"},
                "months_remaining": {"type": "integer"},
                "monthly_savings_capacity": {"type": "string"}
            },
            "required": ["target_amount", "available_savings", "months_remaining"]
        }
    },
    {
        "name": "compare_scenarios",
        "description": "Compares baseline vs alternative financial scenarios.",
        "parameters": {
            "type": "object",
            "properties": {
                "currency": {"type": "string", "default": "EUR"},
                "baseline_target": {"type": "string"},
                "baseline_savings": {"type": "string"},
                "baseline_months": {"type": "integer"},
                "alternative_target": {"type": "string"},
                "alternative_savings": {"type": "string"},
                "alternative_months": {"type": "integer"}
            },
            "required": ["baseline_target", "baseline_savings", "baseline_months", "alternative_target", "alternative_savings", "alternative_months"]
        }
    }
]

def execute_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Safely executes an allowlisted backend financial tool.
    Returns structured results dictionary.
    """
    if tool_name == "analyze_budget":
        req = BudgetAnalysisRequest(
            currency=arguments.get("currency", "EUR"),
            tuition=str(arguments.get("tuition", "0.00")),
            living_costs=str(arguments.get("living_costs", "0.00")),
            other_costs=str(arguments.get("other_costs", "0.00")),
            available_savings=str(arguments.get("available_savings", "0.00")),
            months_remaining=int(arguments["months_remaining"]) if arguments.get("months_remaining") is not None else None,
            monthly_savings_capacity=str(arguments["monthly_savings_capacity"]) if arguments.get("monthly_savings_capacity") else None,
        )
        return calculate_budget(req).model_dump()

    elif tool_name == "convert_currency":
        req = CurrencyConversionRequest(
            amount=str(arguments.get("amount", "0.00")),
            from_currency=str(arguments.get("from_currency", "EUR")),
            to_currency=str(arguments.get("to_currency", "USD")),
            custom_rate=str(arguments["custom_rate"]) if arguments.get("custom_rate") else None,
        )
        return convert_currency(req).model_dump()

    elif tool_name == "plan_tuition":
        req = TuitionPlannerRequest(
            currency=arguments.get("currency", "EUR"),
            target_amount=str(arguments.get("target_amount", "0.00")),
            available_savings=str(arguments.get("available_savings", "0.00")),
            months_remaining=int(arguments.get("months_remaining", 1)),
            monthly_savings_capacity=str(arguments["monthly_savings_capacity"]) if arguments.get("monthly_savings_capacity") else None,
        )
        return plan_tuition(req).model_dump()

    elif tool_name == "compare_scenarios":
        req = ScenarioComparisonRequest(
            currency=arguments.get("currency", "EUR"),
            baseline_target=str(arguments.get("baseline_target", "0.00")),
            baseline_savings=str(arguments.get("baseline_savings", "0.00")),
            baseline_months=int(arguments.get("baseline_months", 1)),
            alternative_target=str(arguments.get("alternative_target", "0.00")),
            alternative_savings=str(arguments.get("alternative_savings", "0.00")),
            alternative_months=int(arguments.get("alternative_months", 1)),
        )
        return compare_scenarios(req).model_dump()

    raise ValueError(f"Unknown or non-allowlisted tool: {tool_name}")
