/**
 * Geographic & Telemetry Formatting Utilities
 */

/**
 * Format decimal degrees into standard Nautical Latitude/Longitude notation
 * e.g., -65.8500, 68.4200 -> "65°51.00' S, 068°25.20' E"
 */
export function formatCoordinates(lat, lng) {
  if (lat === undefined || lat === null || lng === undefined || lng === null) return 'N/A';
  
  const latHem = lat >= 0 ? 'N' : 'S';
  const lngHem = lng >= 0 ? 'E' : 'W';
  
  const absLat = Math.abs(lat);
  const latDeg = Math.floor(absLat);
  const latMin = ((absLat - latDeg) * 60).toFixed(2).padStart(5, '0');
  
  const absLng = Math.abs(lng);
  const lngDeg = Math.floor(absLng).toString().padStart(3, '0');
  const lngMin = ((absLng - lngDeg) * 60).toFixed(2).padStart(5, '0');
  
  return `${latDeg}°${latMin}' ${latHem}, ${lngDeg}°${lngMin}' ${lngHem}`;
}

/**
 * Return styling and badge configuration for risk levels
 */
export function getRiskLevelConfig(riskLevel) {
  switch (riskLevel?.toUpperCase()) {
    case 'CRITICAL':
    case 'EXTREME':
    case 'SEVERE':
      return {
        label: 'CRITICAL HAZARD',
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/40',
        text: 'text-rose-400',
        dot: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
      };
    case 'HIGH':
    case 'HIGH_RISK':
      return {
        label: 'HIGH RISK',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        dot: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
      };
    case 'MODERATE':
    case 'LOW_MODERATE':
      return {
        label: 'MODERATE',
        bg: 'bg-yellow-500/15',
        border: 'border-yellow-500/40',
        text: 'text-yellow-400',
        dot: 'bg-yellow-500 shadow-[0_0_8px_#eab308]'
      };
    case 'LOW':
    case 'LOW_RISK':
    default:
      return {
        label: 'POLAR SAFE / LOW',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
      };
  }
}
