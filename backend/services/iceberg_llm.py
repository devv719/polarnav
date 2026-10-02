"""
PolarNav AI - LLM Iceberg Risk Advisory Service
Generates tactical navigation advisories and hazard evaluations using LLM
(LangChain / Ollama / Local Llama 3) with intelligent fallback.
"""

import os
import json
import logging
from typing import Dict, Any, Optional

from config import settings

logger = logging.getLogger("polarnav.llm")


def _generate_rule_based_advisory(physics_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    High-fidelity Polar Navigation Expert rule engine that generates authoritative
    IMO Polar Code compliant bridge advisories when an offline/local LLM server is unreachable.
    """
    iceberg_id = physics_data.get("iceberg_id", "UNKNOWN-BERG")
    initial_area = physics_data.get("thermodynamics", {}).get("initial_area_km2", 0.1)
    projected_area = physics_data.get("thermodynamics", {}).get("projected_area_km2", 0.09)
    area_loss_pct = physics_data.get("thermodynamics", {}).get("area_loss_percentage", 0.0)
    melt_rate = physics_data.get("thermodynamics", {}).get("melt_rate_m_per_day", 0.05)
    will_melt = physics_data.get("will_melt_before_vessel_arrival", False)
    
    trajectory = physics_data.get("trajectory", {})
    drift_vec = trajectory.get("drift_vector", {})
    drift_heading = drift_vec.get("heading_degrees", 55.0)
    drift_dist_nm = drift_vec.get("drift_distance_nm", 0.0)
    current_pos = trajectory.get("current_position", {})
    proj_pos = trajectory.get("projected_position", {})
    eta_hours = physics_data.get("ship_eta_hours", 12.0)
    
    # 1. Classification
    if initial_area < 0.0001:
        classification = "Growler (Low freeboard <1m, highly hazardous to sonar/radar)"
        category = "Growler"
        risk_level = "MODERATE"
    elif initial_area < 0.05:
        classification = "Bergy Bit (Medium mass, submerged keel up to 20m depth)"
        category = "Bergy Bit"
        risk_level = "HIGH"
    elif initial_area < 1.0:
        classification = "Tabular Iceberg (Significant draft, calving hazard present)"
        category = "Tabular Iceberg"
        risk_level = "HIGH"
    else:
        classification = "Major Tabular Giant (Deep draft >150m, massive wake/icefield drift)"
        category = "Major Tabular Iceberg"
        risk_level = "CRITICAL"
        
    # 2. Risk Assessment
    if will_melt:
        risk_assessment = (
            f"Target {iceberg_id} exhibits complete thermodynamic ablation ({area_loss_pct}% loss, "
            f"{melt_rate:.3f} m/day) prior to ETA {eta_hours:.1f}h. Structural integrity severely compromised; "
            f"residual brash ice poses minimal hull impact risk for Polar Class vessel."
        )
    else:
        risk_assessment = (
            f"Target {iceberg_id} maintains substantial mass with projected area {projected_area:.4f} km² "
            f"({area_loss_pct}% thermal reduction). Hydrodynamic drift along Antarctic Circumpolar Current "
            f"(Heading {drift_heading:03.0f}°T, {drift_dist_nm:.1f} NM displacement) intersects tactical corridor. "
            f"Sub-surface ram extensions present critical puncturing risk."
        )
        
    # 3. Tactical Recommendation
    if will_melt:
        alteration = "Maintain planned track with passive forward FLIR & X-band radar monitoring. Stand down ice avoidance alteration."
        min_cpa_nm = 0.5
        course_alteration_deg = 0.0
    elif risk_level == "CRITICAL":
        alteration = f"Execute immediate evasive detour 15° to Starboard. Establish minimum Closest Point of Approach (CPA) of 3.5 NM up-drift (North-Northwest). Reduce speed to 8.0 kts in low visibility."
        min_cpa_nm = 3.5
        course_alteration_deg = 15.0
    elif risk_level == "HIGH":
        alteration = f"Alter course 10° to Port to bypass projected drift sector {proj_pos.get('lat', 0):.2f}°S, {proj_pos.get('lon', 0):.2f}°E. Maintain 2.0 NM CPA."
        min_cpa_nm = 2.0
        course_alteration_deg = -10.0
    else:
        alteration = f"Standard lookout watch. Alter course 5° to avoid wake turbulence. Maintain 1.0 NM CPA."
        min_cpa_nm = 1.0
        course_alteration_deg = 5.0
        
    executive_summary = (
        f"POLARNAV AI BRIDGE ADVISORY // TARGET: {iceberg_id}\n"
        f"CLASSIFICATION: {classification}\n"
        f"ETA WINDOW: {eta_hours:.1f} Hours | ACC DRIFT: {drift_dist_nm:.1f} NM @ {drift_heading:03.0f}°T\n"
        f"HAZARD EVALUATION: {risk_assessment}\n"
        f"TACTICAL DIRECTIVE: {alteration}"
    )

    return {
        "iceberg_id": iceberg_id,
        "classification": category,
        "classification_details": classification,
        "risk_level": risk_level,
        "collision_risk_assessment": risk_assessment,
        "tactical_recommendations": {
            "action": alteration,
            "min_cpa_nautical_miles": min_cpa_nm,
            "course_alteration_degrees": course_alteration_deg,
            "speed_restriction_knots": 8.5 if risk_level in ["CRITICAL", "HIGH"] else 12.0
        },
        "executive_report": executive_summary,
        "engine": "PolarNav-Expert-Heuristics"
    }


def generate_iceberg_risk_report(physics_metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates an executive navigation report using LangChain / Ollama if available,
    or falls back to the deterministic Polar Nav rule engine.
    """
    # Attempt Ollama / LangChain integration if reachable
    ollama_host = settings.OLLAMA_HOST
    model_name = settings.POLARNAV_LLM_MODEL
    
    try:
        import urllib.request
        req_data = json.dumps({
            "model": model_name,
            "prompt": (
                f"You are the PolarNav AI Chief Navigation Officer. Analyze this iceberg target:\n"
                f"{json.dumps(physics_metrics, indent=2)}\n"
                f"Output a JSON object with: classification, risk_level, collision_risk_assessment, tactical_recommendations, executive_report."
            ),
            "stream": False,
            "format": "json"
        }).encode("utf-8")
        
        req = urllib.request.Request(
            f"{ollama_host}/api/generate",
            data=req_data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=2.5) as response:
            if response.status == 200:
                body = json.loads(response.read().decode("utf-8"))
                parsed_response = json.loads(body.get("response", "{}"))
                parsed_response["engine"] = f"Ollama-{model_name}"
                return parsed_response
    except Exception:
        pass
        
    # Return high-fidelity authoritative navigation advisory
    return _generate_rule_based_advisory(physics_metrics)
