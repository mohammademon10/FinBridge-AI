from fastapi import APIRouter
from app.schemas.planner import (
    TuitionPlannerRequest,
    TuitionPlannerResponse,
    ScenarioComparisonRequest,
    ScenarioComparisonResponse,
)
from app.services.planner import plan_tuition, compare_scenarios

router = APIRouter(prefix="/api/planner", tags=["Planner"])

@router.post("/tuition", response_model=TuitionPlannerResponse)
def calculate_tuition_plan(request: TuitionPlannerRequest) -> TuitionPlannerResponse:
    """
    Calculates tuition timeline, funding gap, and savings feasibility.
    """
    return plan_tuition(request)

@router.post("/compare", response_model=ScenarioComparisonResponse)
def compare_plan_scenarios(request: ScenarioComparisonRequest) -> ScenarioComparisonResponse:
    """
    Compares baseline vs alternative financial scenarios.
    """
    return compare_scenarios(request)
