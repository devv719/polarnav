import React from 'react';
import { Building2 } from 'lucide-react';

export default function StationQuickSelector({ stations, onSelectStation, activeStationId }) {
  return (
    <div className="pt-2 border-t border-[#CCE0F0]">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#68869E] font-semibold flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-[#3385C6]" />
          Antarctic Bases & Staging
        </span>
        <span className="text-[9px] font-mono text-[#68869E]">JUMP TO</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {stations.map((station) => {
          const isSelected = activeStationId === station.id;
          const isIndianStation = station.operator?.includes('India') || station.country?.includes('India');

          return (
            <button
              key={station.id}
              onClick={() => onSelectStation(station)}
              className={`p-1.5 rounded text-left transition-all border text-xs font-mono flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#E8F3FA] border-[#3385C6] text-[#0F2130] shadow-xs'
                  : 'bg-[#FFFFFF] border-[#CCE0F0] hover:border-[#66A3D3] text-[#1E3A52] hover:bg-[#F8FBFE]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold truncate text-[11px]">
                  {station.name.replace(' Station', '')}
                </span>
                {isIndianStation && (
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                    IND
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#68869E] mt-1">
                <span>{station.currentTemp ? `${station.currentTemp}°C` : (station.seasonality || 'Facility')}</span>
                <span className="truncate max-w-[60px]">{station.region || station.sector?.split(',')[0] || station.country}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
