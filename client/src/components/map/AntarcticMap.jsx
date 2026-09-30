import React, { useEffect } from 'react';
import { MapContainer, useMap, useMapEvents } from 'react-leaflet';
import MapBaseLayer from './MapBaseLayer';
import VesselMarker from './VesselMarker';
import IcebergMarker from './IcebergMarker';
import RouteLayer from './RouteLayer';
import RiskZoneLayer from './RiskZoneLayer';
import StationMarker from './StationMarker';
import MapLegend from './MapLegend';
import MapControls from './MapControls';
import FloatingLayersControl from '../controls/FloatingLayersControl';
import StationSearchFilter from '../controls/StationSearchFilter';
import { ANTARCTIC_BASE_VIEW } from '../../data/antarcticDemoData';

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

function MapEventHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function AntarcticMap({
  layers,
  onToggleLayer,
  baseLayer = 'satellite',
  setBaseLayer,
  vessel,
  icebergs,
  routes,
  riskZones,
  stations = [],
  filteredStations = [],
  searchQuery = '',
  setSearchQuery,
  selectedCountry = 'All',
  setSelectedCountry,
  selectedSeasonality = 'All',
  setSelectedSeasonality,
  selectedType = 'All',
  setSelectedType,
  selectedObject,
  onSelectVessel,
  onSelectIceberg,
  onSelectStation,
  onSelectRoute,
  onSelectCoordinate,
  mapCenter = ANTARCTIC_BASE_VIEW.center,
  mapZoom = ANTARCTIC_BASE_VIEW.zoom,
  onResetOverview,
  stats
}) {
  return (
    <div className="relative w-full h-full bg-[#071018] overflow-hidden">
      {/* 1. Floating Left Layers Control with Basemaps */}
      <FloatingLayersControl
        layers={layers}
        onToggleLayer={onToggleLayer}
        baseLayer={baseLayer}
        setBaseLayer={setBaseLayer}
      />

      {/* 2. Compact Station Search & Dynamic Filters */}
      {layers.stations && (
        <StationSearchFilter
          stations={stations}
          filteredStations={filteredStations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedSeasonality={selectedSeasonality}
          setSelectedSeasonality={setSelectedSeasonality}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onSelectStation={onSelectStation}
          stats={stats}
        />
      )}

      {/* 3. Interactive Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={2}
        maxZoom={15}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <MapViewController center={mapCenter} zoom={mapZoom} />
        <MapEventHandler onMapClick={onSelectCoordinate} />

        {/* Satellite / Ocean / Topo Basemap */}
        <MapBaseLayer mapType={baseLayer} />

        {/* Subtle Sea Ice & Risk Hazard Layer */}
        <RiskZoneLayer
          riskZones={riskZones}
          showZones={layers.seaIceConcentration || layers.riskZones}
          onSelectZone={onSelectCoordinate}
        />

        {/* Clean Navigation Routes */}
        <RouteLayer
          routes={routes}
          showRecommended={layers.recommendedRoute}
          showAlternative={layers.alternativeRoute}
          selectedRouteId={selectedObject?.type === 'route' ? selectedObject.data.id : null}
          onSelectRoute={onSelectRoute}
        />

        {/* Antarctic Research Bases & Facilities (from COMNAP CSV) */}
        {layers.stations && filteredStations?.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            isSelected={selectedObject?.type === 'station' && selectedObject.data.id === station.id}
            onSelect={onSelectStation}
          />
        ))}

        {/* Iceberg Diamond Markers */}
        {layers.icebergs && icebergs?.map((iceberg) => (
          <IcebergMarker
            key={iceberg.id}
            iceberg={iceberg}
            isSelected={selectedObject?.type === 'iceberg' && selectedObject.data.id === iceberg.id}
            onSelect={onSelectIceberg}
          />
        ))}

        {/* Research Vessel (ORV Sagar Nidhi) */}
        {layers.vessel && vessel && (
          <VesselMarker
            vessel={vessel}
            isSelected={selectedObject?.type === 'vessel'}
            onSelect={onSelectVessel}
          />
        )}

        {/* Minimal Zoom & Overview Controls */}
        <MapControls onResetAntarctica={onResetOverview} />
      </MapContainer>

      {/* Unobtrusive Sea Ice Legend */}
      <MapLegend />
    </div>
  );
}
