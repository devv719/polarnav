import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BottomSummary from './components/layout/BottomSummary';
import AntarcticMap from './components/map/AntarcticMap';
import LocationInfoPanel from './components/panels/LocationInfoPanel';
import { useNavigationState } from './hooks/useNavigationState';
import { Compass } from 'lucide-react';

export default function App() {
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
    focusVessel,
    resetAntarcticOverview
  } = useNavigationState();

  // Active route mode for bottom summary ('recommended' | 'alternative')
  const [activeRouteType, setActiveRouteType] = useState('recommended');

  const handleSelectRoute = (route) => {
    selectRoute(route);
    setActiveRouteType(route.isRecommended ? 'recommended' : 'alternative');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#060a12] flex flex-col items-center justify-center text-slate-100 font-mono select-none">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <Compass className="w-8 h-8 text-cyan-400 absolute" />
        </div>
        <div className="text-sm font-bold font-display text-white tracking-wider flex items-center gap-2">
          POLARNAV <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">AI</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 animate-pulse">
          INITIALIZING ANTARCTIC NAVIGATION MATRIX...
        </p>
        <p className="text-[10px] text-slate-400 mt-4">
          Ministry of Earth Sciences (MoES) / NCPOR • SIH 2026
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#060a12] text-slate-100 font-sans overflow-hidden select-none">
      {/* 1. TOP HEADER */}
      <Header
        onFocusVessel={focusVessel}
        onResetOverview={resetAntarcticOverview}
      />

      {/* 2. MAIN CENTER BODY (Left Sidebar + Center Map + Right Telemetry Panel) */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Layer Controls & Station Quick Jump */}
        <Sidebar
          layers={layers}
          onToggleLayer={toggleLayer}
          stations={stations}
          onSelectStation={selectStation}
          selectedObjectId={selectedObject?.data?.id}
        />

        {/* Primary Interactive Antarctic Map */}
        <main className="flex-1 h-full relative">
          <AntarcticMap
            layers={layers}
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
            onFocusVessel={focusVessel}
            onResetOverview={resetAntarcticOverview}
          />
        </main>

        {/* Right Dynamic Telemetry & Object Info Panel */}
        <LocationInfoPanel
          selectedObject={selectedObject}
          onClose={() => setSelectedObject(null)}
        />
      </div>

      {/* 3. BOTTOM NAVIGATION & ROUTE SUMMARY */}
      <BottomSummary
        vessel={vessel}
        routes={routes}
        selectedRouteType={activeRouteType}
        onSelectRoute={handleSelectRoute}
      />
    </div>
  );
}
