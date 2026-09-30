/**
 * PolarNav AI - Demonstration & Simulation Navigation Dataset
 * SIH 2026 Problem Statement 26059 (MoES / NCPOR)
 * 
 * NOTE: This is lightweight demonstration data designed for testing
 * architecture, visual representations, and navigation UI components.
 * Not for actual navigational use.
 */

export const MOCK_VESSEL = {
  id: 'vessel-orv-bharati-exp',
  name: 'ORV Sagar Nidhi / Bharati Exp',
  callSign: 'VTBF-2026',
  imo: 'IMO 9377488',
  vesselType: 'Polar Research & Expedition Vessel',
  iceClass: 'Polar Class 4 (PC4) / DNV ICE-05',
  flag: 'India',
  coordinates: [-65.8500, 68.4200], // Offshore Prydz Bay approach
  heading: 138, // degrees Course Over Ground (COG)
  speedKnots: 11.4, // Speed Over Ground (SOG)
  destination: 'Bharati Station (Larsemann Hills)',
  eta: '2026-10-03 14:30 UTC',
  departurePort: 'Port Louis / Cape Town Staging',
  draft: '6.8 m',
  length: '104.0 m',
  beam: '18.4 m',
  fuelRemainingMT: 342.5,
  dailyFuelConsumptionMT: 9.8,
  sensors: {
    ambientTemp: -7.8,
    seaWaterTemp: -1.4,
    seaIceConcentration: 18.5, // %
    windSpeedKnots: 22,
    windDirection: 'SSE (155°)',
    atmosphericPressure: '986 hPa',
    waveHeightM: 2.1,
    visibilityNM: 6.5,
    radarIceTargetCount: 3,
    riskLevel: 'LOW_MODERATE'
  },
  status: 'Underway Using Optimal AI Polar Corridor',
  isSimulated: true
};

export const MOCK_ICEBERGS = [
  {
    id: 'IB-2026-A1',
    designation: 'Iceberg A-84 Fragment',
    type: 'Tabular Iceberg',
    coordinates: [-66.9200, 71.3500],
    lengthKm: 4.8,
    widthKm: 2.3,
    estimatedDraftM: 195,
    driftSpeedKnots: 0.9,
    driftHeading: 295, // West-Northwest drift with Antarctic Coastal Current
    probabilityScore: 94.2, // Detection confidence
    polarRiskScore: 'HIGH',
    seaIceSurroundConcentration: 62, // %
    temperatureC: -11.4,
    hazardRadiusNM: 3.5,
    detectedDate: '2026-09-30 21:00 UTC (SAR Sentinel-1 Simulation)',
    dangerNotes: 'Calving active on south flank. Restricted standoff corridor.',
    isSimulated: true
  },
  {
    id: 'IB-2026-B4',
    designation: 'Iceberg B-15 Fragment D',
    type: 'Pinnacled Iceberg',
    coordinates: [-67.8500, 74.1200],
    lengthKm: 1.6,
    widthKm: 0.9,
    estimatedDraftM: 130,
    driftSpeedKnots: 1.4,
    driftHeading: 310,
    probabilityScore: 88.7,
    polarRiskScore: 'CRITICAL',
    seaIceSurroundConcentration: 78,
    temperatureC: -13.2,
    hazardRadiusNM: 2.8,
    detectedDate: '2026-10-01 02:15 UTC (SAR Sentinel-1 Simulation)',
    dangerNotes: 'Directly adjacent to historic route. Heavy underwater keel projection.',
    isSimulated: true
  },
  {
    id: 'IB-2026-C2',
    designation: 'Prydz Shelf Bergy-Bit Cluster',
    type: 'Bergy Bit / Growler Field',
    coordinates: [-65.2000, 73.8000],
    lengthKm: 0.4,
    widthKm: 0.3,
    estimatedDraftM: 45,
    driftSpeedKnots: 1.8,
    driftHeading: 270,
    probabilityScore: 76.5,
    polarRiskScore: 'MODERATE',
    seaIceSurroundConcentration: 35,
    temperatureC: -8.1,
    hazardRadiusNM: 1.5,
    detectedDate: '2026-09-30 18:40 UTC (Optical Modis Simulation)',
    dangerNotes: 'Low radar cross-section. Visual lookout required.',
    isSimulated: true
  },
  {
    id: 'IB-2026-D9',
    designation: 'Amery Ice Shelf Calved Mass',
    type: 'Tabular Megaberg',
    coordinates: [-68.4500, 70.8000],
    lengthKm: 11.2,
    widthKm: 5.7,
    estimatedDraftM: 260,
    driftSpeedKnots: 0.4,
    driftHeading: 330,
    probabilityScore: 98.9,
    polarRiskScore: 'EXTREME',
    seaIceSurroundConcentration: 85,
    temperatureC: -15.8,
    hazardRadiusNM: 6.0,
    detectedDate: '2026-09-29 12:00 UTC (SAR Sentinel-1 Simulation)',
    dangerNotes: 'Massive grounded shelf fragment creating localized ice jam.',
    isSimulated: true
  },
  {
    id: 'IB-2026-E3',
    designation: 'Weddell Gyre Drift Berg #7',
    type: 'Weathered Dome Iceberg',
    coordinates: [-64.1000, -42.5000],
    lengthKm: 2.2,
    widthKm: 1.1,
    estimatedDraftM: 110,
    driftSpeedKnots: 1.6,
    driftHeading: 45,
    probabilityScore: 91.0,
    polarRiskScore: 'MODERATE',
    seaIceSurroundConcentration: 42,
    temperatureC: -5.9,
    hazardRadiusNM: 2.2,
    detectedDate: '2026-09-30 08:30 UTC',
    dangerNotes: 'Entering iceberg alley drift stream.',
    isSimulated: true
  }
];

export const MOCK_RECOMMENDED_ROUTE = {
  id: 'route-ai-recommended',
  name: 'PolarNav AI Dynamic Route (Low Ice Resistance)',
  type: 'AI_OPTIMIZED',
  isRecommended: true,
  status: 'ACTIVE_PLAN',
  color: '#00e5ff',
  dashArray: '8, 6',
  totalDistanceNM: 324.5,
  estimatedTimeHours: 28.5,
  estimatedFuelMT: 11.6,
  averageIceConcentration: '22%',
  maxIceThicknessM: 0.7,
  riskCategory: 'LOW_RISK',
  riskScore: 24, // out of 100 (lower is better)
  safetyMarginNM: 4.8,
  decisionRationale: 'Bypasses high-density pack ice in central Prydz Bay by exploiting open leads and low-pressure fracture channels.',
  waypoints: [
    { name: 'WP-01 Approach Staging', lat: -65.8500, lng: 68.4200, depthM: 2400, sicPct: 15, expectedSpeedKnots: 12.0 },
    { name: 'WP-02 Open Lead Alpha', lat: -66.5000, lng: 70.1000, depthM: 1800, sicPct: 18, expectedSpeedKnots: 11.5 },
    { name: 'WP-03 West Fracture Corridor', lat: -67.2000, lng: 72.8000, depthM: 950, sicPct: 24, expectedSpeedKnots: 10.8 },
    { name: 'WP-04 Iceberg A-84 Safe Bypass', lat: -67.9500, lng: 74.9000, depthM: 620, sicPct: 28, expectedSpeedKnots: 10.0 },
    { name: 'WP-05 Larsemann Approach Bay', lat: -68.8000, lng: 75.8000, depthM: 410, sicPct: 32, expectedSpeedKnots: 9.2 },
    { name: 'WP-06 Bharati Berth Anchorage', lat: -69.4069, lng: 76.1908, depthM: 185, sicPct: 20, expectedSpeedKnots: 5.0 }
  ]
};

export const MOCK_ALTERNATIVE_ROUTE = {
  id: 'route-standard-direct',
  name: 'Conventional Direct Rhumb Line',
  type: 'CONVENTIONAL',
  isRecommended: false,
  status: 'ALTERNATIVE',
  color: '#f59e0b',
  dashArray: '4, 8',
  totalDistanceNM: 286.0,
  estimatedTimeHours: 37.2,
  estimatedFuelMT: 18.9,
  averageIceConcentration: '64%',
  maxIceThicknessM: 1.8,
  riskCategory: 'HIGH_RISK',
  riskScore: 78,
  safetyMarginNM: 1.2,
  decisionRationale: 'Direct path enters thick multi-year pack ice and traverses directly within the danger zone of Pinnacled Berg B-15 Fragment D. Higher risk of besetting and 63% increased fuel consumption.',
  waypoints: [
    { name: 'ALT-01 Approach Staging', lat: -65.8500, lng: 68.4200, depthM: 2400, sicPct: 15, expectedSpeedKnots: 12.0 },
    { name: 'ALT-02 Central Pack Entry', lat: -66.8000, lng: 71.2000, depthM: 1200, sicPct: 58, expectedSpeedKnots: 7.2 },
    { name: 'ALT-03 High Risk Berg Choke', lat: -67.8000, lng: 73.9000, depthM: 800, sicPct: 76, expectedSpeedKnots: 5.4 },
    { name: 'ALT-04 Heavy Consolidated Ice', lat: -68.7000, lng: 75.2000, depthM: 520, sicPct: 72, expectedSpeedKnots: 6.0 },
    { name: 'ALT-05 Bharati Berth Anchorage', lat: -69.4069, lng: 76.1908, depthM: 185, sicPct: 20, expectedSpeedKnots: 5.0 }
  ]
};

export const MOCK_RISK_ZONES = [
  {
    id: 'risk-zone-prydz-pack',
    name: 'Sector 4: Consolidated Pack Ice & Iceberg Convergence Zone',
    riskLevel: 'CRITICAL',
    fillColor: '#ef4444',
    strokeColor: '#f87171',
    opacity: 0.18,
    avgIceConcentration: '82%',
    dominantIceType: 'Thick First-Year & Pressure Ridges (1.5m - 2.2m)',
    description: 'High compressive ice pressure caused by onshore katabatic winds. Navigation discouraged without heavy icebreaker escort.',
    coordinates: [
      [-67.1000, 72.5000],
      [-67.0500, 75.2000],
      [-68.2000, 76.5000],
      [-68.6000, 73.0000],
      [-67.8000, 71.8000]
    ]
  },
  {
    id: 'risk-zone-amery-drift',
    name: 'Sector 2: Amery Discharge Fast-Ice Tongue',
    riskLevel: 'MODERATE',
    fillColor: '#f59e0b',
    strokeColor: '#fbbf24',
    opacity: 0.14,
    avgIceConcentration: '48%',
    dominantIceType: 'Medium First-Year Ice & Drift Floes',
    description: 'Moderate drift rate with sporadic growlers. Suitable for PC4 vessels maintaining continuous radar watch.',
    coordinates: [
      [-66.0000, 68.0000],
      [-65.8000, 71.0000],
      [-66.8000, 71.5000],
      [-66.9000, 68.8000]
    ]
  }
];
