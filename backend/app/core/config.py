import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseModel):
    APP_NAME: str = "FinBridge AI"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", str(BASE_DIR / "app" / "finbridge.db"))
    
    # Optional LLM configuration
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")
    
    # Optional Exchange Rate API
    CURRENCY_API_KEY: str = os.getenv("CURRENCY_API_KEY", "")

    # Allowed CORS Origins (supports comma-separated origins via environment variable)
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:8000,http://127.0.0.1:8000"
        ).split(",")
        if origin.strip()
    ]

settings = Settings()
