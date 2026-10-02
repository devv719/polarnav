import React from 'react';

export default function BottomSummary({
  vessel,
  routes,
  selectedRouteType = 'recommended',
  onSelectRoute
}) {
  if (!vessel || !routes?.recommended) return null;

  const activeRoute = selectedRouteType === 'recommended' ? routes.recommended : routes.alternative;

  return (
    <footer className="h-[44px] bg-[#FFFFFF] border-t border-[#CCE0F0] px-6 flex items-center justify-between z-20 shrink-0 select-none font-mono text-xs text-[#68869E] shadow-sm">
      {/* Route Path Indicator */}
      <div className="flex items-center gap-3 text-[#1E3A52]">
        <span className="text-[10px] tracking-widest text-[#68869E] uppercase font-semibold">ROUTE {selectedRouteType === 'recommended' ? '01' : '02'}</span>
        <span className="text-[#CCE0F0]">•</span>
        <span className="font-bold tracking-wider text-[#0F2130]">{vessel.name}</span>
        <span className="text-[#3385C6] text-xs font-bold">→</span>
        <span className="text-[#1E3A52] tracking-wider font-semibold">{vessel.destination || 'BHARATI STATION'}</span>
      </div>

      {/* Summary Metrics */}
      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-[#1E3A52] font-semibold">
          {activeRoute.totalDistanceNM} NM
        </span>
        <span className="text-[#CCE0F0]">•</span>
        <span className="text-[#1E3A52] font-semibold">
          {activeRoute.estimatedTimeHours} H
        </span>
        {activeRoute.estimatedFuelMT && (
          <>
            <span className="text-[#CCE0F0]">•</span>
            <span className="text-[#1E3A52] font-semibold">
              {activeRoute.estimatedFuelMT} MT FUEL
            </span>
          </>
        )}
        <span className="text-[#CCE0F0]">•</span>
        <span className="text-[#68869E] uppercase tracking-wider flex items-center gap-1.5 font-medium">
          RISK:
          <span className={activeRoute.isRecommended ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold' : 'text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold'}>
            {activeRoute.riskCategory === 'LOW_RISK' || activeRoute.riskCategory === 'LOW RISK' ? 'LOW' : activeRoute.riskCategory ? activeRoute.riskCategory.replace('_', ' ') : 'LOW'}
          </span>
        </span>
      </div>
    </footer>
  );
}
