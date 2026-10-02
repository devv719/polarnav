import React, { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import BottomSummary from '../components/layout/BottomSummary';
import AntarcticMap from '../components/map/AntarcticMap';
import LocationInfoPanel from '../components/panels/LocationInfoPanel';
import NavigationPlanningPanel from '../components/panels/NavigationPlanningPanel';
import { useNavigationState } from '../hooks/useNavigationState';
import { filterStations, calculateStationStats } from '../data/stations/stationUtils';

export default function MapPage() {
  const {
    layers,
    toggleLayer,
    baseLayer,
    setBaseLayer,
    vessel,
    icebergs,
    routes,
    riskZones,
    stations,
    loading,
    selectedObject,
    setSelectedObject,
    selectVessel,
    selectIceberg,
    selectStation,
    selectRoute,
    selectCustomCoordinate,
    mapCenter,
    mapZoom,
    resetAntarcticOverview,
    zoomTo
  } = useNavigationState();

  // Active route type (recommended | alternative)
  const [activeRouteType, setActiveRouteType] = useState('recommended');

  // Navigation planning mode state
  // When a station is set as nav target, we show NavigationPlanningPanel instead of LocationInfoPanel
  const [navDestination, setNavDestination] = useState(null);

  // Station Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedSeasonality, setSelectedSeasonality] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Filtered station records memoized
  const filteredStations = useMemo(() => {
    return filterStations(stations, {
      searchQuery,
      country: selectedCountry,
      seasonality: selectedSeasonality,
      facilityType: selectedType
    });
  }, [stations, searchQuery, selectedCountry, selectedSeasonality, selectedType]);

  // Dynamic statistics calculated directly from CSV records
  const stationStats = useMemo(() => {
    return calculateStationStats(stations);
  }, [stations]);

  const handleSelectRoute = (route) => {
    selectRoute(route);
    setActiveRouteType(route.isRecommended ? 'recommended' : 'alternative');
  };

  /**
   * Called when the user clicks "Set Nav Target" in LocationInfoPanel.
   * Switches from the info panel to the navigation planning panel.
   */
  const handleSetDestination = (station) => {
    setNavDestination(station);
    // Keep the station's context but switch panel mode
    setSelectedObject(null);
    // Zoom the map to see both vessel and destination
    if (station.coordinates) {
      zoomTo(station.coordinates, 5);
    }
  };

  /**
   * Called from NavigationPlanningPanel when iceberg "Run Drift & Melt Analysis"
   * is clicked. Opens the LocationInfoPanel for that iceberg.
   */
  const handleIcebergAnalysis = (iceberg) => {
    setNavDestination(null); // exit nav planning temporarily
    selectIceberg(iceberg);
  };

  /**
   * Called when route is selected from within NavigationPlanningPanel.
   */
  const handleNavSetActiveRoute = (route) => {
    selectRoute(route);
    setActiveRouteType(route.isRecommended ? 'recommended' : 'alternative');
  };

  // Close navigation planning panel
  const handleCloseNavPlanning = () => {
    setNavDestination(null);
  };

  // Close info panel (re-opens or goes back, does NOT affect navDestination)
  const handleCloseInfoPanel = () => {
    setSelectedObject(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#F4F8FB] flex flex-col items-center justify-center text-[#1E3A52] font-mono select-none">
        <div className="w-8 h-8 rounded-full border border-[#CCE0F0] border-t-[#3385C6] animate-spin mb-4" />
        <span className="text-xs tracking-[0.2em] text-[#68869E] uppercase font-semibold">
          LOADING ANTARCTIC GEOSPATIAL INTELLIGENCE
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F4F8FB] text-[#1E3A52] font-sans overflow-hidden select-none">
      {/* 1. TOP MINIMAL NAVIGATION (~60px) */}
      <Header />

      {/* 2. MAIN MAP VIEWPORT */}
      <main className="flex-1 min-h-0 w-full relative overflow-hidden">
        <AntarcticMap
          layers={layers}
          onToggleLayer={toggleLayer}
          baseLayer={baseLayer}
          setBaseLayer={setBaseLayer}
          vessel={vessel}
          icebergs={icebergs}
          routes={routes}
          riskZones={riskZones}
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
          selectedObject={selectedObject}
          navDestination={navDestination}
          onSelectVessel={selectVessel}
          onSelectIceberg={selectIceberg}
          onSelectStation={selectStation}
          onSelectRoute={handleSelectRoute}
          onSelectCoordinate={selectCustomCoordinate}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          onResetOverview={resetAntarcticOverview}
          stats={stationStats}
        />

        {/* 3. RIGHT PANEL — Navigation Planning (when destination is set) */}
        {navDestination ? (
          <NavigationPlanningPanel
            destination={navDestination}
            vessel={vessel}
            routes={routes}
            icebergs={icebergs}
            activeRouteType={activeRouteType}
            onClose={handleCloseNavPlanning}
            onSelectIceberg={handleIcebergAnalysis}
            onSetActiveRoute={handleNavSetActiveRoute}
          />
        ) : (
          /* 3. RIGHT PANEL — Location Info (when an object is selected) */
          <LocationInfoPanel
            selectedObject={selectedObject}
            onClose={handleCloseInfoPanel}
            onZoomTo={(coords) => zoomTo(coords, 7)}
            onSetDestination={handleSetDestination}
          />
        )}
      </main>

      {/* 4. BOTTOM ROUTE SUMMARY BAR */}
      <BottomSummary
        vessel={vessel}
        routes={routes}
        selectedRouteType={activeRouteType}
        onSelectRoute={handleSelectRoute}
        navDestination={navDestination}
      />
    </div>
  );
}
