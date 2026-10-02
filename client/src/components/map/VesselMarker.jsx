import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

export default function VesselMarker({ vessel, isSelected, onSelect }) {
  if (!vessel?.coordinates) return null;

  const mmsiLabel = vessel.mmsi ? `MMSI: ${vessel.mmsi}` : vessel.callSign || 'AIS';
  const heading = vessel.heading || 0;

  // Clean, minimal vessel marker with directional heading & Antarctic light palette
  const vesselIcon = L.divIcon({
    className: 'minimal-vessel-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto" style="width: 160px; margin-left: -80px; margin-top: -14px;">
        <!-- Clean directional icon -->
        <div 
          class="w-7 h-7 rounded-full bg-[#0F2130] border-2 ${
            isSelected ? 'border-[#3385C6] ring-4 ring-[#3385C6]/30 shadow-lg' : 'border-[#66A3D3]'
          } flex items-center justify-center transition-all duration-300"
          style="transform: rotate(${heading}deg);"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="${isSelected ? '#38bdf8' : '#FFFFFF'}" stroke="none">
            <polygon points="12,2 20,20 12,16 4,20" />
          </svg>
        </div>

        <!-- Small clean vessel name label -->
        <div class="mt-1 px-1.5 py-0.5 rounded-xs bg-[#0F2130]/90 text-[9px] font-sans font-bold tracking-wide text-white uppercase text-center shadow-xs select-none">
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
      <Tooltip direction="top" offset={[0, -20]} opacity={0.98}>
        <div className="p-1 text-center font-sans select-none">
          <div className="font-bold text-xs text-[#0F2130] tracking-tight">
            {vessel.name}
          </div>
          <div className="text-[10px] font-mono text-[#3385C6] font-semibold mt-0.5">
            {vessel.speedKnots} KTS • HDG {heading}°T • {mmsiLabel}
          </div>
          {vessel.destination && (
            <div className="text-[9px] text-[#68869E] mt-0.5 italic">
              Dest: {vessel.destination}
            </div>
          )}
        </div>
      </Tooltip>
    </Marker>
  );
}
