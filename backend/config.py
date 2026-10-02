"""
PolarNav AI - Centralized Backend Configuration
Loads environment variables securely using python-dotenv.
Exposes typed settings and prevents hardcoding of secrets across modules.
"""

import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Locate and load .env file from backend directory or project root
BACKEND_DIR = Path(__file__).resolve().parent
ENV_PATH = BACKEND_DIR / ".env"
ROOT_ENV_PATH = BACKEND_DIR.parent / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
elif ROOT_ENV_PATH.exists():
    load_dotenv(dotenv_path=ROOT_ENV_PATH)
else:
    load_dotenv()


class Settings:
    """Central configuration container for PolarNav AI backend."""

    # ── Server & Runtime Environment ─────────────────────────────────────────
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    ALLOWED_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",")
        if origin.strip()
    ]

    # ── AISStream Telemetry Service ──────────────────────────────────────────
    AISSTREAM_API_KEY: str = os.getenv("AISSTREAM_API_KEY", "")
    AISSTREAM_WS_URL: str = os.getenv(
        "AISSTREAM_WS_URL", "wss://stream.aisstream.io/v0/stream"
    )
    AISSTREAM_RECONNECT_DELAY: float = float(
        os.getenv("AISSTREAM_RECONNECT_DELAY_SECONDS", "5.0")
    )

    # ── Remote Sensing & Environmental Services ──────────────────────────────
    NASA_GIBS_BASE_URL: str = os.getenv(
        "NASA_GIBS_BASE_URL",
        "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best"
    )
    OPEN_METEO_BASE_URL: str = os.getenv(
        "OPEN_METEO_BASE_URL",
        "https://api.open-meteo.com/v1/forecast"
    )
    COPERNICUS_API_KEY: str = os.getenv("COPERNICUS_API_KEY", "")
    COPERNICUS_USERNAME: str = os.getenv("COPERNICUS_USERNAME", "")
    COPERNICUS_PASSWORD: str = os.getenv("COPERNICUS_PASSWORD", "")

    # ── Map & GIS Provider ───────────────────────────────────────────────────
    MAPTILER_API_KEY: str = os.getenv("MAPTILER_API_KEY", "")

    # ── AI & LLM Advisory Engine ─────────────────────────────────────────────
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    POLARNAV_LLM_MODEL: str = os.getenv("POLARNAV_LLM_MODEL", "llama3")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")


settings = Settings()
