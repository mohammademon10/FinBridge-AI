from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.scenario import ScenarioCreate, ScenarioResponse
from app.db.database import list_scenarios, get_scenario_by_id, save_scenario

router = APIRouter(prefix="/api/scenarios", tags=["Scenarios"])

@router.get("", response_model=List[ScenarioResponse])
def get_all_scenarios() -> List[ScenarioResponse]:
    """
    Returns saved demonstration and user scenarios.
    """
    return [ScenarioResponse(**s) for s in list_scenarios()]

@router.post("", response_model=ScenarioResponse, status_code=status.HTTP_201_CREATED)
def create_new_scenario(scenario_in: ScenarioCreate) -> ScenarioResponse:
    """
    Saves a non-sensitive scenario for persistence and reproducible demonstration.
    """
    saved = save_scenario(scenario_in.model_dump())
    return ScenarioResponse(**saved)

@router.get("/{scenario_id}", response_model=ScenarioResponse)
def get_single_scenario(scenario_id: str) -> ScenarioResponse:
    """
    Retrieves a single saved scenario by ID.
    """
    item = get_scenario_by_id(scenario_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario with id '{scenario_id}' not found."
        )
    return ScenarioResponse(**item)
