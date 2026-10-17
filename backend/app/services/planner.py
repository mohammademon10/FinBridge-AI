from decimal import Decimal
from typing import Optional, List
from app.core.decimal_utils import to_decimal, round_currency, format_currency
from app.schemas.planner import (
    TuitionPlannerRequest,
    TuitionPlannerResponse,
    ScenarioComparisonRequest,
    ScenarioComparisonResponse,
    ScenarioComparisonItem,
)

def plan_tuition(request: TuitionPlannerRequest) -> TuitionPlannerResponse:
    """
    Deterministic tuition and savings planner.
    Calculates monthly target, funding gap, and feasibility against monthly savings capacity.
    """
    target = round_currency(to_decimal(request.target_amount, "target_amount"))
    savings = round_currency(to_decimal(request.available_savings, "available_savings"))

    if target > savings:
        gap = target - savings
    else:
        gap = Decimal("0.00")

    if request.months_remaining <= 0:
        raise ValueError("Months remaining must be at least 1 month.")

    months_dec = Decimal(str(request.months_remaining))
    required_monthly = round_currency(gap / months_dec)

    status = "on_track"
    feasibility_message = "Plan is on track."
    capacity_dec: Optional[Decimal] = None
    shortfall_dec: Optional[Decimal] = None

    if request.monthly_savings_capacity is not None and request.monthly_savings_capacity.strip() != "":
        capacity_dec = round_currency(to_decimal(request.monthly_savings_capacity, "monthly_savings_capacity"))

    if gap == Decimal("0.00"):
        status = "achieved"
        feasibility_message = "Your tuition target is already fully covered by current available savings."
        shortfall_dec = Decimal("0.00")
    elif capacity_dec is not None:
        if capacity_dec >= required_monthly:
            status = "on_track"
            feasibility_message = (
                f"Achievable: your monthly savings capacity ({format_currency(capacity_dec)} {request.currency}) "
                f"covers the required monthly target ({format_currency(required_monthly)} {request.currency})."
            )
            shortfall_dec = Decimal("0.00")
        else:
            status = "shortfall"
            shortfall_dec = required_monthly - capacity_dec
            feasibility_message = (
                f"Monthly shortfall of {format_currency(shortfall_dec)} {request.currency}: "
                f"required saving is {format_currency(required_monthly)} {request.currency}/mo, "
                f"which exceeds your monthly capacity of {format_currency(capacity_dec)} {request.currency}/mo."
            )
    else:
        status = "on_track"
        feasibility_message = (
            f"You will need to save {format_currency(required_monthly)} {request.currency} per month "
            f"over the next {request.months_remaining} months to reach the goal."
        )

    assumptions = [
        f"Target amount: {format_currency(target)} {request.currency}.",
        f"Available savings: {format_currency(savings)} {request.currency}.",
        f"Planning period: {request.months_remaining} months.",
        "Rounding applied: standard financial ROUND_HALF_UP.",
    ]
    if request.payment_deadline:
        assumptions.append(f"Target deadline: {request.payment_deadline}.")

    return TuitionPlannerResponse(
        currency=request.currency,
        target_amount=format_currency(target),
        available_savings=format_currency(savings),
        funding_gap=format_currency(gap),
        months_remaining=request.months_remaining,
        payment_deadline=request.payment_deadline,
        required_monthly_savings=format_currency(required_monthly),
        monthly_savings_capacity=format_currency(capacity_dec) if capacity_dec is not None else None,
        savings_capacity_shortfall=format_currency(shortfall_dec) if shortfall_dec is not None else None,
        status=status,
        feasibility_message=feasibility_message,
        assumptions=assumptions,
    )

def compare_scenarios(request: ScenarioComparisonRequest) -> ScenarioComparisonResponse:
    """
    Compares Baseline vs Alternative financial scenario.
    """
    b_plan = plan_tuition(
        TuitionPlannerRequest(
            currency=request.currency,
            target_amount=request.baseline_target,
            available_savings=request.baseline_savings,
            months_remaining=request.baseline_months,
            monthly_savings_capacity=request.baseline_capacity,
        )
    )

    a_plan = plan_tuition(
        TuitionPlannerRequest(
            currency=request.currency,
            target_amount=request.alternative_target,
            available_savings=request.alternative_savings,
            months_remaining=request.alternative_months,
            monthly_savings_capacity=request.alternative_capacity,
        )
    )

    b_gap_dec = to_decimal(b_plan.funding_gap)
    a_gap_dec = to_decimal(a_plan.funding_gap)
    diff_gap = b_gap_dec - a_gap_dec

    b_monthly_dec = to_decimal(b_plan.required_monthly_savings)
    a_monthly_dec = to_decimal(a_plan.required_monthly_savings)
    diff_monthly = b_monthly_dec - a_monthly_dec

    if diff_gap > Decimal("0.00"):
        summary = (
            f"Alternative scenario reduces the overall funding gap by {format_currency(diff_gap)} {request.currency} "
            f"and lowers required monthly savings by {format_currency(diff_monthly)} {request.currency}/mo."
        )
    elif diff_gap < Decimal("0.00"):
        summary = (
            f"Alternative scenario increases total funding gap by {format_currency(abs(diff_gap))} {request.currency} "
            f"and requires {format_currency(abs(diff_monthly))} {request.currency}/mo more savings."
        )
    else:
        summary = "Both scenarios result in the same total funding gap."

    return ScenarioComparisonResponse(
        currency=request.currency,
        baseline=ScenarioComparisonItem(
            label="Baseline Scenario",
            total_cost=b_plan.target_amount,
            savings=b_plan.available_savings,
            gap=b_plan.funding_gap,
            required_monthly=b_plan.required_monthly_savings,
            is_feasible=b_plan.status != "shortfall",
        ),
        alternative=ScenarioComparisonItem(
            label="Alternative Scenario",
            total_cost=a_plan.target_amount,
            savings=a_plan.available_savings,
            gap=a_plan.funding_gap,
            required_monthly=a_plan.required_monthly_savings,
            is_feasible=a_plan.status != "shortfall",
        ),
        difference_gap=format_currency(diff_gap),
        difference_monthly=format_currency(diff_monthly),
        summary=summary,
    )
