/**
 * Antarctic Geographic Demo Data for PolarNav Navigation System
 * Focused on Antarctica and the Southern Ocean
 */

export const DEMO_VESSEL = {
  id: 'vessel-sagar-nidhi',
  name: 'ORV Sagar Nidhi',
  callSign: 'VTCY-2026',
  imo: 'IMO 9377488',
  vesselType: 'Oceanographic Research Vessel',
  iceClass: 'Polar Class 4 (PC4)',
  latitude: -66.2500,
  longitude: 69.8000,
  coordinates: [-66.2500, 69.8000],
  heading: 142, // degrees
  speedKnots: 11.2,
  destination: 'Bharati Station (Larsemann Hills)',
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
};

export const DEMO_ICEBERGS = [
  {
    id: 'IB-001',
    name: 'Iceberg A-84 Fragment',
    type: 'Tabular Iceberg',
    latitude: -66.8500,
    longitude: 71.2000,
    coordinates: [-66.8500, 71.2000],
    probability: 0.94,
    confidence: 0.91,
    lengthKm: 4.5,
    widthKm: 2.1,
    driftSpeedKnots: 0.9,
    driftHeading: 295,
    riskScore: 'HIGH',
    hazardRadiusNM: 3.5
  },
  {
    id: 'IB-002',
    name: 'Iceberg B-15 Fragment D',
    type: 'Pinnacled Iceberg',
    latitude: -67.4500,
    longitude: 73.6000,
    coordinates: [-67.4500, 73.6000],
    probability: 0.88,
    confidence: 0.85,
    lengthKm: 1.8,
    widthKm: 1.0,
    driftSpeedKnots: 1.3,
    driftHeading: 310,
    riskScore: 'CRITICAL',
    hazardRadiusNM: 2.8
  },
  {
    id: 'IB-003',
    name: 'Prydz Bay Drift Cluster',
    type: 'Bergy Bit Field',
    latitude: -65.7000,
    longitude: 74.5000,
    coordinates: [-65.7000, 74.5000],
    probability: 0.76,
    confidence: 0.82,
    lengthKm: 0.6,
    widthKm: 0.4,
    driftSpeedKnots: 1.6,
    driftHeading: 270,
    riskScore: 'MODERATE',
    hazardRadiusNM: 1.8
  },
  {
    id: 'IB-004',
    name: 'Amery Calved Shelf Fragment',
    type: 'Tabular Megaberg',
    latitude: -68.1000,
    longitude: 70.4000,
    coordinates: [-68.1000, 70.4000],
    probability: 0.98,
    confidence: 0.96,
    lengthKm: 8.2,
    widthKm: 4.1,
    driftSpeedKnots: 0.4,
    driftHeading: 330,
    riskScore: 'EXTREME',
    hazardRadiusNM: 5.0
  },
  {
    id: 'IB-005',
    name: 'Davis Sea Drift Berg #12',
    type: 'Weathered Dome Iceberg',
    latitude: -65.1000,
    longitude: 82.3000,
    coordinates: [-65.1000, 82.3000],
    probability: 0.89,
    confidence: 0.87,
    lengthKm: 2.4,
    widthKm: 1.3,
    driftSpeedKnots: 1.2,
    driftHeading: 285,
    riskScore: 'MODERATE',
    hazardRadiusNM: 2.2
  },
  {
    id: 'IB-006',
    name: 'Mawson Coast Tabular Berg',
    type: 'Tabular Iceberg',
    latitude: -67.2000,
    longitude: 62.8000,
    coordinates: [-67.2000, 62.8000],
    probability: 0.83,
    confidence: 0.89,
    lengthKm: 3.1,
    widthKm: 1.7,
    driftSpeedKnots: 0.8,
    driftHeading: 300,
    riskScore: 'HIGH',
    hazardRadiusNM: 3.0
  },
  {
    id: 'IB-007',
    name: 'Princess Elizabeth Shelf Berg',
    type: 'Pinnacled Iceberg',
    latitude: -68.6000,
    longitude: 77.2000,
    coordinates: [-68.6000, 77.2000],
    probability: 0.91,
    confidence: 0.93,
    lengthKm: 2.0,
    widthKm: 0.9,
    driftSpeedKnots: 0.6,
    driftHeading: 320,
    riskScore: 'HIGH',
    hazardRadiusNM: 2.5
  }
];

export const DEMO_RECOMMENDED_ROUTE = {
  id: 'route-ai-optimal',
  name: 'AI Recommended Low-Ice Corridor',
  type: 'AI_OPTIMIZED',
  isRecommended: true,
  color: '#00e5ff',
  totalDistanceNM: 312.4,
  estimatedTimeHours: 27.8,
  estimatedFuelMT: 10.9,
  riskCategory: 'LOW_RISK',
  decisionRationale: 'Optimized waypoint corridor skirting concentrated pack ice in central Prydz Bay and maintaining a 4+ NM standoff from tracked tabular iceberg A-84.',
  waypoints: [
    [-66.2500, 69.8000], // Start: Sagar Nidhi current pos
    [-66.7000, 71.0000],
    [-67.2500, 72.8000],
    [-67.9000, 74.7000],
    [-68.6500, 75.6000],
    [-69.4069, 76.1908]  // End: Bharati Station Anchorage
  ]
};

export const DEMO_ALTERNATIVE_ROUTE = {
  id: 'route-conventional-direct',
  name: 'Conventional Direct Rhumb Line',
  type: 'CONVENTIONAL',
  isRecommended: false,
  color: '#f59e0b',
  totalDistanceNM: 278.5,
  estimatedTimeHours: 35.6,
  estimatedFuelMT: 17.4,
  riskCategory: 'HIGH_RISK',
  decisionRationale: 'Direct geographic course traverses high-density pressure ridges (82% SIC) and intersects the hazard perimeter of pinnacled iceberg B-15 Fragment D.',
  waypoints: [
    [-66.2500, 69.8000], // Start: Sagar Nidhi current pos
    [-67.1000, 71.8000],
    [-67.7500, 73.4000],
    [-68.5000, 74.9000],
    [-69.4069, 76.1908]  // End: Bharati Station Anchorage
  ]
};

export const DEMO_RISK_ZONES = [
  {
    id: 'risk-zone-central-pack',
    name: 'Sector 4: Consolidated Pack Ice & Convergence Zone',
    riskLevel: 'CRITICAL',
    fillColor: '#ef4444',
    strokeColor: '#f87171',
    fillOpacity: 0.22,
    avgIceConcentration: '84%',
    description: 'Severe multi-year compressive pack ice. Heavy icebreaker required for escort.',
    coordinates: [
      [-67.0000, 72.0000],
      [-66.9000, 75.0000],
      [-68.2000, 76.2000],
      [-68.5000, 72.8000],
      [-67.7000, 71.5000]
    ]
  },
  {
    id: 'risk-zone-amery-drift',
    name: 'Sector 2: Amery Discharge Drift Stream',
    riskLevel: 'MODERATE',
    fillColor: '#f59e0b',
    strokeColor: '#fbbf24',
    fillOpacity: 0.18,
    avgIceConcentration: '52%',
    description: 'Active drift ice floes with intermittent growlers and bergy bits.',
    coordinates: [
      [-65.8000, 67.5000],
      [-65.6000, 70.8000],
      [-66.6000, 71.2000],
      [-66.7000, 68.2000]
    ]
  }
];

export const ANTARCTIC_BASE_VIEW = {
  center: [-68.5000, 72.0000],
  zoom: 5,
  minZoom: 2,
  maxZoom: 14
};

export const ANTARCTIC_FULL_VIEW = {
  center: [-75.0000, 45.0000],
  zoom: 3
};
