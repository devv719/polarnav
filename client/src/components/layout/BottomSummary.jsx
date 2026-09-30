import React from 'react';
import { 
  Ship, 
  MapPin, 
  Fuel, 
  Clock, 
  TrendingDown, 
  Compass, 
  Sparkles
} from 'lucide-react';
import { getRiskLevelConfig } from '../../utils/formatters';

export default function BottomSummary({
  vessel,
  routes,
  selectedRouteType = 'recommended',
  onSelectRoute
}) {
  if (!vessel || !routes?.recommended) return null;

  const activeRoute = selectedRouteType === 'recommended' ? routes.recommended : routes.alternative;
  const isRecommended = selectedRouteType === 'recommended';
  const riskConfig = getRiskLevelConfig(activeRoute.riskCategory);

  // Fuel savings calculation between recommended and alternative
  const fuelDiffMT = (routes.alternative.estimatedFuelMT - routes.recommended.estimatedFuelMT).toFixed(1);
  const timeDiffHours = (routes.alternative.estimatedTimeHours - routes.recommended.estimatedTimeHours).toFixed(1);

  return (
    <div className="h-16 bg-[#080d18] border-t border-slate-800/90 px-4 flex items-center justify-between z-20 shrink-0 select-none shadow-[0_-4px_12px_rgba(0,0,0,0.5)]">
      {/* 1. Vessel & Destination Profile */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
          <Ship className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white truncate font-display">
              {vessel.name}
            </span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {vessel.iceClass.split('/')[0]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span className="text-slate-400">DEST:</span>
            <span className="text-slate-200 font-medium truncate flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              {vessel.destination}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-[1px] h-8 bg-slate-800" />

      {/* 2. Route Selector / Status */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={() => onSelectRoute(routes.recommended)}
          className={`px-2.5 py-1.5 rounded text-left transition-all border font-mono flex items-center gap-2 ${
            isRecommended
              ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200 shadow-[0_0_10px_rgba(0,229,255,0.15)]'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isRecommended ? 'text-cyan-400' : 'text-slate-500'}`} />
          <div className="leading-tight">
            <div className="text-[11px] font-bold flex items-center gap-1">
              AI Optimal Route
              <span className="text-[9px] px-1 rounded bg-cyan-400/20 text-cyan-300 font-normal">REC</span>
            </div>
            <div className="text-[9px] text-slate-400">Low Ice Resistance</div>
          </div>
        </button>

        <button
          onClick={() => onSelectRoute(routes.alternative)}
          className={`px-2.5 py-1.5 rounded text-left transition-all border font-mono flex items-center gap-2 ${
            !isRecommended
              ? 'bg-amber-950/60 border-amber-500/60 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Compass className={`w-3.5 h-3.5 ${!isRecommended ? 'text-amber-400' : 'text-slate-500'}`} />
          <div className="leading-tight">
            <div className="text-[11px] font-bold">Direct Corridor</div>
            <div className="text-[9px] text-slate-400">Conventional Rhumb</div>
          </div>
        </button>
      </div>

      <div className="hidden lg:block w-[1px] h-8 bg-slate-800" />

      {/* 3. Tactical Route Metrics (Distance, Time, Fuel, Risk) */}
      <div className="flex items-center gap-4 lg:gap-6 font-mono">
        {/* Distance */}
        <div className="text-right sm:text-left">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400 hidden sm:inline" />
            <span>DISTANCE</span>
          </div>
          <div className="text-xs font-bold text-slate-100">
            {activeRoute.totalDistanceNM} <span className="text-[10px] text-slate-400">NM</span>
          </div>
        </div>

        {/* Estimated Travel Time */}
        <div className="hidden md:block">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>EST. TIME</span>
          </div>
          <div className="text-xs font-bold text-cyan-300">
            {activeRoute.estimatedTimeHours} <span className="text-[10px] text-cyan-400/80">HRS</span>
          </div>
        </div>

        {/* Estimated Fuel */}
        <div className="hidden lg:block">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Fuel className="w-3 h-3 text-emerald-400" />
            <span>EST. FUEL</span>
          </div>
          <div className="text-xs font-bold text-emerald-300">
            {activeRoute.estimatedFuelMT} <span className="text-[10px] text-emerald-400/80">MT</span>
          </div>
        </div>

        {/* AI Fuel Advantage Pill */}
        {isRecommended && (
          <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-300">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span>SAVE: {fuelDiffMT} MT Fuel / {timeDiffHours}h</span>
          </div>
        )}

        {/* Risk Level Badge */}
        <div className="flex flex-col items-end sm:items-start">
          <div className="text-[10px] text-slate-400">
            POLAR RISK
          </div>
          <div className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1.5 ${riskConfig.bg} ${riskConfig.border} ${riskConfig.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${riskConfig.dot}`} />
            <span>{riskConfig.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
