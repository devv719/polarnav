import React from 'react';
import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';

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
      {/* 1. Recommended Route (Clean thin line) */}
      {showRecommended && recommended?.waypoints && (
        <React.Fragment>
          <Polyline
            positions={recommended.waypoints}
            pathOptions={{
              color: '#38bdf8',
              weight: selectedRouteId === recommended.id ? 3 : 2,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round'
            }}
            eventHandlers={{
              click: () => onSelectRoute && onSelectRoute(recommended)
            }}
          >
            <Tooltip sticky opacity={0.95}>
              <div className="p-1 font-mono select-none text-center">
                <span className="font-semibold text-xs text-[#F2F4F5]">RECOMMENDED ROUTE</span>
                <div className="text-[10px] text-[#38bdf8] mt-0.5">
                  {recommended.totalDistanceNM} NM • {recommended.estimatedTimeHours} H • LOW RISK
                </div>
              </div>
            </Tooltip>
          </Polyline>

          {/* Origin & Destination Terminal Markers */}
          {recommended.waypoints.length > 0 && (
            <React.Fragment>
              <CircleMarker
                center={recommended.waypoints[0]}
                radius={4}
                pathOptions={{
                  color: '#38bdf8',
                  fillColor: '#ffffff',
                  fillOpacity: 1,
                  weight: 2
                }}
              />
              <CircleMarker
                center={recommended.waypoints[recommended.waypoints.length - 1]}
                radius={4}
                pathOptions={{
                  color: '#38bdf8',
                  fillColor: '#38bdf8',
                  fillOpacity: 1,
                  weight: 2
                }}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {/* 2. Alternative Route (Subtle dashed line) */}
      {showAlternative && alternative?.waypoints && (
        <React.Fragment>
          <Polyline
            positions={alternative.waypoints}
            pathOptions={{
              color: '#82909B',
              weight: selectedRouteId === alternative.id ? 2 : 1.5,
              opacity: 0.45,
              dashArray: '4, 6'
            }}
            eventHandlers={{
              click: () => onSelectRoute && onSelectRoute(alternative)
            }}
          >
            <Tooltip sticky opacity={0.95}>
              <div className="p-1 font-mono select-none text-center">
                <span className="font-semibold text-xs text-[#82909B]">ALTERNATIVE ROUTE</span>
                <div className="text-[10px] text-[#82909B] mt-0.5">
                  {alternative.totalDistanceNM} NM • Direct Rhumb
                </div>
              </div>
            </Tooltip>
          </Polyline>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
