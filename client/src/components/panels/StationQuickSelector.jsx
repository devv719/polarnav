import React from 'react';
import { Building2 } from 'lucide-react';

export default function StationQuickSelector({ stations, onSelectStation, activeStationId }) {
  return (
    <div className="pt-2 border-t border-slate-800/80">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-cyan-400" />
          Antarctic Bases & Staging
        </span>
        <span className="text-[9px] font-mono text-slate-400">JUMP TO</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {stations.map((station) => {
          const isSelected = activeStationId === station.id;
          const isIndianStation = station.operator.includes('India');

          return (
            <button
              key={station.id}
              onClick={() => onSelectStation(station)}
              className={`p-1.5 rounded text-left transition-all border text-xs font-mono flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold truncate text-[11px]">
                  {station.name.replace(' Station', '')}
                </span>
                {isIndianStation && (
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    IND
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{station.currentTemp}°C</span>
                <span className="text-slate-400 truncate max-w-[60px]">{station.sector.split(',')[0]}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
