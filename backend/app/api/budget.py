from fastapi import APIRouter
from app.schemas.budget import BudgetAnalysisRequest, BudgetAnalysisResponse
from app.services.budget import calculate_budget

router = APIRouter(prefix="/api/budget", tags=["Budget"])

@router.post("/analyze", response_model=BudgetAnalysisResponse)
def analyze_budget(request: BudgetAnalysisRequest) -> BudgetAnalysisResponse:
    """
    Analyzes student budget inputs deterministically.
    Returns total estimated cost, funding gap, surplus, monthly savings target, and breakdown.
    """
    return calculate_budget(request)
