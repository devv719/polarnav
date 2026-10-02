"""
PolarNav AI - FastAPI Navigation & Fleet Tracking Server
Provides endpoints for real-time AISStream fleet monitoring,
Antarctic route planning, and thermodynamic iceberg physics analysis.
"""

from contextlib import asynccontextmanager
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import settings
from services.iceberg_physics import analyze_iceberg_target
from services.iceberg_llm import generate_iceberg_risk_report
from services.ais_service import ais_manager, plan_vessel_route_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start AISStream background listener
    await ais_manager.start()
    yield
    # Shutdown: Stop AISStream background listener
    await ais_manager.stop()


app = FastAPI(
    title="PolarNav AI Engine",
    description="Antarctic Marine Navigation, AIS Live Fleet & Iceberg Physics API",
    version="1.1.0",
    lifespan=lifespan
)

# Enable CORS dynamically from environment configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IcebergAnalysisRequest(BaseModel):
    iceberg_id: str = Field(..., description="Unique iceberg identifier (e.g., A-68A, B-15)")
    current_lat: float = Field(..., description="Current latitude in decimal degrees (e.g. -68.5)")
    current_lon: float = Field(..., description="Current longitude in decimal degrees (e.g. 74.0)")
    initial_area_km2: float = Field(..., gt=0, description="Surface area in square kilometers")
    ship_eta_hours: float = Field(default=24.0, gt=0, description="Hours until ship arrival / forecast horizon")
    water_temp_c: Optional[float] = Field(default=0.5, description="Ambient sea surface temperature in °C")
    ice_temp_c: Optional[float] = Field(default=-4.0, description="Ice surface/core temperature in °C")
    drift_speed_knots: Optional[float] = Field(default=0.8, description="Current drift speed in knots")
    drift_heading_deg: Optional[float] = Field(default=55.0, description="Drift true heading in degrees")


class PlanRouteRequest(BaseModel):
    vessel_mmsi: str = Field(..., description="MMSI or unique vessel ID of origin vessel")
    destination_station_id: str = Field(..., description="Target Antarctic research station (e.g. bharati, mcmurdo, rothera, maitri, palmer, ushuaia)")
    destination_coords: Optional[List[float]] = Field(default=None, description="Optional custom destination [lat, lon]")


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "system": "PolarNav AI Navigation Backend",
        "ais_stream": ais_manager.stats,
        "version": "1.1.0"
    }


# ─── Live AIS Fleet Endpoints ──────────────────────────────────────────────────

@app.get("/api/v1/vessels/live")
async def get_live_vessels() -> Dict[str, Any]:
    """
    Returns live tracked vessels in the Antarctic & Southern Ocean.
    """
    vessels = await ais_manager.get_all_vessels()
    return {
        "success": True,
        "count": len(vessels),
        "status": ais_manager.stats.get("status", "connected"),
        "messages_received": ais_manager.stats.get("messages_received", 0),
        "vessels": vessels
    }


@app.get("/api/v1/vessels/{mmsi}")
async def get_vessel_by_mmsi(mmsi: str) -> Dict[str, Any]:
    """
    Returns telemetry for a specific vessel.
    """
    vessel = await ais_manager.get_vessel(mmsi)
    if not vessel:
        raise HTTPException(status_code=404, detail=f"Vessel with MMSI '{mmsi}' not found")
    return {"success": True, "vessel": vessel}


# ─── Targeted Route Planning Endpoint ──────────────────────────────────────────

@app.post("/api/v1/navigation/plan-route")
def plan_route(payload: PlanRouteRequest) -> Dict[str, Any]:
    """
    Generates optimal waypointed navigation route from live vessel coordinates to target station.
    """
    try:
        plan = plan_vessel_route_service(
            vessel_mmsi=payload.vessel_mmsi,
            destination_station_id=payload.destination_station_id,
            custom_coords=payload.destination_coords
        )
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route planning failed: {str(e)}")


# ─── Iceberg Physics & Advisory Endpoint ──────────────────────────────────────

@app.post("/api/v1/icebergs/analyze-target")
def analyze_iceberg(payload: IcebergAnalysisRequest) -> Dict[str, Any]:
    """
    POST /api/v1/icebergs/analyze-target
    1. Deterministic physics and thermodynamic melt calculation
    2. Hydrodynamic Antarctic Circumpolar Current drift trajectory calculation
    3. LLM-powered bridge risk advisory report generation
    """
    try:
        physics_results = analyze_iceberg_target(
            iceberg_id=payload.iceberg_id,
            current_lat=payload.current_lat,
            current_lon=payload.current_lon,
            initial_area_km2=payload.initial_area_km2,
            ship_eta_hours=payload.ship_eta_hours,
            water_temp_c=payload.water_temp_c or 0.5,
            ice_temp_c=payload.ice_temp_c or -4.0,
            drift_speed_knots=payload.drift_speed_knots or 0.8,
            drift_heading_deg=payload.drift_heading_deg or 55.0
        )
        
        advisory_report = generate_iceberg_risk_report(physics_results)
        
        return {
            "success": True,
            "iceberg_id": payload.iceberg_id,
            "ship_eta_hours": payload.ship_eta_hours,
            "physics_metrics": physics_results,
            "advisory_report": advisory_report
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Iceberg analysis calculation failure: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
