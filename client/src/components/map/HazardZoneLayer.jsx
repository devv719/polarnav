import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';

export default function HazardZoneLayer({ riskZones, showZones = true, onSelectZone }) {
  if (!showZones || !riskZones?.length) return null;

  return (
    <React.Fragment>
      {riskZones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          pathOptions={{
            color: zone.strokeColor || '#ef4444',
            weight: 1.5,
            dashArray: '5, 5',
            fillColor: zone.fillColor || '#ef4444',
            fillOpacity: zone.opacity || 0.15
          }}
          eventHandlers={{
            click: () => onSelectZone && onSelectZone({
              type: 'coordinate',
              data: {
                coordinates: zone.coordinates[0],
                temperature: -14.5,
                seaIceConcentration: 85,
                icebergProbability: 80,
                windSpeedKnots: 28,
                windDirection: '140°',
                visibilityNM: '2.5',
                waveHeightM: '0.4',
                riskLevel: zone.riskLevel,
                polarCodeRecommendation: zone.description
              }
            })
          }}
        >
          <Tooltip sticky>
            <div className="text-[11px] font-mono p-1 bg-[#1a0808] text-rose-300 max-w-[220px]">
              <span className="font-bold text-rose-200 block">{zone.name}</span>
              <div className="text-[9px] text-slate-300 mt-0.5">
                Ice: {zone.avgIceConcentration} • {zone.dominantIceType}
              </div>
            </div>
          </Tooltip>
        </Polygon>
      ))}
    </React.Fragment>
  );
}
