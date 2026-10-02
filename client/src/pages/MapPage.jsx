import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import BottomSummary from '../components/layout/BottomSummary';
import AntarcticMap from '../components/map/AntarcticMap';
import LocationInfoPanel from '../components/panels/LocationInfoPanel';
import NavWorkspacePanel from '../components/panels/NavigationPlanningPanel';
import IcebergIntelligencePanel from '../components/panels/IcebergIntelligencePanel';
import { useNavigationState } from '../hooks/useNavigationState';
import { filterStations, calculateStationStats } from '../data/stations/stationUtils';

/**
 * Spring transition for the layout panels.
 * Map shrinks to ~58% while the workspace panel slides in on the right.
 */
const LAYOUT_SPRING = { type: 'spring', stiffness: 260, damping: 34 };

export default function MapPage() {
  const {
    layers,
    toggleLayer,
    baseLayer,
    setBaseLayer,
    vessel,
    vessels,
    setVessel,
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
    zoomTo,
    planRouteForVessel
  } = useNavigationState();

  // Which route is currently emphasised in the RouteLayer
  const [activeRouteType, setActiveRouteType] = useState('recommended');

  // Navigation planning state — when non-null, nav workspace is open
  const [navDestination, setNavDestination] = useState(null);

  // Active iceberg drift analysis results for map vector projection
  const [icebergDriftAnalysis, setIcebergDriftAnalysis] = useState(null);

  // Station filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedSeasonality, setSelectedSeasonality] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredStations = useMemo(
    () =>
      filterStations(stations, {
        searchQuery,
        country: selectedCountry,
        seasonality: selectedSeasonality,
        facilityType: selectedType,
      }),
    [stations, searchQuery, selectedCountry, selectedSeasonality, selectedType]
  );

  const stationStats = useMemo(() => calculateStationStats(stations), [stations]);

  // Derived panel modes
  const isNavMode = Boolean(navDestination);
  const selectedIceberg = selectedObject?.type === 'iceberg' ? selectedObject.data : null;
  const isIcebergMode = Boolean(selectedIceberg);
  const isSplitLayout = isNavMode || isIcebergMode;

  /* ── handlers ── */

  const handleSelectRoute = (route) => {
    selectRoute(route);
    setActiveRouteType(route.isRecommended ? 'recommended' : 'alternative');
  };

  /** Called when user clicks "Set as Navigation Target" in the station info panel.
   * Opens the nav workspace in selection mode — does NOT auto-route.
   * The user must still pick a vessel and click Start Navigation.
   */
  const handleSetDestination = (station) => {
    setNavDestination(station);
    setSelectedObject(null);
    setIcebergDriftAnalysis(null);
    // Zoom out to show the destination on the map
    if (station.coordinates) {
      zoomTo(station.coordinates, 4);
    }
  };

  /** Called when user switches active vessel from within the Navigation Planning Panel.
   * Updates the selected vessel and clears any previous route until Start Navigation is clicked.
   */
  const handleChangeVessel = (newVessel) => {
    setVessel(newVessel);
    // Clear stale route from previous vessel
    planRouteForVessel(null, null);
    if (newVessel.coordinates) {
      zoomTo(newVessel.coordinates, 6);
    }
  };

  /** Called when user switches destination from within the Navigation Planning Panel.
   * Updates the destination and clears any previous route until Start Navigation is clicked.
   */
  const handleChangeDestination = (newStation) => {
    setNavDestination(newStation);
    // Clear stale route from previous destination
    planRouteForVessel(null, null);
    if (newStation.coordinates) {
      zoomTo(newStation.coordinates, 4);
    }
  };

  /** Called when user clicks "Start Navigation" — calculates optimal maritime route for chosen vessel & destination. */
  const handleStartNavigation = async ({ vessel: activeVessel, destination }) => {
    if (!activeVessel || !destination) return;
    const newRoutes = await planRouteForVessel(
      activeVessel,
      destination.id,
      destination.coordinates
    );
    const chosenRoute = newRoutes?.recommended || newRoutes?.alternative;
    if (chosenRoute) {
      selectRoute(chosenRoute);
      setActiveRouteType(chosenRoute.isRecommended ? 'recommended' : 'alternative');
    }
    if (activeVessel?.coordinates) {
      zoomTo(activeVessel.coordinates, 6);
    }
  };

  /** Open iceberg analysis workspace from within the nav workspace or map */
  const handleIcebergAnalysis = (iceberg) => {
    setNavDestination(null); // transition from nav mode to iceberg intelligence mode
    setIcebergDriftAnalysis(null);
    selectIceberg(iceberg);
    const coords = iceberg.coordinates || [iceberg.latitude, iceberg.longitude];
    if (coords) {
      zoomTo(coords, 6);
    }
  };

  /** Route changed from within nav workspace */
  const handleNavSetActiveRoute = (route) => {
    selectRoute(route);
    setActiveRouteType(route.isRecommended ? 'recommended' : 'alternative');
  };

  const handleCloseNavPlanning = () => {
    setNavDestination(null);
  };

  const handleCloseIcebergPlanning = () => {
    setSelectedObject(null);
    setIcebergDriftAnalysis(null);
  };

  const handleCloseInfoPanel = () => {
    setSelectedObject(null);
  };

  /* ── loading ── */

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#F4F8FB] flex flex-col items-center justify-center text-[#1E3A52] font-sans select-none">
        <div className="w-8 h-8 rounded-full border border-[#CCE0F0] border-t-[#3385C6] animate-spin mb-4" />
        <span className="text-xs tracking-[0.2em] text-[#68869E] uppercase font-semibold">
          Loading Antarctic Geospatial Intelligence
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F4F8FB] text-[#1E3A52] font-sans overflow-hidden select-none">
      {/* ── TOP HEADER ── */}
      <Header />

      {/* ── MAIN WORKSPACE ── */}
      <main className="flex-1 min-h-0 w-full flex overflow-hidden">

        {/* LEFT: MAP PANE ─────────────────────────────────────────────────── */}
        <motion.div
          layout
          animate={{ flex: isSplitLayout ? '0 0 58%' : '1 1 100%' }}
          transition={LAYOUT_SPRING}
          className="relative min-h-0 overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <AntarcticMap
            layers={layers}
            onToggleLayer={toggleLayer}
            baseLayer={baseLayer}
            setBaseLayer={setBaseLayer}
            vessel={vessel}
            vessels={vessels}
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
            selectedIceberg={selectedIceberg}
            icebergDriftAnalysis={icebergDriftAnalysis}
            activeRouteType={activeRouteType}
            onSelectVessel={selectVessel}
            onSelectIceberg={handleIcebergAnalysis}
            onSelectStation={selectStation}
            onSelectRoute={handleSelectRoute}
            onSelectCoordinate={selectCustomCoordinate}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            onResetOverview={resetAntarcticOverview}
            stats={stationStats}
          />

          {/* LOCATION INFO PANEL — overlaid inside map pane for non-iceberg entities (stations, probed coordinates, routes) */}
          <AnimatePresence>
            {!isSplitLayout && selectedObject && selectedObject.type !== 'iceberg' && (
              <LocationInfoPanel
                selectedObject={selectedObject}
                onClose={handleCloseInfoPanel}
                onZoomTo={(coords) => zoomTo(coords, 7)}
                onSetDestination={handleSetDestination}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT: NAVIGATION WORKSPACE ───────────────────────────────────── */}
        <AnimatePresence>
          {isNavMode && (
            <motion.div
              key="nav-workspace"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '42%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={LAYOUT_SPRING}
              className="h-full overflow-hidden shrink-0"
              style={{ minWidth: 0 }}
            >
              <NavWorkspacePanel
                destination={navDestination}
                vessel={vessel}
                vessels={vessels}
                stations={stations}
                routes={routes}
                icebergs={icebergs}
                activeRouteType={activeRouteType}
                onClose={handleCloseNavPlanning}
                onSelectIceberg={handleIcebergAnalysis}
                onSetActiveRoute={handleNavSetActiveRoute}
                onChangeVessel={handleChangeVessel}
                onChangeDestination={handleChangeDestination}
                onStartNavigation={handleStartNavigation}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT: ICEBERG INTELLIGENCE WORKSPACE ─────────────────────────── */}
        <AnimatePresence>
          {isIcebergMode && (
            <motion.div
              key="iceberg-workspace"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '42%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={LAYOUT_SPRING}
              className="h-full overflow-hidden shrink-0"
              style={{ minWidth: 0 }}
            >
              <IcebergIntelligencePanel
                iceberg={selectedIceberg}
                onClose={handleCloseIcebergPlanning}
                onAnalysisComplete={(res) => setIcebergDriftAnalysis(res)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── BOTTOM SUMMARY BAR ── */}
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
