import React from 'react';
import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import { formatCoordinates } from '../../utils/formatters';

export default function RouteLayer({
  routes,
  showRecommended = true,
  showAlternative = true,
  selectedRouteId,
  onSelectRoute
}) {
  if (!routes) return null;

  const { recommended, alternative } = routes;

  return (
    <React.Fragment>
      {/* 1. Recommended AI Route (Clean Cyan Line) */}
      {showRecommended && recommended?.waypoints && (
        <React.Fragment>
          <Polyline
            positions={recommended.waypoints}
            pathOptions={{
              color: '#00e5ff',
              weight: selectedRouteId === recommended.id ? 4 : 3,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '6, 6'
            }}
            eventHandlers={{
              click: () => onSelectRoute && onSelectRoute(recommended)
            }}
          >
            <Tooltip sticky>
              <div className="text-[11px] font-mono p-1 bg-[#091224] text-cyan-300">
                <span className="font-bold text-white">{recommended.name}</span>
                <div className="text-[9px] text-slate-300">
                  {recommended.totalDistanceNM} NM • {recommended.estimatedTimeHours} hrs • {recommended.estimatedFuelMT} MT Fuel
                </div>
              </div>
            </Tooltip>
          </Polyline>

          {/* Waypoint nodes */}
          {recommended.waypoints.map((wp, idx) => (
            <CircleMarker
              key={`rec-wp-${idx}`}
              center={wp}
              radius={idx === 0 || idx === recommended.waypoints.length - 1 ? 4.5 : 3}
              pathOptions={{
                color: '#00e5ff',
                fillColor: idx === 0 ? '#10b981' : idx === recommended.waypoints.length - 1 ? '#ef4444' : '#081329',
                fillOpacity: 1,
                weight: 1.5
              }}
              eventHandlers={{
                click: () => onSelectRoute && onSelectRoute(recommended)
              }}
            >
              <Tooltip direction="top" offset={[0, -5]}>
                <div className="text-[10px] font-mono bg-[#091224] text-slate-200">
                  <span className="font-bold text-cyan-300">Waypoint {idx + 1}</span>
                  <div className="text-[9px] text-slate-400">
                    {formatCoordinates(wp[0], wp[1])}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </React.Fragment>
      )}

      {/* 2. Alternative Route (Muted Amber/Orange Line) */}
      {showAlternative && alternative?.waypoints && (
        <React.Fragment>
          <Polyline
            positions={alternative.waypoints}
            pathOptions={{
              color: '#f59e0b',
              weight: selectedRouteId === alternative.id ? 3.5 : 2.5,
              opacity: 0.85,
              dashArray: '4, 8'
            }}
            eventHandlers={{
              click: () => onSelectRoute && onSelectRoute(alternative)
            }}
          >
            <Tooltip sticky>
              <div className="text-[11px] font-mono p-1 bg-[#1a1208] text-amber-300">
                <span className="font-bold text-white">{alternative.name}</span>
                <div className="text-[9px] text-slate-300">
                  {alternative.totalDistanceNM} NM • Conventional Direct Corridor
                </div>
              </div>
            </Tooltip>
          </Polyline>

          {/* Alternative Waypoint nodes */}
          {alternative.waypoints.map((wp, idx) => (
            <CircleMarker
              key={`alt-wp-${idx}`}
              center={wp}
              radius={2.5}
              pathOptions={{
                color: '#f59e0b',
                fillColor: '#1a1208',
                fillOpacity: 1,
                weight: 1.2
              }}
              eventHandlers={{
                click: () => onSelectRoute && onSelectRoute(alternative)
              }}
            >
              <Tooltip direction="top" offset={[0, -5]}>
                <div className="text-[10px] font-mono bg-[#1a1208] text-amber-200">
                  <span>Alt Waypoint {idx + 1}</span>
                  <div className="text-[9px] text-slate-400">
                    {formatCoordinates(wp[0], wp[1])}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
