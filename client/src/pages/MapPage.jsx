import React, { useState } from 'react';
import Header from '../components/layout/Header';
import BottomSummary from '../components/layout/BottomSummary';
import AntarcticMap from '../components/map/AntarcticMap';
import LocationInfoPanel from '../components/panels/LocationInfoPanel';
import { useNavigationState } from '../hooks/useNavigationState';

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
    resetAntarcticOverview
  } = useNavigationState();

  const [activeRouteType, setActiveRouteType] = useState('recommended');

  const handleSelectRoute = (route) => {
    selectRoute(route);
    setActiveRouteType(route.isRecommended ? 'recommended' : 'alternative');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#071018] flex flex-col items-center justify-center text-[#F2F4F5] font-mono select-none">
        <div className="w-8 h-8 rounded-full border border-[#38bdf8]/20 border-t-[#38bdf8] animate-spin mb-4" />
        <span className="text-xs tracking-[0.2em] text-[#82909B] uppercase font-medium">
          INITIALIZING POLAR MAP
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#071018] text-[#F2F4F5] font-sans overflow-hidden select-none">
      {/* 1. TOP MINIMAL NAVIGATION (~60px) */}
      <Header />

      {/* 2. MAIN MAP VIEWPORT (~90% screen) */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
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
          selectedObject={selectedObject}
          onSelectVessel={selectVessel}
          onSelectIceberg={selectIceberg}
          onSelectStation={selectStation}
          onSelectRoute={handleSelectRoute}
          onSelectCoordinate={selectCustomCoordinate}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          onResetOverview={resetAntarcticOverview}
        />

        {/* 3. RIGHT INFORMATION PANEL (ONLY appears when an object is selected) */}
        <LocationInfoPanel
          selectedObject={selectedObject}
          onClose={() => setSelectedObject(null)}
        />
      </main>

      {/* 4. BOTTOM ROUTE SUMMARY BAR (~44px) */}
      <BottomSummary
        vessel={vessel}
        routes={routes}
        selectedRouteType={activeRouteType}
        onSelectRoute={handleSelectRoute}
      />
    </div>
  );
}
