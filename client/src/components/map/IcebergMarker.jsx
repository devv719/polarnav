import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { TriangleAlert } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function IcebergMarker({ iceberg, isSelected, onSelect }) {
  if (!iceberg?.coordinates) return null;

  const isCritical = iceberg.riskScore === 'CRITICAL' || iceberg.riskScore === 'EXTREME';

  // Light cyan/white iceberg marker
  const icebergIcon = L.divIcon({
    className: 'custom-iceberg-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer" style="width: 32px; height: 32px;">
        <!-- Iceberg Diamond shape -->
        <div 
          class="relative w-5 h-5 rounded-sm bg-[#0e2238] border ${
            isSelected 
              ? 'border-cyan-300 ring-2 ring-cyan-400/60 shadow-[0_0_10px_#38bdf8]' 
              : isCritical 
              ? 'border-rose-400 text-rose-300' 
              : 'border-cyan-300 text-cyan-200'
          } flex items-center justify-center font-bold text-[10px] shadow"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="${isCritical ? '#f43f5e' : '#e0f2fe'}" stroke="none">
            <polygon points="12,2 22,12 12,22 2,12" />
          </svg>
        </div>

        <!-- Iceberg ID Tag -->
        <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#060a12]/95 border ${
          isCritical ? 'border-rose-500/50 text-rose-300' : 'border-cyan-500/40 text-cyan-200'
        } rounded px-1 py-0.1 text-[8px] font-mono font-bold shadow pointer-events-none">
          ${iceberg.id}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  const radiusMeters = (iceberg.hazardRadiusNM || 2.5) * 1852;

  return (
    <React.Fragment>
      {/* Subtle Standoff Hazard Radius Circle */}
      <Circle
        center={iceberg.coordinates}
        radius={radiusMeters}
        pathOptions={{
          color: isCritical ? '#f43f5e' : '#38bdf8',
          weight: isSelected ? 1.5 : 1,
          dashArray: '3, 4',
          fillColor: isCritical ? '#f43f5e' : '#38bdf8',
          fillOpacity: isSelected ? 0.12 : 0.05
        }}
      />

      <Marker
        position={iceberg.coordinates}
        icon={icebergIcon}
        eventHandlers={{
          click: () => onSelect && onSelect(iceberg)
        }}
      >
        <Popup>
          <div className="p-3 bg-[#0a1426] text-slate-100 font-sans min-w-[210px]">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <TriangleAlert className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-400' : 'text-cyan-400'}`} />
                <span className="font-bold text-xs text-white">{iceberg.id} ({iceberg.name})</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Position:</span>
                <span className="text-slate-200 font-medium">{formatCoordinates(iceberg.latitude, iceberg.longitude)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Probability:</span>
                <span className="text-cyan-300 font-bold">{(iceberg.probability * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence:</span>
                <span className="text-emerald-300 font-bold">{(iceberg.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type / Dimensions:</span>
                <span className="text-slate-200">{iceberg.type} ({iceberg.lengthKm}×{iceberg.widthKm}km)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Drift Vector:</span>
                <span className="text-amber-300 font-medium">{iceberg.driftHeading}° @ {iceberg.driftSpeedKnots} kts</span>
              </div>
            </div>

            <button
              onClick={() => onSelect && onSelect(iceberg)}
              className="w-full mt-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase font-mono rounded transition-colors"
            >
              Select Iceberg
            </button>
          </div>
        </Popup>
      </Marker>
    </React.Fragment>
  );
}
