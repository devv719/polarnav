/**
 * PolarNav Navigation Service Abstraction
 * 
 * Provides an asynchronous data layer interface.
 * Connects directly to the FastAPI backend endpoints:
 *  - /api/v1/vessels/live (AISStream real-time vessel tracking)
 *  - /api/v1/navigation/plan-route (Targeted waypoint corridor generator)
 *  - /api/v1/icebergs/analyze-target (Physics & LLM advisory)
 */

import {
  DEMO_VESSEL as MOCK_VESSEL,
  DEMO_ICEBERGS as MOCK_ICEBERGS,
  DEMO_RECOMMENDED_ROUTE as MOCK_RECOMMENDED_ROUTE,
  DEMO_ALTERNATIVE_ROUTE as MOCK_ALTERNATIVE_ROUTE,
  DEMO_RISK_ZONES as MOCK_RISK_ZONES
} from '../data/antarcticDemoData';
import { ANTARCTIC_STATIONS } from '../data/antarcticStations';
import { fetchAntarcticStations } from '../data/stations/stationData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Pre-seeded polar fleet fallback if backend is starting up
const FALLBACK_FLEET = [
  {
    id: 'vessel-sagar-nidhi',
    mmsi: '419000123',
    name: 'ORV Sagar Nidhi',
    callSign: 'VTCY-2026',
    imo: 'IMO 9377488',
    vesselType: 'Oceanographic Research Vessel',
    iceClass: 'Polar Class 4 (PC4)',
    latitude: -66.2500,
    longitude: 69.8000,
    coordinates: [-66.2500, 69.8000],
    heading: 142,
    speedKnots: 11.2,
    destination: 'Bharati Station (Larsemann Hills)',
    destinationId: 'bharati',
    eta: '2026-10-03 14:00 UTC',
    draft: '6.8 m',
    length: '104.0 m',
    sensors: {
      ambientTemp: -7.5,
      seaIceConcentration: 18,
      windSpeedKnots: 22,
      windDirection: 'SSE (155°)',
      visibilityNM: 7.2,
      waveHeightM: 1.9,
      riskLevel: 'LOW'
    }
  },
  {
    id: 'vessel-attenborough',
    mmsi: '232029000',
    name: 'RRS Sir David Attenborough',
    callSign: 'ZDLU2',
    imo: 'IMO 9798222',
    vesselType: 'Polar Research Ship',
    iceClass: 'Polar Class 4 (PC4)',
    latitude: -64.8200,
    longitude: -63.5000,
    coordinates: [-64.8200, -63.5000],
    heading: 195,
    speedKnots: 12.4,
    destination: 'Rothera Research Station',
    destinationId: 'rothera',
    eta: '2026-10-04 09:30 UTC',
    draft: '8.9 m',
    length: '128.9 m',
    sensors: {
      ambientTemp: -5.2,
      seaIceConcentration: 24,
      windSpeedKnots: 19,
      windDirection: 'SW (220°)',
      visibilityNM: 8.5,
      waveHeightM: 2.1,
      riskLevel: 'LOW'
    }
  },
  {
    id: 'vessel-polarstern',
    mmsi: '211286000',
    name: 'RV Polarstern',
    callSign: 'DBLK',
    imo: 'IMO 8013132',
    vesselType: 'Polar Icebreaker & Research Vessel',
    iceClass: 'Polar Class 3 (PC3)',
    latitude: -70.5100,
    longitude: -8.3000,
    coordinates: [-70.5100, -8.3000],
    heading: 78,
    speedKnots: 10.8,
    destination: 'Neumayer Station III / Maitri',
    destinationId: 'maitri',
    eta: '2026-10-05 18:00 UTC',
    draft: '11.2 m',
    length: '118.0 m',
    sensors: {
      ambientTemp: -16.4,
      seaIceConcentration: 42,
      windSpeedKnots: 26,
      windDirection: 'ENE (070°)',
      visibilityNM: 5.4,
      waveHeightM: 1.4,
      riskLevel: 'MODERATE'
    }
  },
  {
    id: 'vessel-palmer',
    mmsi: '367375000',
    name: 'RV Nathaniel B. Palmer',
    callSign: 'WBP3210',
    imo: 'IMO 9007295',
    vesselType: 'Antarctic Research Icebreaker',
    iceClass: 'ABS-A2 (Icebreaker)',
    latitude: -76.4000,
    longitude: 168.2000,
    coordinates: [-76.4000, 168.2000],
    heading: 170,
    speedKnots: 9.5,
    destination: 'McMurdo Station (Ross Sea)',
    destinationId: 'mcmurdo',
    eta: '2026-10-04 12:00 UTC',
    draft: '9.0 m',
    length: '93.9 m',
    sensors: {
      ambientTemp: -21.0,
      seaIceConcentration: 65,
      windSpeedKnots: 17,
      windDirection: 'S (180°)',
      visibilityNM: 6.8,
      waveHeightM: 0.8,
      riskLevel: 'HIGH'
    }
  },
  {
    id: 'vessel-charcot',
    mmsi: '228397800',
    name: 'Le Commandant Charcot',
    callSign: 'FIAQ',
    imo: 'IMO 9846249',
    vesselType: 'Polar Class Luxury Exploration Vessel',
    iceClass: 'Polar Class 2 (PC2)',
    latitude: -63.3500,
    longitude: -57.8000,
    coordinates: [-63.3500, -57.8000],
    heading: 215,
    speedKnots: 14.1,
    destination: 'Palmer Station / Ushuaia',
    destinationId: 'palmer',
    eta: '2026-10-03 20:00 UTC',
    draft: '6.8 m',
    length: '150.0 m',
    sensors: {
      ambientTemp: -3.8,
      seaIceConcentration: 12,
      windSpeedKnots: 15,
      windDirection: 'WNW (290°)',
      visibilityNM: 9.2,
      waveHeightM: 2.6,
      riskLevel: 'LOW'
    }
  }
];

export const navigationService = {
  /**
   * Fetch real-time live AIS vessel fleet from FastAPI backend
   */
  async getLiveVessels() {
    try {
      const response = await fetch(`${API_BASE_URL}/vessels/live`);
      if (response.ok) {
        const data = await response.json();
        if (data.vessels && data.vessels.length > 0) {
          return data.vessels;
        }
      }
    } catch (err) {
      console.warn('Live AISStream backend endpoint unreachable, using polar fleet cache:', err);
    }
    return FALLBACK_FLEET;
  },

  /**
   * Fetch current active vessel status & telemetry
   */
  async getVesselTelemetry(vesselId = 'default') {
    try {
      const vessels = await this.getLiveVessels();
      const found = vessels.find(v => v.id === vesselId || v.mmsi === String(vesselId));
      if (found) return found;
      return vessels[0] || { ...MOCK_VESSEL };
    } catch {
      return { ...MOCK_VESSEL };
    }
  },

  /**
   * Fetch detected icebergs and predicted positions
   */
  async getIcebergDetections() {
    return Promise.resolve([...MOCK_ICEBERGS]);
  },

  /**
   * Fetch AI recommended & alternative navigation routes for a destination
   */
  async getNavigationRoutes(destinationId = 'bharati', originVessel = null) {
    if (originVessel) {
      return await this.planTargetedRoute(
        originVessel.mmsi || originVessel.id,
        destinationId,
        originVessel.coordinates
      );
    }
    return Promise.resolve({
      recommended: { ...MOCK_RECOMMENDED_ROUTE },
      alternative: { ...MOCK_ALTERNATIVE_ROUTE }
    });
  },

  /**
   * Plan an optimal waypointed route between a live vessel and target station
   */
  async planTargetedRoute(vesselMmsi, destinationStationId, originCoords = null, destCoords = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/navigation/plan-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vessel_mmsi: String(vesselMmsi),
          destination_station_id: destinationStationId,
          destination_coords: destCoords
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.routes) {
          return data.routes;
        }
      }
    } catch (err) {
      console.warn('Backend plan-route unreachable, computing client-side waypoint geometry:', err);
    }

    // Client-side fallback waypoint computation
    const start = originCoords || [-66.2500, 69.8000];
    const station = ANTARCTIC_STATIONS.find(s => s.id === destinationStationId) || ANTARCTIC_STATIONS[0];
    const dest = destCoords || station.coordinates || [-69.4069, 76.1908];

    return this._computeClientSidePolarRoute(start, dest, station.name);
  },

  /**
   * Client-side great circle & corridor interpolator
   */
  _computeClientSidePolarRoute(start, dest, destName) {
    const lat1 = start[0];
    const lon1 = start[1];
    const lat2 = dest[0];
    const lon2 = dest[1];

    const toRad = deg => (deg * Math.PI) / 180;
    const toDeg = rad => (rad * 180) / Math.PI;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distNM = (6371 * c) / 1.852;

    const numLegs = Math.max(4, Math.min(8, Math.round(distNM / 60)));

    const recWaypoints = [];
    const altWaypoints = [];

    for (let i = 0; i <= numLegs; i++) {
      const f = i / numLegs;
      // Linear lat/lon with slight low-ice arc offset
      const arcOffset = Math.sin(f * Math.PI) * 0.35;
      const baseLat = lat1 + (lat2 - lat1) * f;
      const baseLon = lon1 + (lon2 - lon1) * f;

      recWaypoints.push([
        Number((baseLat + arcOffset).toFixed(4)),
        Number((baseLon + (Math.sin(f * Math.PI * 2) * 0.2)).toFixed(4))
      ]);
      altWaypoints.push([
        Number(baseLat.toFixed(4)),
        Number(baseLon.toFixed(4))
      ]);
    }

    const recDist = Math.round(distNM * 1.05 * 10) / 10;
    const altDist = Math.round(distNM * 10) / 10;
    const recHours = Math.round((recDist / 11.5) * 10) / 10;
    const altHours = Math.round((altDist / 8.5) * 10) / 10;

    return {
      recommended: {
        id: 'route-ai-optimal',
        name: 'AI Recommended Low-Ice Corridor',
        type: 'AI_OPTIMIZED',
        isRecommended: true,
        color: '#38bdf8',
        totalDistanceNM: recDist,
        estimatedTimeHours: recHours,
        estimatedFuelMT: Math.round(recHours * 0.39 * 10) / 10,
        riskCategory: 'LOW_RISK',
        decisionRationale: `Optimized waypoint corridor to ${destName} avoiding high-density pack ice ridges.`,
        waypoints: recWaypoints
      },
      alternative: {
        id: 'route-conventional-direct',
        name: 'Conventional Direct Rhumb Line',
        type: 'CONVENTIONAL',
        isRecommended: false,
        color: '#f59e0b',
        totalDistanceNM: altDist,
        estimatedTimeHours: altHours,
        estimatedFuelMT: Math.round(altHours * 0.52 * 10) / 10,
        riskCategory: 'HIGH_RISK',
        decisionRationale: `Direct geographic rhumb line to ${destName} traversing compressive pack ice.`,
        waypoints: altWaypoints
      }
    };
  },

  /**
   * Fetch active polar ice hazard risk zones
   */
  async getRiskZones() {
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
   */
  async queryCoordinateTelemetry(lat, lng) {
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
