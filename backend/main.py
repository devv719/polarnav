"""
PolarNav AI - FastAPI Navigation & Iceberg Drift Analysis Server
Provides endpoints for deterministic polar thermodynamics, ACC drift trajectory modeling,
and LLM-powered bridge advisory reporting.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from services.iceberg_physics import analyze_iceberg_target
from services.iceberg_llm import generate_iceberg_risk_report

app = FastAPI(
    title="PolarNav AI Engine",
    description="Antarctic Marine Navigation, Iceberg Physics & AI Risk Advisory API",
    version="1.0.0"
)

# Enable CORS for local and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "system": "PolarNav AI Navigation Backend",
        "version": "1.0.0"
    }


@app.post("/api/v1/icebergs/analyze-target")
def analyze_iceberg(payload: IcebergAnalysisRequest) -> Dict[str, Any]:
    """
    POST /api/v1/icebergs/analyze-target
    1. Deterministic physics and thermodynamic melt calculation
    2. Hydrodynamic Antarctic Circumpolar Current drift trajectory calculation
    3. LLM-powered bridge risk advisory report generation
    """
    try:
        # Step 1 & 2: Process through physics & drift engine
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
        
        # Step 3: Pass structured physics output to LLM Advisory Service
        advisory_report = generate_iceberg_risk_report(physics_results)
        
        # Combine into cohesive analysis response
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
