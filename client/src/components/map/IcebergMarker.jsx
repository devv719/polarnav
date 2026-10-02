import React from 'react';
import { Marker, Tooltip, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

export default function IcebergMarker({
  iceberg,
  isSelected,
  isSubdued,
  driftProjection,
  onSelect
}) {
  if (!iceberg?.coordinates) return null;

  const isCritical = iceberg.riskScore === 'CRITICAL' || iceberg.riskScore === 'EXTREME';
  const isHigh = iceberg.riskScore === 'HIGH';

  const fillColor = isCritical ? '#dc2626' : isHigh ? '#d97706' : '#3385C6';
  const size = isSelected ? 24 : isSubdued ? 14 : 18;
  const opacity = isSubdued ? 0.35 : 1.0;

  // Minimal diamond marker: ◆
  const icebergIcon = L.divIcon({
    className: 'minimal-iceberg-marker',
    html: `
      <div 
        class="relative flex items-center justify-center cursor-pointer transition-all duration-200 ${
          isSelected ? 'scale-125 z-[999]' : 'hover:scale-110'
        }" 
        style="width: ${size + 8}px; height: ${size + 8}px; opacity: ${opacity};"
      >
        <!-- Outer highlight halo when selected -->
        ${
          isSelected
            ? `<div class="absolute inset-0 rounded-full bg-[#3385C6]/20 ring-2 ring-[#3385C6] animate-pulse"></div>`
            : ''
        }
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fillColor}" stroke="${isSelected ? '#0F2130' : '#FFFFFF'}" stroke-width="${isSelected ? '2' : '1.2'}">
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      </div>
    `,
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2]
  });

  const projectedPos = driftProjection?.physics_metrics?.trajectory?.projected_position;
  const hasProjectedCoords = isSelected && projectedPos?.lat != null && projectedPos?.lon != null;
  const projectedLatLng = hasProjectedCoords ? [projectedPos.lat, projectedPos.lon] : null;

  return (
    <React.Fragment>
      {/* Projected Drift Trajectory Line (Rendered when 24h analysis is complete) */}
      {isSelected && projectedLatLng && (
        <>
          <Polyline
            positions={[iceberg.coordinates, projectedLatLng]}
            pathOptions={{
              color: '#3385C6',
              weight: 2,
              dashArray: '4, 5',
              opacity: 0.85
            }}
          />
          <CircleMarker
            center={projectedLatLng}
            radius={4}
            pathOptions={{
              color: '#3385C6',
              fillColor: '#FFFFFF',
              fillOpacity: 1,
              weight: 2
            }}
          >
            <Tooltip permanent direction="bottom" offset={[0, 8]} opacity={0.9}>
              <span className="font-mono text-[9px] font-bold text-[#3385C6] bg-white px-1 py-0.5 rounded-xs border border-[#CCE0F0]">
                PROJECTED ({driftProjection.ship_eta_hours || 24}H)
              </span>
            </Tooltip>
          </CircleMarker>
        </>
      )}

      {/* Actual Iceberg Diamond Marker */}
      <Marker
        position={iceberg.coordinates}
        icon={icebergIcon}
        zIndexOffset={isSelected ? 1000 : 0}
        eventHandlers={{
          click: () => onSelect && onSelect(iceberg)
        }}
      >
        <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
          <div className="p-1 font-sans text-center select-none">
            <div className="font-bold text-xs text-[#0F2130] tracking-tight">
              {iceberg.id}
            </div>
            <div className="text-[10px] font-mono text-[#68869E] mt-0.5">
              {iceberg.type || 'Iceberg'} • <span className="font-bold text-[#0F2130]">{iceberg.riskScore || 'MODERATE'}</span>
            </div>
          </div>
        </Tooltip>
      </Marker>
    </React.Fragment>
  );
}
