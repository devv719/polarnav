import React, { useEffect, useState } from 'react';
import { MapContainer, useMap, useMapEvents } from 'react-leaflet';
import MapBaseLayer from './MapBaseLayer';
import SatelliteLayer from './SatelliteLayer';
import VesselMarker from './VesselMarker';
import IcebergMarker from './IcebergMarker';
import RouteLayer from './RouteLayer';
import RiskZoneLayer from './RiskZoneLayer';
import StationMarker from './StationMarker';
import MapLegend from './MapLegend';
import MapControls from './MapControls';
import MapTopToolbar from '../controls/MapTopToolbar';
import MapSearchOverlay from '../controls/MapSearchOverlay';
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

  useEffect(() => {
    // Invalidate size to guarantee correct tile alignment after render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global hotkey '/' or 'Ctrl+K' to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !isSearchOpen && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <div className="relative w-full h-full bg-[#F4F8FB] overflow-hidden">
      {/* 1. Compact Integrated GIS Top Toolbar */}
      <MapTopToolbar
        layers={layers}
        onToggleLayer={onToggleLayer}
        baseLayer={baseLayer}
        setBaseLayer={setBaseLayer}
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
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectStation={onSelectStation}
      />

      {/* 2. Prominent Full-Featured GIS Search Overlay */}
      <MapSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stations={stations}
        icebergs={icebergs}
        vessel={vessel}
        onSelectStation={onSelectStation}
        onSelectIceberg={onSelectIceberg}
        onSelectVessel={onSelectVessel}
        onZoomTo={onResetOverview ? (coords) => onResetOverview(coords) : undefined}
      />

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

        {/* NASA GIBS Daily MODIS Visual Imagery Tile Layer */}
        <SatelliteLayer visible={layers.nasaGibs} />

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
