import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Building2 } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function StationMarker({ station, isSelected, onSelect }) {
  if (!station?.coordinates) return null;

  const isIndian = station.operator.includes('India');

  const stationIcon = L.divIcon({
    className: 'custom-station-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
        <div 
          class="relative w-6 h-6 rounded ${
            isSelected 
              ? 'bg-cyan-500 border-2 border-white shadow-[0_0_12px_#00e5ff] text-slate-950' 
              : isIndian
              ? 'bg-[#0f243a] border border-cyan-400 text-cyan-300'
              : 'bg-[#151d2f] border border-slate-500 text-slate-300'
          } flex items-center justify-center font-bold text-[10px] shadow transition-transform"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            <path d="M9 22v-4h6v4"/>
            <path d="M8 6h.01"/>
            <path d="M16 6h.01"/>
            <path d="M12 6h.01"/>
            <path d="M12 10h.01"/>
            <path d="M12 14h.01"/>
            <path d="M16 10h.01"/>
            <path d="M16 14h.01"/>
            <path d="M8 10h.01"/>
            <path d="M8 14h.01"/>
          </svg>
        </div>
        <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#060a12]/90 border border-slate-700 rounded px-1 py-0.1 text-[8px] font-mono ${
          isIndian ? 'text-cyan-300 font-bold' : 'text-slate-400'
        } shadow pointer-events-none">
          ${station.name.replace(' Station', '')}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  return (
    <Marker
      position={station.coordinates}
      icon={stationIcon}
      eventHandlers={{
        click: () => onSelect(station)
      }}
    >
      <Popup>
        <div className="p-3 bg-[#0a1224] text-slate-100 font-sans min-w-[200px]">
          <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-2 mb-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="font-bold text-xs text-white">{station.name}</div>
              <div className="text-[10px] font-mono text-cyan-300">{station.operator}</div>
            </div>
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Position:</span>
              <span className="text-slate-200">{formatCoordinates(station.coordinates[0], station.coordinates[1])}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sector:</span>
              <span className="text-slate-200">{station.sector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Temp / Wind:</span>
              <span className="text-cyan-300 font-bold">{station.currentTemp}°C / {station.windSpeed} kts</span>
            </div>
          </div>
          <button
            onClick={() => onSelect(station)}
            className="w-full mt-2.5 py-1 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-[10px] uppercase font-mono rounded transition-colors"
          >
            Inspect Base Telemetry
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
