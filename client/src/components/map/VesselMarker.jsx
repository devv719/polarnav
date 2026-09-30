import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

export default function VesselMarker({ vessel, isSelected, onSelect }) {
  if (!vessel?.coordinates) return null;

  // Clean, minimal vessel marker with directional heading
  const vesselIcon = L.divIcon({
    className: 'minimal-vessel-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto" style="width: 140px; margin-left: -70px; margin-top: -12px;">
        <!-- Clean directional icon -->
        <div 
          class="w-6 h-6 rounded-full bg-[#071018] border border-[#38bdf8] flex items-center justify-center transition-transform shadow-md ${
            isSelected ? 'ring-2 ring-[#38bdf8]' : ''
          }"
          style="transform: rotate(${vessel.heading || 0}deg);"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#38bdf8" stroke="none">
            <polygon points="12,2 20,20 12,16 4,20" />
          </svg>
        </div>

        <!-- Small clean label without heavy box -->
        <div class="mt-1 text-[10px] font-mono tracking-wider text-[#F2F4F5] uppercase text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] select-none">
          ${vessel.name}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });

  return (
    <Marker
      position={vessel.coordinates}
      icon={vesselIcon}
      eventHandlers={{
        click: () => onSelect && onSelect(vessel)
      }}
    >
      <Tooltip direction="top" offset={[0, -18]} opacity={0.95}>
        <div className="p-1 text-center font-mono select-none">
          <div className="font-semibold text-xs text-[#F2F4F5] tracking-wide">
            {vessel.name}
          </div>
          <div className="text-[10px] text-[#38bdf8] mt-0.5">
            {vessel.speedKnots} KT • HDG {vessel.heading}°
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
}
