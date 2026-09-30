import React from 'react';
import { 
  Ship, 
  TriangleAlert, 
  Building2, 
  Route as RouteIcon, 
  Thermometer, 
  Layers, 
  Wind, 
  Eye, 
  Waves, 
  ShieldAlert, 
  Activity, 
  Navigation,
  Crosshair,
  Gauge,
  Radio
} from 'lucide-react';
import { formatCoordinates, getRiskLevelConfig } from '../../utils/formatters';

export default function LocationInfoPanel({ selectedObject }) {
  if (!selectedObject) {
    return (
      <aside className="w-84 bg-[#080d18] border-l border-slate-800/80 flex flex-col shrink-0 select-none z-20 p-4 text-center justify-center items-center text-slate-500 font-mono text-xs">
        <Crosshair className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
        <p className="text-slate-400 font-medium">NO OBJECT SELECTED</p>
        <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
          Click any vessel, iceberg, station, route waypoint, or anywhere on the map to inspect telemetry.
        </p>
      </aside>
    );
  }

  const { type, data } = selectedObject;

  // Render object-specific details
  return (
    <aside className="w-88 bg-[#080d18] border-l border-slate-800/80 flex flex-col shrink-0 select-none z-20 overflow-hidden text-slate-200">
      {/* Panel Header */}
      <div className="h-11 px-3.5 border-b border-slate-800/70 flex items-center justify-between bg-[#060a12]/70 shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 tracking-wide font-mono">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>OBJECT TELEMETRY</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            {type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 font-sans text-xs">
        {/* Object Header Card */}
        {type === 'vessel' && renderVesselHeader(data)}
        {type === 'iceberg' && renderIcebergHeader(data)}
        {type === 'station' && renderStationHeader(data)}
        {type === 'route' && renderRouteHeader(data)}
        {type === 'coordinate' && renderCoordinateHeader(data)}

        {/* Primary Environmental & Oceanographic Sensor Metrics */}
        {renderTelemetryGrid(type, data)}

        {/* Risk Assessment & Safe Navigation Advisory */}
        {renderRiskAdvisory(type, data)}

        {/* Detailed Technical Specifications / Waypoint List */}
        {renderExtendedDetails(type, data)}
      </div>

      {/* Panel Bottom Disclaimer */}
      <div className="p-2 bg-[#060a12] border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1 text-slate-400">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>SIMULATED FEED</span>
        </span>
        <span className="text-slate-400">SIH 2026 PROTOTYPE</span>
      </div>
    </aside>
  );
}

/* =========================================================================
   SUB-RENDERERS FOR DIFFERENT OBJECT TYPES
   ========================================================================= */

function renderVesselHeader(vessel) {
  return (
    <div className="p-3 rounded bg-slate-900/90 border border-cyan-500/30 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0">
            <Ship className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-display leading-tight">{vessel.name}</h2>
            <p className="text-[10px] font-mono text-cyan-400/90">{vessel.callSign} • {vessel.imo}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px] font-mono">
        <div>
          <span className="text-slate-400 text-[10px] block">POSITION</span>
          <span className="text-slate-200 font-semibold">{formatCoordinates(vessel.coordinates[0], vessel.coordinates[1])}</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">ICE CLASS</span>
          <span className="text-cyan-300 font-semibold">{vessel.iceClass}</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">HEADING / SPEED</span>
          <span className="text-slate-200 font-semibold">{vessel.heading}° COG / {vessel.speedKnots} kts</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">DESTINATION</span>
          <span className="text-emerald-300 font-semibold truncate block">{vessel.destination}</span>
        </div>
      </div>
    </div>
  );
}

function renderIcebergHeader(iceberg) {
  const risk = getRiskLevelConfig(iceberg.polarRiskScore);
  return (
    <div className="p-3 rounded bg-slate-900/90 border border-rose-500/30 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
            <TriangleAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-display leading-tight">{iceberg.designation}</h2>
            <p className="text-[10px] font-mono text-rose-400/90">{iceberg.id} • {iceberg.type}</p>
          </div>
        </div>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${risk.bg} ${risk.border} ${risk.text} font-bold`}>
          {iceberg.polarRiskScore}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px] font-mono">
        <div>
          <span className="text-slate-400 text-[10px] block">DIMENSIONS</span>
          <span className="text-slate-200 font-semibold">{iceberg.lengthKm} km × {iceberg.widthKm} km</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">EST. DRAFT</span>
          <span className="text-cyan-300 font-semibold">{iceberg.estimatedDraftM} m depth</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">DRIFT VECTOR</span>
          <span className="text-slate-200 font-semibold">{iceberg.driftHeading}° @ {iceberg.driftSpeedKnots} kts</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">HAZARD ZONE</span>
          <span className="text-rose-300 font-semibold">{iceberg.hazardRadiusNM} NM radius</span>
        </div>
      </div>
    </div>
  );
}

function renderStationHeader(station) {
  return (
    <div className="p-3 rounded bg-slate-900/90 border border-blue-500/30 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-blue-950 border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white font-display leading-tight">{station.name}</h2>
          <p className="text-[10px] font-mono text-blue-300/90">{station.operator} • Est. {station.established}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px] font-mono">
        <div>
          <span className="text-slate-400 text-[10px] block">LOCATION</span>
          <span className="text-slate-200 font-semibold">{formatCoordinates(station.coordinates[0], station.coordinates[1])}</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">SECTOR</span>
          <span className="text-slate-300 font-semibold truncate block">{station.sector}</span>
        </div>
      </div>
    </div>
  );
}

function renderRouteHeader(route) {
  const isRec = route.isRecommended;
  return (
    <div className={`p-3 rounded bg-slate-900/90 border space-y-2 ${
      isRec ? 'border-emerald-500/40' : 'border-amber-500/40'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
          isRec ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50' : 'bg-amber-950 text-amber-400 border border-amber-500/50'
        }`}>
          <RouteIcon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white font-display leading-tight">{route.name}</h2>
          <p className={`text-[10px] font-mono ${isRec ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isRec ? 'AI RECOMMENDED CORRIDOR' : 'CONVENTIONAL ALTERNATIVE'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-[11px] font-mono text-center">
        <div>
          <span className="text-slate-400 text-[10px] block">DISTANCE</span>
          <span className="text-slate-100 font-bold">{route.totalDistanceNM} NM</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">EST. TIME</span>
          <span className="text-cyan-300 font-bold">{route.estimatedTimeHours} hrs</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] block">EST. FUEL</span>
          <span className="text-emerald-300 font-bold">{route.estimatedFuelMT} MT</span>
        </div>
      </div>
    </div>
  );
}

function renderCoordinateHeader(coord) {
  return (
    <div className="p-3 rounded bg-slate-900/90 border border-slate-700 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-cyan-300 shrink-0">
          <Crosshair className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white font-display leading-tight">Polar Point Probe</h2>
          <p className="text-[10px] font-mono text-cyan-400">
            {formatCoordinates(coord.coordinates[0], coord.coordinates[1])}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TELEMETRY SENSOR GRID
   ========================================================================= */

function renderTelemetryGrid(type, data) {
  let temp = -8.2;
  let sic = 24;
  let icebergProb = 45;
  let wind = '20 kts SSE';
  let vis = '7.5 NM';
  let wave = '1.8 m';

  if (type === 'vessel' && data.sensors) {
    temp = data.sensors.ambientTemp;
    sic = data.sensors.seaIceConcentration;
    icebergProb = 32;
    wind = `${data.sensors.windSpeedKnots} kts ${data.sensors.windDirection}`;
    vis = `${data.sensors.visibilityNM} NM`;
    wave = `${data.sensors.waveHeightM} m`;
  } else if (type === 'iceberg') {
    temp = data.temperatureC || -12.4;
    sic = data.seaIceSurroundConcentration || 68;
    icebergProb = data.probabilityScore || 92;
    wind = '26 kts S';
    vis = '4.0 NM';
    wave = '0.9 m';
  } else if (type === 'station') {
    temp = data.currentTemp;
    sic = 40;
    icebergProb = 15;
    wind = `${data.windSpeed} kts`;
    vis = '10.0 NM';
    wave = '0.0 m (Fast Ice)';
  } else if (type === 'coordinate') {
    temp = data.temperature;
    sic = data.seaIceConcentration;
    icebergProb = data.icebergProbability;
    wind = `${data.windSpeedKnots} kts (${data.windDirection})`;
    vis = `${data.visibilityNM} NM`;
    wave = `${data.waveHeightM} m`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
          <Gauge className="w-3 h-3 text-cyan-400" />
          Metocean & Ice Telemetry
        </span>
        <span className="text-[9px] font-mono text-cyan-400/70">PROCESSED</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Temperature */}
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-cyan-400" />
              TEMPERATURE
            </span>
          </div>
          <div className="text-base font-bold font-mono text-cyan-200">
            {temp}°C
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Air / Surface Chill</div>
        </div>

        {/* Sea Ice Concentration */}
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-sky-400" />
              SEA-ICE CONC.
            </span>
          </div>
          <div className="text-base font-bold font-mono text-sky-200 flex items-baseline gap-1">
            {sic}<span className="text-xs text-sky-400">%</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
            <div 
              className={`h-full ${sic > 65 ? 'bg-rose-500' : sic > 35 ? 'bg-amber-400' : 'bg-cyan-400'}`} 
              style={{ width: `${sic}%` }}
            />
          </div>
        </div>

        {/* Iceberg Probability */}
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <TriangleAlert className="w-3 h-3 text-rose-400" />
              ICEBERG PROB.
            </span>
          </div>
          <div className="text-base font-bold font-mono text-rose-300 flex items-baseline gap-1">
            {icebergProb}<span className="text-xs text-rose-400">%</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Spatial SAR Confidence</div>
        </div>

        {/* Wind Speed & Vector */}
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-teal-400" />
              WIND VECTOR
            </span>
          </div>
          <div className="text-xs font-bold font-mono text-teal-200 mt-1 truncate">
            {wind}
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Katabatic Stream</div>
        </div>

        {/* Visibility */}
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-indigo-400" />
              VISIBILITY
            </span>
          </div>
          <div className="text-xs font-bold font-mono text-indigo-200 mt-1">
            {vis}
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Atmospheric Optical</div>
        </div>

        {/* Wave Height */}
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-cyan-400" />
              SIGNIF. WAVE
            </span>
          </div>
          <div className="text-xs font-bold font-mono text-cyan-200 mt-1">
            {wave}
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Swell & Damping</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   RISK ASSESSMENT & SAFE POLAR ADVISORY
   ========================================================================= */

function renderRiskAdvisory(type, data) {
  let riskLevel = 'LOW';
  let advisoryText = 'Normal polar navigation regime. Follow AI recommended corridor.';

  if (type === 'vessel') {
    riskLevel = data.sensors?.riskLevel || 'LOW';
    advisoryText = 'Vessel is maintaining 11.4 kts inside Polar Class 4 safety margin. Radar ice watch active.';
  } else if (type === 'iceberg') {
    riskLevel = data.polarRiskScore;
    advisoryText = data.dangerNotes || 'Maintain minimum 3 NM standoff distance due to underwater shelf extensions.';
  } else if (type === 'route') {
    riskLevel = data.riskCategory;
    advisoryText = data.decisionRationale;
  } else if (type === 'coordinate') {
    riskLevel = data.riskLevel;
    advisoryText = data.polarCodeRecommendation;
  }

  const riskConfig = getRiskLevelConfig(riskLevel);

  return (
    <div className={`p-3 rounded border ${riskConfig.bg} ${riskConfig.border}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-200">
          <ShieldAlert className={`w-3.5 h-3.5 ${riskConfig.text}`} />
          POLAR DECISION ADVISORY
        </span>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${riskConfig.text} border ${riskConfig.border}`}>
          {riskConfig.label}
        </span>
      </div>
      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
        {advisoryText}
      </p>
    </div>
  );
}

/* =========================================================================
   EXTENDED DETAILS (WAYPOINTS OR TECHNICAL PROPERTIES)
   ========================================================================= */

function renderExtendedDetails(type, data) {
  if (type === 'route' && data.waypoints) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
            <Navigation className="w-3 h-3 text-cyan-400" />
            Route Waypoint Breakdown ({data.waypoints.length})
          </span>
        </div>
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
          {data.waypoints.map((wp, idx) => (
            <div key={idx} className="p-1.5 rounded bg-slate-900/60 border border-slate-800 text-[10px] font-mono flex items-center justify-between">
              <div>
                <span className="text-cyan-300 font-medium block">{wp.name}</span>
                <span className="text-slate-400 text-[9px]">{formatCoordinates(wp.lat, wp.lng)}</span>
              </div>
              <div className="text-right">
                <span className="text-sky-300 font-semibold block">{wp.sicPct}% SIC</span>
                <span className="text-slate-400 text-[9px]">{wp.expectedSpeedKnots} kts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'vessel') {
    return (
      <div className="space-y-1.5 text-[11px] font-mono p-2.5 rounded bg-slate-900/40 border border-slate-800/80">
        <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Fleet Specifications</span>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Dimensions (LOA x Beam):</span>
          <span>{data.length} × {data.beam}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Operational Draft:</span>
          <span>{data.draft}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Fuel Reserves:</span>
          <span className="text-emerald-300">{data.fuelRemainingMT} MT ({data.dailyFuelConsumptionMT} MT/day)</span>
        </div>
      </div>
    );
  }

  return null;
}
