from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.database import init_db
from app.api.health import router as health_router
from app.api.budget import router as budget_router
from app.api.currency import router as currency_router
from app.api.planner import router as planner_router
from app.api.agent import router as agent_router
from app.api.scenarios import router as scenarios_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed demo scenarios
    init_db()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Deterministic cross-border financial planning assistant for international students.",
    lifespan=lifespan,
)

# CORS configuration
is_wildcard = "*" in settings.CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if not is_wildcard else ["*"],
    allow_credentials=not is_wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standardized error response format matching architecture.md
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0] if errors else {}
    msg = str(first_error.get("msg", "Invalid input data provided."))
    loc = " -> ".join([str(x) for x in first_error.get("loc", [])])
    
    # Safe error serialization avoiding raw non-serializable objects
    safe_details = [
        {
            "loc": [str(x) for x in err.get("loc", [])],
            "msg": str(err.get("msg", "")),
            "type": str(err.get("type", "")),
        }
        for err in errors
    ]

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": f"{loc}: {msg}" if loc else msg,
                "details": safe_details,
            }
        },
    )

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": str(exc),
            }
        },
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected server error occurred. Please try again later.",
            }
        },
    )

# Include routes
app.include_router(health_router)
app.include_router(budget_router)
app.include_router(currency_router)
app.include_router(planner_router)
app.include_router(agent_router)
app.include_router(scenarios_router)

@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs_url": "/docs",
        "health_url": "/health",
    }
