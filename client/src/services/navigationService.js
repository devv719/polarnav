/**
 * PolarNav Navigation Service Abstraction
 * 
 * Provides an asynchronous data layer interface.
 * Currently serves calibrated mock demonstration datasets.
 * In production / future phases, this connects directly to the FastAPI backend
 * endpoints (e.g., /api/v1/telemetry, /api/v1/routes/predict, /api/v1/icebergs/detect).
 */

import {
  DEMO_VESSEL as MOCK_VESSEL,
  DEMO_ICEBERGS as MOCK_ICEBERGS,
  DEMO_RECOMMENDED_ROUTE as MOCK_RECOMMENDED_ROUTE,
  DEMO_ALTERNATIVE_ROUTE as MOCK_ALTERNATIVE_ROUTE,
  DEMO_RISK_ZONES as MOCK_RISK_ZONES
} from '../data/antarcticDemoData';
import { fetchAntarcticStations } from '../data/stations/stationData';

const USE_REMOTE_API = false; // Toggle to true when FastAPI backend is live
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const navigationService = {
  /**
   * Fetch current active vessel status & telemetry
   */
  async getVesselTelemetry(vesselId = 'default') {
    if (USE_REMOTE_API) {
      const response = await fetch(`${API_BASE_URL}/vessel/${vesselId}`);
      if (!response.ok) throw new Error(`Failed to fetch vessel data: ${response.statusText}`);
      return await response.json();
    }
    // Return mock with simulated network latency
    return Promise.resolve({ ...MOCK_VESSEL });
  },

  /**
   * Fetch detected icebergs and predicted positions
   */
  async getIcebergDetections() {
    if (USE_REMOTE_API) {
      const response = await fetch(`${API_BASE_URL}/icebergs`);
      if (!response.ok) throw new Error(`Failed to fetch icebergs: ${response.statusText}`);
      return await response.json();
    }
    return Promise.resolve([...MOCK_ICEBERGS]);
  },

  /**
   * Fetch AI recommended & alternative navigation routes
   */
  async getNavigationRoutes(destinationId = 'bharati') {
    if (USE_REMOTE_API) {
      const response = await fetch(`${API_BASE_URL}/routes?destination=${destinationId}`);
      if (!response.ok) throw new Error(`Failed to fetch routes: ${response.statusText}`);
      return await response.json();
    }
    return Promise.resolve({
      recommended: { ...MOCK_RECOMMENDED_ROUTE },
      alternative: { ...MOCK_ALTERNATIVE_ROUTE }
    });
  },

  /**
   * Fetch active polar ice hazard risk zones
   */
  async getRiskZones() {
    if (USE_REMOTE_API) {
      const response = await fetch(`${API_BASE_URL}/risk-zones`);
      if (!response.ok) throw new Error(`Failed to fetch risk zones: ${response.statusText}`);
      return await response.json();
    }
    return Promise.resolve([...MOCK_RISK_ZONES]);
  },

  /**
   * Fetch Antarctic research stations & facilities (COMNAP dataset)
   */
  async getAntarcticStations() {
    return await fetchAntarcticStations();
  },

  /**
   * Sample environment query for any arbitrary clicked coordinate [lat, lng]
   * (Simulates querying gridded climate/SAR raster model)
   */
  async queryCoordinateTelemetry(lat, lng) {
    if (USE_REMOTE_API) {
      const response = await fetch(`${API_BASE_URL}/query-point?lat=${lat}&lng=${lng}`);
      if (!response.ok) throw new Error(`Point query failed: ${response.statusText}`);
      return await response.json();
    }

    // Synthesize realistic polar coordinate telemetry for demo inspection
    const absLat = Math.abs(lat);
    const estimatedTemp = -(absLat * 0.35 + Math.sin(lng * 0.05) * 4).toFixed(1);
    const estimatedSIC = Math.min(95, Math.max(5, Math.round((absLat - 60) * 8 + Math.cos(lng * 0.1) * 15)));
    const icebergProb = Math.min(98, Math.max(2, Math.round(estimatedSIC * 0.85 + (Math.abs(lng % 30) < 10 ? 25 : 0))));
    
    let riskLevel = 'LOW';
    if (estimatedSIC > 70 || icebergProb > 75) riskLevel = 'CRITICAL';
    else if (estimatedSIC > 40 || icebergProb > 50) riskLevel = 'HIGH';
    else if (estimatedSIC > 20 || icebergProb > 25) riskLevel = 'MODERATE';

    return Promise.resolve({
      coordinates: [Number(lat.toFixed(4)), Number(lng.toFixed(4))],
      temperature: Number(estimatedTemp),
      seaIceConcentration: estimatedSIC,
      icebergProbability: icebergProb,
      windSpeedKnots: Math.round(15 + (absLat % 10) * 2.2),
      windDirection: `${Math.round((lng + 360) % 360)}°`,
      visibilityNM: (Math.max(1.2, 10 - (estimatedSIC / 15))).toFixed(1),
      waveHeightM: (Math.max(0.5, 4.2 - (estimatedSIC / 25))).toFixed(1),
      riskLevel,
      polarCodeRecommendation: riskLevel === 'CRITICAL' 
        ? 'Restricted Zone: Mandatory Icebreaker Escort Required'
        : riskLevel === 'HIGH'
        ? 'Caution: Reduce Speed to <8 kts and Activate Searchlights'
        : 'Open Nav Corridor: Follow Approved Low-Ice Waypoints'
    });
  },

  /**
   * Run Iceberg Thermodynamic Melt & ACC Drift Physics + LLM Risk Analysis
   * Calls POST /api/v1/icebergs/analyze-target
   */
  async analyzeIcebergTarget({
    iceberg_id,
    current_lat,
    current_lon,
    initial_area_km2 = 1.0,
    ship_eta_hours = 24.0,
    water_temp_c = 0.5,
    ice_temp_c = -4.0
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/icebergs/analyze-target`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          iceberg_id,
          current_lat,
          current_lon,
          initial_area_km2,
          ship_eta_hours,
          water_temp_c,
          ice_temp_c
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Backend API unreachable, using client-side physics fallback:', err);
    }

    // Client-side fallback computation matching backend physics formula
    const lengthM = Math.sqrt(initial_area_km2 * 1e6);
    const deltaT = Math.max(0.05, water_temp_c - ice_temp_c);
    const meltRateMPerDay = 0.058 * Math.pow(deltaT, 0.8) * Math.pow(Math.max(lengthM, 1), -0.2);
    const timeDays = ship_eta_hours / 24.0;
    const radialErosionM = meltRateMPerDay * timeDays;
    const projectedLengthM = Math.max(0, lengthM - (2 * radialErosionM));
    const projectedAreaKm2 = Math.pow(projectedLengthM, 2) / 1e6;
    const areaLossKm2 = Math.max(0, initial_area_km2 - projectedAreaKm2);
    const areaLossPct = (areaLossKm2 / initial_area_km2) * 100;
    const willMelt = projectedAreaKm2 <= 0.0001;

    // ACC Drift: 0.8 knots @ 055°T
    const distanceNm = 0.8 * ship_eta_hours;
    const headingRad = (55.0 * Math.PI) / 180;
    const dLat = (distanceNm * Math.cos(headingRad)) / 60.0;
    const meanLatRad = ((current_lat + (current_lat + dLat)) / 2.0) * (Math.PI / 180);
    const dLon = (distanceNm * Math.sin(headingRad)) / (60.0 * Math.max(0.01, Math.cos(meanLatRad)));

    return {
      success: true,
      iceberg_id,
      ship_eta_hours,
      physics_metrics: {
        iceberg_id,
        classification: initial_area_km2 < 0.0001 ? 'Growler' : initial_area_km2 < 0.05 ? 'Bergy Bit' : 'Tabular Iceberg',
        ship_eta_hours,
        thermodynamics: {
          initial_area_km2: Number(initial_area_km2.toFixed(4)),
          projected_area_km2: Number(projectedAreaKm2.toFixed(4)),
          area_loss_km2: Number(areaLossKm2.toFixed(4)),
          area_loss_percentage: Number(areaLossPct.toFixed(2)),
          melt_rate_m_per_day: Number(meltRateMPerDay.toFixed(4)),
          will_melt_before_vessel_arrival: willMelt
        },
        trajectory: {
          current_position: { lat: current_lat, lon: current_lon },
          projected_position: {
            lat: Number((current_lat + dLat).toFixed(5)),
            lon: Number((current_lon + dLon).toFixed(5))
          },
          drift_vector: {
            speed_knots: 0.8,
            heading_degrees: 55.0,
            drift_distance_nm: Number(distanceNm.toFixed(2)),
            drift_distance_km: Number((distanceNm * 1.852).toFixed(2))
          }
        },
        will_melt_before_vessel_arrival: willMelt
      },
      advisory_report: {
        iceberg_id,
        classification: initial_area_km2 < 0.05 ? 'Bergy Bit' : 'Tabular Iceberg',
        risk_level: initial_area_km2 > 0.5 ? 'CRITICAL' : 'HIGH',
        collision_risk_assessment: willMelt 
          ? `Target ${iceberg_id} exhibits complete thermodynamic ablation (${areaLossPct.toFixed(1)}% loss) prior to ETA.`
          : `Target maintains mass with projected area ${projectedAreaKm2.toFixed(4)} km². ACC drift along 055°T intersects tactical corridor.`,
        tactical_recommendations: {
          action: willMelt
            ? 'Maintain planned track with passive watch.'
            : 'Execute 15° evasive detour to Starboard. Establish 3.5 NM CPA.',
          min_cpa_nautical_miles: willMelt ? 0.5 : 3.5,
          course_alteration_degrees: willMelt ? 0.0 : 15.0
        },
        executive_report: `POLARNAV AI BRIDGE ADVISORY // TARGET: ${iceberg_id}\nDRIFT: ${distanceNm.toFixed(1)} NM @ 055°T\nTACTICAL DIRECTIVE: Maintain minimum CPA of ${willMelt ? '0.5' : '3.5'} NM.`,
        engine: 'PolarNav-Client-Fallback'
      }
    };
  }
};
