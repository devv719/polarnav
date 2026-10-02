/**
 * PolarNav Route Analysis Utilities
 *
 * Calculates route-aware environmental and hazard metrics including:
 * - Iceberg proximity / CPA to route corridor
 * - Risk zone intersections
 * - Weather and sea ice exposure along the route
 */

const DEG_TO_RAD = Math.PI / 180;
const NM_PER_DEG_LAT = 60.0; // 1° latitude ≈ 60 NM

/**
 * Compute the shortest great-circle distance in NM from a point (lat, lon)
 * to a polyline segment [p1, p2].
 * Uses the haversine formula for each endpoint and the cross-track formula.
 */
function haversineNM(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Earth radius in NM
  const φ1 = lat1 * DEG_TO_RAD;
  const φ2 = lat2 * DEG_TO_RAD;
  const Δφ = (lat2 - lat1) * DEG_TO_RAD;
  const Δλ = (lon2 - lon1) * DEG_TO_RAD;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Cross-track distance from point P to segment (A → B) in NM.
 * Returns the absolute perpendicular distance if the foot is within the segment,
 * otherwise returns the shorter of distance(P, A) and distance(P, B).
 */
function crossTrackDistanceNM(pLat, pLon, aLat, aLon, bLat, bLon) {
  const R = 3440.065;
  const φP = pLat * DEG_TO_RAD;
  const φA = aLat * DEG_TO_RAD;
  const φB = bLat * DEG_TO_RAD;
  const λP = pLon * DEG_TO_RAD;
  const λA = aLon * DEG_TO_RAD;
  const λB = bLon * DEG_TO_RAD;

  const Δφ = φB - φA;
  const Δλ = λB - λA;
  const aAB = Math.sin(Δφ / 2) ** 2 + Math.cos(φA) * Math.cos(φB) * Math.sin(Δλ / 2) ** 2;
  const dAB = 2 * Math.atan2(Math.sqrt(aAB), Math.sqrt(1 - aAB)); // angular distance A→B

  const Δφ1 = φP - φA;
  const Δλ1 = λP - λA;
  const aAP = Math.sin(Δφ1 / 2) ** 2 + Math.cos(φA) * Math.cos(φP) * Math.sin(Δλ1 / 2) ** 2;
  const dAP = 2 * Math.atan2(Math.sqrt(aAP), Math.sqrt(1 - aAP));

  // Bearing A→B and A→P
  const brngAB = Math.atan2(
    Math.sin(λB - λA) * Math.cos(φB),
    Math.cos(φA) * Math.sin(φB) - Math.sin(φA) * Math.cos(φB) * Math.cos(λB - λA)
  );
  const brngAP = Math.atan2(
    Math.sin(λP - λA) * Math.cos(φP),
    Math.cos(φA) * Math.sin(φP) - Math.sin(φA) * Math.cos(φP) * Math.cos(λP - λA)
  );

  const dXt = Math.asin(Math.sin(dAP) * Math.sin(brngAP - brngAB)) * R;

  // Along-track distance to check if foot is within segment
  const dAt = Math.acos(Math.cos(dAP) / Math.cos(dXt / R)) * R;

  if (dAt < 0 || dAt > dAB * R) {
    // Foot is outside segment – return min of endpoint distances
    return Math.min(haversineNM(pLat, pLon, aLat, aLon), haversineNM(pLat, pLon, bLat, bLon));
  }

  return Math.abs(dXt);
}

/**
 * Compute the minimum distance in NM from a point to any segment of a polyline.
 */
export function minDistanceToRouteNM(pLat, pLon, waypoints) {
  if (!waypoints || waypoints.length < 2) return Infinity;
  let minDist = Infinity;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [aLat, aLon] = waypoints[i];
    const [bLat, bLon] = waypoints[i + 1];
    const d = crossTrackDistanceNM(pLat, pLon, aLat, aLon, bLat, bLon);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

/**
 * Classify iceberg risk level relative to the active navigation route.
 *
 * Risk model:
 *   distance < 5 NM      → CRITICAL
 *   5 NM – 15 NM         → HIGH
 *   15 NM – 30 NM        → MODERATE
 *   > 30 NM              → LOW
 *
 * The iceberg's own hazardRadiusNM is also added to its effective threat radius
 * (larger bergs are risky from further away).
 */
export function classifyRouteIcebergRisk(iceberg, routeWaypoints) {
  if (!routeWaypoints || routeWaypoints.length < 2) {
    return { riskLevel: 'UNKNOWN', distanceNM: null };
  }

  const lat = iceberg.latitude ?? iceberg.coordinates?.[0];
  const lon = iceberg.longitude ?? iceberg.coordinates?.[1];
  if (lat == null || lon == null) return { riskLevel: 'UNKNOWN', distanceNM: null };

  const dist = minDistanceToRouteNM(lat, lon, routeWaypoints);
  const effectiveThreat = dist - (iceberg.hazardRadiusNM || 0);

  let riskLevel;
  if (effectiveThreat <= 5) riskLevel = 'CRITICAL';
  else if (effectiveThreat <= 15) riskLevel = 'HIGH';
  else if (effectiveThreat <= 30) riskLevel = 'MODERATE';
  else riskLevel = 'LOW';

  return { riskLevel, distanceNM: Number(dist.toFixed(1)) };
}

/**
 * Analyze all hazards along a route.
 * Returns arrays of icebergs sorted by proximity with route-aware risk labels.
 */
export function analyzeRouteHazards(icebergs, routeWaypoints) {
  if (!icebergs || !routeWaypoints) return [];

  return icebergs
    .map((iceberg) => {
      const { riskLevel, distanceNM } = classifyRouteIcebergRisk(iceberg, routeWaypoints);
      return { ...iceberg, routeRisk: riskLevel, routeDistanceNM: distanceNM };
    })
    .filter((b) => b.routeDistanceNM !== null)
    .sort((a, b) => a.routeDistanceNM - b.routeDistanceNM);
}

/**
 * Estimate route-segment environmental exposure.
 * Returns a summary object of sea ice, temperature and wind conditions.
 */
export function estimateRouteEnvironment(waypoints, vessel) {
  if (!waypoints || waypoints.length < 2) return null;

  // Calculate total distance
  let totalDistNM = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistNM += haversineNM(
      waypoints[i][0], waypoints[i][1],
      waypoints[i + 1][0], waypoints[i + 1][1]
    );
  }

  // Average latitude determines ice concentration estimate
  const avgLat = waypoints.reduce((sum, wp) => sum + Math.abs(wp[0]), 0) / waypoints.length;
  const estSIC = Math.min(90, Math.max(5, Math.round((avgLat - 60) * 4)));

  // Derived from vessel sensors or default values
  const windKts = vessel?.sensors?.windSpeedKnots ?? 22;
  const waveM = vessel?.sensors?.waveHeightM ?? 2.1;
  const tempC = vessel?.sensors?.ambientTemp ?? -8;

  return {
    totalDistanceNM: Number(totalDistNM.toFixed(1)),
    avgSeaIceConcentration: estSIC,
    estimatedWindKnots: windKts,
    estimatedWaveHeightM: waveM,
    estimatedTempC: tempC,
    visibilityNM: vessel?.sensors?.visibilityNM ?? 6.8,
    polarCodeRequirement: estSIC > 70 ? 'MANDATORY ICEBREAKER ESCORT' : estSIC > 40 ? 'REDUCED SPEED <8 kts' : 'STANDARD POLAR WATCH'
  };
}
