"""
PolarNav AI - Iceberg Physics and Thermodynamic Drift Engine
Computes deterministic thermodynamic ablation and hydrodynamic drift trajectory
for Antarctic marine ice targets.
"""

import math
from typing import Dict, Any, Optional


def calculate_thermodynamic_melt(
    initial_area_km2: float,
    time_hours: float,
    water_temp_c: float = 0.5,
    ice_temp_c: float = -4.0,
    salinity_psu: float = 34.2
) -> Dict[str, Any]:
    """
    Computes deterministic thermodynamic ice melt based on polar thermodynamic equations:
    Melt Rate (m/day) = 0.058 * (T_water - T_ice)^0.8 * L^(-0.2)
    
    Args:
        initial_area_km2: Surface area of iceberg in km²
        time_hours: Elapsed or forecast time interval in hours (e.g. ship_eta_hours)
        water_temp_c: Ambient sea surface temperature (°C)
        ice_temp_c: Iceberg core/surface temperature (°C)
        salinity_psu: Practical Salinity Unit (default ~34.2 PSU for Southern Ocean)
        
    Returns:
        Structured thermodynamic metrics dictionary
    """
    if initial_area_km2 <= 0:
        return {
            "initial_area_km2": 0.0,
            "projected_area_km2": 0.0,
            "area_loss_km2": 0.0,
            "area_loss_percentage": 100.0,
            "melt_rate_m_per_day": 0.0,
            "will_melt_before_vessel_arrival": True,
            "residual_fraction": 0.0
        }

    # Characteristic waterline length L in meters (L = sqrt(Area in m²))
    initial_area_m2 = initial_area_km2 * 1e6
    length_m = math.sqrt(initial_area_m2)
    
    # Delta temperature between ambient seawater and glacial ice (enforce delta > 0.05)
    delta_t = max(0.05, water_temp_c - ice_temp_c)
    
    # Thermodynamic Melt Rate equation: Melt Rate (m/day) = 0.058 * (T_water - T_ice)^0.8 * L^(-0.2)
    melt_rate_m_per_day = 0.058 * math.pow(delta_t, 0.8) * math.pow(max(length_m, 1.0), -0.2)
    
    # Total erosion across time interval (meters from each exposed edge)
    time_days = max(0.0, time_hours) / 24.0
    radial_erosion_m = melt_rate_m_per_day * time_days
    
    # Two-sided lateral erosion reduces characteristic length by 2 * radial_erosion
    projected_length_m = max(0.0, length_m - (2.0 * radial_erosion_m))
    
    # Compute projected area
    projected_area_m2 = projected_length_m ** 2
    projected_area_km2 = projected_area_m2 / 1e6
    
    area_loss_km2 = max(0.0, initial_area_km2 - projected_area_km2)
    area_loss_pct = (area_loss_km2 / initial_area_km2) * 100.0 if initial_area_km2 > 0 else 100.0
    
    # Iceberg considered fully melted if remaining area is trivial (< 100 m² = 0.0001 km²)
    will_melt = projected_area_km2 <= 0.0001
    
    return {
        "initial_area_km2": round(initial_area_km2, 6),
        "projected_area_km2": round(projected_area_km2, 6),
        "area_loss_km2": round(area_loss_km2, 6),
        "area_loss_percentage": round(min(100.0, area_loss_pct), 2),
        "melt_rate_m_per_day": round(melt_rate_m_per_day, 4),
        "will_melt_before_vessel_arrival": will_melt,
        "residual_fraction": round(projected_area_km2 / initial_area_km2, 4) if initial_area_km2 > 0 else 0.0
    }


def calculate_drift_trajectory(
    current_lat: float,
    current_lon: float,
    ship_eta_hours: float,
    drift_speed_knots: float = 0.8,
    drift_heading_deg: float = 55.0
) -> Dict[str, Any]:
    """
    Computes projected iceberg position under Antarctic Circumpolar Current (ACC)
    and Ekman wind drift.
    
    Args:
        current_lat: Current latitude in decimal degrees (e.g. -68.5)
        current_lon: Current longitude in decimal degrees (e.g. 74.0)
        ship_eta_hours: Forecast time interval until vessel arrival
        drift_speed_knots: Drift speed in knots (standard ~0.8 kt for ACC)
        drift_heading_deg: Drift true course in degrees (standard East-Northeast ~055°)
        
    Returns:
        Drift vector and projected coordinate trajectory
    """
    total_hours = max(0.0, ship_eta_hours)
    distance_nm = drift_speed_knots * total_hours
    distance_km = distance_nm * 1.852
    
    # Mathematical bearing in radians (0° North, 90° East)
    heading_rad = math.radians(drift_heading_deg)
    
    # Displacement components in nautical miles
    d_north_nm = distance_nm * math.cos(heading_rad)
    d_east_nm = distance_nm * math.sin(heading_rad)
    
    # Conversion: 1 nautical mile of latitude = 1/60.0 degree
    d_lat_deg = d_north_nm / 60.0
    projected_lat = current_lat + d_lat_deg
    
    # Enforce polar boundaries
    projected_lat = max(-89.9, min(89.9, projected_lat))
    
    # Mean latitude cosine for longitude degree scaling
    mean_lat_rad = math.radians((current_lat + projected_lat) / 2.0)
    cos_lat = max(0.01, math.cos(mean_lat_rad))
    
    # 1 nautical mile of longitude = 1 / (60.0 * cos(lat)) degrees
    d_lon_deg = d_east_nm / (60.0 * cos_lat)
    projected_lon = current_lon + d_lon_deg
    
    # Wrap longitude [-180, 180]
    while projected_lon > 180.0:
        projected_lon -= 360.0
    while projected_lon < -180.0:
        projected_lon += 360.0
        
    return {
        "current_position": {
            "lat": round(current_lat, 5),
            "lon": round(current_lon, 5)
        },
        "projected_position": {
            "lat": round(projected_lat, 5),
            "lon": round(projected_lon, 5)
        },
        "drift_vector": {
            "speed_knots": drift_speed_knots,
            "heading_degrees": drift_heading_deg,
            "drift_distance_nm": round(distance_nm, 2),
            "drift_distance_km": round(distance_km, 2),
            "dx_km": round(distance_km * math.sin(heading_rad), 2),
            "dy_km": round(distance_km * math.cos(heading_rad), 2)
        }
    }


def analyze_iceberg_target(
    iceberg_id: str,
    current_lat: float,
    current_lon: float,
    initial_area_km2: float,
    ship_eta_hours: float,
    water_temp_c: float = 0.5,
    ice_temp_c: float = -4.0,
    drift_speed_knots: float = 0.8,
    drift_heading_deg: float = 55.0
) -> Dict[str, Any]:
    """
    Combined deterministic analysis calculating both thermodynamic decay and ACC drift trajectory.
    """
    thermodynamics = calculate_thermodynamic_melt(
        initial_area_km2=initial_area_km2,
        time_hours=ship_eta_hours,
        water_temp_c=water_temp_c,
        ice_temp_c=ice_temp_c
    )
    
    trajectory = calculate_drift_trajectory(
        current_lat=current_lat,
        current_lon=current_lon,
        ship_eta_hours=ship_eta_hours,
        drift_speed_knots=drift_speed_knots,
        drift_heading_deg=drift_heading_deg
    )
    
    # Determine iceberg size classification according to WMO / NIC polar standards
    if initial_area_km2 < 0.0001:  # < 100 m²
        wmo_class = "Growler"
        risk_level = "LOW"
    elif initial_area_km2 < 0.05:   # 100 m² - 0.05 km² (up to ~220m length)
        wmo_class = "Bergy Bit"
        risk_level = "MODERATE"
    elif initial_area_km2 < 1.0:    # Medium berg
        wmo_class = "Medium Tabular Berg"
        risk_level = "HIGH"
    else:                           # Mega / Tabular iceberg
        wmo_class = "Major Tabular Iceberg"
        risk_level = "CRITICAL"
        
    return {
        "iceberg_id": iceberg_id,
        "classification": wmo_class,
        "base_risk_level": risk_level,
        "ship_eta_hours": ship_eta_hours,
        "thermodynamics": thermodynamics,
        "trajectory": trajectory,
        "will_melt_before_vessel_arrival": thermodynamics["will_melt_before_vessel_arrival"]
    }
