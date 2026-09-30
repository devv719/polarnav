import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';

export default function RiskZoneLayer({ riskZones, showZones = true, onSelectZone }) {
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
            dashArray: '4, 4',
            fillColor: zone.fillColor || '#ef4444',
            fillOpacity: zone.fillOpacity || 0.18
          }}
          eventHandlers={{
            click: () => onSelectZone && onSelectZone({
              type: 'coordinate',
              data: {
                coordinates: zone.coordinates[0],
                temperature: -14.2,
                seaIceConcentration: 84,
                icebergProbability: 88,
                windSpeedKnots: 26,
                windDirection: '145°',
                visibilityNM: '3.0',
                waveHeightM: '0.5',
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
                Ice: {zone.avgIceConcentration} • Risk: {zone.riskLevel}
              </div>
            </div>
          </Tooltip>
        </Polygon>
      ))}
    </React.Fragment>
  );
}
