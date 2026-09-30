import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Ship } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function VesselMarker({ vessel, isSelected, onSelect }) {
  if (!vessel?.coordinates) return null;

  // Clean cyan navigation vessel icon
  const vesselIcon = L.divIcon({
    className: 'custom-vessel-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer" style="width: 38px; height: 38px;">
        <!-- Vessel heading arrow / shape -->
        <div 
          class="relative w-7 h-7 rounded-full bg-[#071322]/95 border-2 ${
            isSelected ? 'border-cyan-200 shadow-[0_0_12px_#00e5ff]' : 'border-cyan-400'
          } flex items-center justify-center text-cyan-300 transition-transform"
          style="transform: rotate(${vessel.heading || 0}deg);"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#00e5ff" stroke="#00e5ff" stroke-width="1">
            <polygon points="12,2 22,22 12,17 2,22" />
          </svg>
        </div>

        <!-- Subtle callout tag -->
        <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#060a12]/95 border border-cyan-500/50 rounded px-1.5 py-0.2 text-[9px] font-mono text-cyan-200 font-bold shadow pointer-events-none">
          ${vessel.name}
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });

  return (
    <Marker
      position={vessel.coordinates}
      icon={vesselIcon}
      eventHandlers={{
        click: () => onSelect && onSelect(vessel)
      }}
    >
      <Popup>
        <div className="p-3 bg-[#0a1224] text-slate-100 font-sans min-w-[220px]">
          <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-2 mb-2">
            <Ship className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="font-bold text-xs text-white">{vessel.name}</div>
              <div className="text-[10px] font-mono text-cyan-300">{vessel.iceClass}</div>
            </div>
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Position:</span>
              <span className="text-slate-200 font-bold">{formatCoordinates(vessel.coordinates[0], vessel.coordinates[1])}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Course / Speed:</span>
              <span className="text-cyan-300 font-bold">{vessel.heading}° @ {vessel.speedKnots} kts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Destination:</span>
              <span className="text-emerald-300 font-bold truncate max-w-[120px]">{vessel.destination}</span>
            </div>
          </div>
          <button
            onClick={() => onSelect && onSelect(vessel)}
            className="w-full mt-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase font-mono rounded transition-colors"
          >
            Inspect Vessel Telemetry
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
