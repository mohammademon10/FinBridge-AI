from decimal import Decimal
from typing import Optional, List
from app.core.decimal_utils import to_decimal, round_currency, format_currency
from app.schemas.budget import BudgetAnalysisRequest, BudgetAnalysisResponse, CostBreakdownItem

def calculate_budget(request: BudgetAnalysisRequest) -> BudgetAnalysisResponse:
    """
    Deterministic budget calculation engine.
    Computes total estimated cost, funding gap, surplus, and required monthly savings.
    All calculations use Python Decimal with explicit ROUND_HALF_UP rounding.
    """
    tuition = round_currency(to_decimal(request.tuition, "tuition"))
    living_costs = round_currency(to_decimal(request.living_costs, "living_costs"))
    other_costs = round_currency(to_decimal(request.other_costs or "0.00", "other_costs"))
    savings = round_currency(to_decimal(request.available_savings, "available_savings"))

    total_cost = tuition + living_costs + other_costs

    # Funding gap = max(total estimated cost - savings, 0)
    # Surplus = max(savings - total estimated cost, 0)
    if total_cost > savings:
        funding_gap = total_cost - savings
        surplus = Decimal("0.00")
    else:
        funding_gap = Decimal("0.00")
        surplus = savings - total_cost

    # Required monthly savings
    required_monthly_savings: Optional[Decimal] = None
    if request.months_remaining is not None and request.months_remaining > 0:
        months_dec = Decimal(str(request.months_remaining))
        required_monthly_savings = round_currency(funding_gap / months_dec)

    # Feasibility check against monthly capacity
    monthly_capacity_dec: Optional[Decimal] = None
    capacity_shortfall: Optional[Decimal] = None
    is_feasible: Optional[bool] = None

    if request.monthly_savings_capacity is not None and request.monthly_savings_capacity.strip() != "":
        monthly_capacity_dec = round_currency(to_decimal(request.monthly_savings_capacity, "monthly_savings_capacity"))
        if required_monthly_savings is not None:
            if monthly_capacity_dec >= required_monthly_savings:
                is_feasible = True
                capacity_shortfall = Decimal("0.00")
            else:
                is_feasible = False
                capacity_shortfall = required_monthly_savings - monthly_capacity_dec

    # Cost breakdown percentages
    breakdown_items: List[CostBreakdownItem] = []
    if total_cost > Decimal("0.00"):
        t_pct = float(round_currency((tuition / total_cost) * Decimal("100")))
        l_pct = float(round_currency((living_costs / total_cost) * Decimal("100")))
        o_pct = float(round_currency((other_costs / total_cost) * Decimal("100")))
    else:
        t_pct = 0.0
        l_pct = 0.0
        o_pct = 0.0

    breakdown_items = [
        CostBreakdownItem(category="Tuition", amount=format_currency(tuition), percentage=t_pct),
        CostBreakdownItem(category="Living Expenses", amount=format_currency(living_costs), percentage=l_pct),
        CostBreakdownItem(category="Other Expenses", amount=format_currency(other_costs), percentage=o_pct),
    ]

    assumptions = [
        "All cost estimates are user-provided assumptions.",
        f"Arithmetic performed deterministically in {request.currency} using decimal-safe precision.",
        "Rounding rule applied: standard financial ROUND_HALF_UP to two decimal places.",
    ]
    if request.months_remaining is None:
        assumptions.append("No deadline provided; monthly savings target omitted.")
    else:
        assumptions.append(f"Planning horizon based on {request.months_remaining} remaining months.")

    return BudgetAnalysisResponse(
        currency=request.currency,
        total_estimated_cost=format_currency(total_cost),
        available_savings=format_currency(savings),
        funding_gap=format_currency(funding_gap),
        surplus=format_currency(surplus),
        months_remaining=request.months_remaining,
        required_monthly_savings=format_currency(required_monthly_savings) if required_monthly_savings is not None else None,
        monthly_savings_capacity=format_currency(monthly_capacity_dec) if monthly_capacity_dec is not None else None,
        savings_capacity_shortfall=format_currency(capacity_shortfall) if capacity_shortfall is not None else None,
        is_feasible=is_feasible,
        cost_breakdown=breakdown_items,
        assumptions=assumptions,
    )
