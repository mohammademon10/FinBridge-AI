from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """
    Returns system status, version, and feature configuration.
    """
    return HealthResponse(
        status="ok",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
        llm_configured=bool(settings.LLM_API_KEY.strip()),
        features={
            "deterministic_finance": True,
            "currency_conversion": True,
            "tuition_planner": True,
            "ai_assistant": True,
            "offline_demo_mode": True,
        }
    )
