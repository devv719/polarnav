import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

export default function StationMarker({ station, isSelected, onSelect }) {
  if (!station?.coordinates) return null;

  const isPrimary = station.operator?.includes('India');

  const stationIcon = L.divIcon({
    className: 'minimal-station-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto" style="width: 120px; margin-left: -60px; margin-top: -8px;">
        <div class="w-4 h-4 rounded-sm ${
          isSelected 
            ? 'bg-[#38bdf8] ring-2 ring-[#38bdf8]' 
            : isPrimary 
            ? 'bg-[#0B1520] border border-[#38bdf8]' 
            : 'bg-[#0B1520] border border-[#82909B]'
        } flex items-center justify-center shadow">
          <div class="w-1.5 h-1.5 ${isPrimary ? 'bg-[#38bdf8]' : 'bg-[#82909B]'} rounded-full"></div>
        </div>
        <div class="mt-1 text-[9px] font-mono tracking-wider text-[#82909B] uppercase text-center select-none">
          ${station.name.replace(' Station', '')}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });

  return (
    <Marker
      position={station.coordinates}
      icon={stationIcon}
      eventHandlers={{
        click: () => onSelect && onSelect(station)
      }}
    >
      <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
        <div className="p-1 font-mono select-none text-center">
          <span className="font-semibold text-xs text-[#F2F4F5]">{station.name}</span>
          <div className="text-[10px] text-[#82909B] mt-0.5">
            {station.operator} • {station.currentTemp}°C
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
}
