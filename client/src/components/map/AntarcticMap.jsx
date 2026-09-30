import React, { useState, useEffect } from 'react';
import { MapContainer, useMap, useMapEvents } from 'react-leaflet';
import MapBaseLayer from './MapBaseLayer';
import VesselMarker from './VesselMarker';
import IcebergMarker from './IcebergMarker';
import RouteLayer from './RouteLayer';
import RiskZoneLayer from './RiskZoneLayer';
import StationMarker from './StationMarker';
import MapLegend from './MapLegend';
import MapControls from './MapControls';
import { formatCoordinates } from '../../utils/formatters';
import { ANTARCTIC_BASE_VIEW } from '../../data/antarcticDemoData';

/**
 * Controller component to handle smooth animated camera movements
 */
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  return null;
}

/**
 * Capture map clicks to probe geographic points and track cursor coordinates
 */
function MapEventHandler({ onMapClick, onMouseMove }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
    },
    mousemove(e) {
      if (onMouseMove) onMouseMove(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function AntarcticMap({
  layers,
  baseLayer = 'satellite',
  setBaseLayer,
  vessel,
  icebergs,
  routes,
  riskZones,
  stations,
  selectedObject,
  onSelectVessel,
  onSelectIceberg,
  onSelectStation,
  onSelectRoute,
  onSelectCoordinate,
  mapCenter = ANTARCTIC_BASE_VIEW.center,
  mapZoom = ANTARCTIC_BASE_VIEW.zoom,
  onResetOverview
}) {
  const [cursorCoord, setCursorCoord] = useState('');

  const handleMouseMove = (lat, lng) => {
    setCursorCoord(formatCoordinates(lat, lng));
  };

  const handleResetAntarctica = () => {
    if (onResetOverview) {
      onResetOverview();
    }
  };

  return (
    <div className="relative w-full h-full bg-[#020610] overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={2}
        maxZoom={15}
        scrollWheelZoom={true}
        zoomControl={false} // We have custom MapControls with MapTiler styling
        className="w-full h-full"
      >
        <MapViewController center={mapCenter} zoom={mapZoom} />
        <MapEventHandler
          onMapClick={onSelectCoordinate}
          onMouseMove={handleMouseMove}
        />

        {/* 1. MapTiler Satellite / Geographic Basemap */}
        <MapBaseLayer mapType={baseLayer} />

        {/* 2. Geospatial Risk & Pack Ice Polygons */}
        <RiskZoneLayer
          riskZones={riskZones}
          showZones={layers.riskZones}
          onSelectZone={onSelectCoordinate}
        />

        {/* 3. Recommended & Alternative Navigation Routes */}
        <RouteLayer
          routes={routes}
          showRecommended={layers.recommendedRoute}
          showAlternative={layers.alternativeRoute}
          selectedRouteId={selectedObject?.type === 'route' ? selectedObject.data.id : null}
          onSelectRoute={onSelectRoute}
        />

        {/* 4. Antarctic Research Bases */}
        {layers.stations && stations?.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            isSelected={selectedObject?.type === 'station' && selectedObject.data.id === station.id}
            onSelect={onSelectStation}
          />
        ))}

        {/* 5. Tracked Icebergs */}
        {layers.icebergs && icebergs?.map((iceberg) => (
          <IcebergMarker
            key={iceberg.id}
            iceberg={iceberg}
            isSelected={selectedObject?.type === 'iceberg' && selectedObject.data.id === iceberg.id}
            onSelect={onSelectIceberg}
          />
        ))}

        {/* 6. Active Research Vessel (ORV Sagar Nidhi) */}
        {layers.vessel && vessel && (
          <VesselMarker
            vessel={vessel}
            isSelected={selectedObject?.type === 'vessel'}
            onSelect={onSelectVessel}
          />
        )}

        {/* Floating In-Map Telemetry & Zoom/Reset Controls */}
        <MapControls
          baseLayer={baseLayer}
          setBaseLayer={setBaseLayer}
          onResetAntarctica={handleResetAntarctica}
          cursorCoord={cursorCoord}
        />
      </MapContainer>

      {/* Symbology Legend */}
      <MapLegend />
    </div>
  );
}
