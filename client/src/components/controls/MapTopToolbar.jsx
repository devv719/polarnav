import React, { useState } from 'react';
import { Layers, Search, SlidersHorizontal, Building2 } from 'lucide-react';
import LayersPanel from './LayersPanel';
import MapFilterPanel from './MapFilterPanel';

export default function MapTopToolbar({
  layers,
  onToggleLayer,
  baseLayer,
  setBaseLayer,
  stations = [],
  filteredStations = [],
  searchQuery,
  setSearchQuery,
  selectedCountry,
  setSelectedCountry,
  selectedSeasonality,
  setSelectedSeasonality,
  selectedType,
  setSelectedType,
  onOpenSearch,
  onSelectStation
}) {
  const [activePanel, setActivePanel] = useState(null); // 'layers' | 'filters' | null

  const activeFiltersCount = 
    (selectedCountry !== 'All' ? 1 : 0) +
    (selectedSeasonality !== 'All' ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCountry('All');
    setSelectedSeasonality('All');
    setSelectedType('All');
  };

  return (
    <div className="absolute top-5 left-6 z-[1000] select-none font-sans flex items-center gap-3">
      {/* Unified Main Navigation Toolbar */}
      <div className="relative flex items-center bg-[#FFFFFF] border border-[#CCE0F0] rounded-sm shadow-md p-1">
        {/* 1. Layers Toggle Button */}
        <button
          onClick={() => setActivePanel(activePanel === 'layers' ? null : 'layers')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs transition-colors font-medium ${
            activePanel === 'layers'
              ? 'bg-[#E8F3FA] text-[#0F2130] font-bold border border-[#CCE0F0]'
              : 'text-[#1E3A52] hover:bg-[#F4F8FB]'
          }`}
          title="Map Layers & Basemap Control"
        >
          <Layers className="w-3.5 h-3.5 text-[#3385C6]" />
          <span>Layers</span>
        </button>

        <div className="w-px h-4 bg-[#CCE0F0] mx-1" />

        {/* 2. Prominent Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-sm text-xs text-[#68869E] hover:text-[#0F2130] hover:bg-[#F4F8FB] transition-colors"
          title="Search all stations, icebergs, vessels & sectors"
        >
          <Search className="w-3.5 h-3.5 text-[#3385C6]" />
          <span className="font-sans">Search...</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono text-[#68869E] bg-[#F4F8FB] border border-[#CCE0F0] rounded">
            /
          </kbd>
        </button>

        <div className="w-px h-4 bg-[#CCE0F0] mx-1" />

        {/* 3. Filter Toggle Button */}
        <button
          onClick={() => setActivePanel(activePanel === 'filters' ? null : 'filters')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs transition-colors font-medium ${
            activePanel === 'filters'
              ? 'bg-[#E8F3FA] text-[#0F2130] font-bold border border-[#CCE0F0]'
              : 'text-[#1E3A52] hover:bg-[#F4F8FB]'
          }`}
          title="Filter Facility Records"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#3385C6]" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#3385C6] text-white text-[9px] font-mono font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Layers Dropdown Panel */}
        <LayersPanel
          isOpen={activePanel === 'layers'}
          onClose={() => setActivePanel(null)}
          layers={layers}
          onToggleLayer={onToggleLayer}
          baseLayer={baseLayer}
          setBaseLayer={setBaseLayer}
        />

        {/* Filters Dropdown Panel */}
        <MapFilterPanel
          isOpen={activePanel === 'filters'}
          onClose={() => setActivePanel(null)}
          stations={stations}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedSeasonality={selectedSeasonality}
          setSelectedSeasonality={setSelectedSeasonality}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 4. Right Station / Facility Indicator Badge */}
      <div 
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-2 px-3 py-2 bg-[#FFFFFF] border border-[#CCE0F0] rounded-sm shadow-md text-xs cursor-pointer hover:bg-[#F4F8FB] transition-colors"
        title="View All Antarctic Facilities"
      >
        <Building2 className="w-3.5 h-3.5 text-[#3385C6]" />
        <div className="flex items-center gap-1.5 font-mono">
          <span className="font-bold text-[#0F2130]">
            {filteredStations.length}
          </span>
          <span className="text-[#68869E] text-[10px] tracking-wider uppercase font-semibold">
            {filteredStations.length === stations.length ? 'FACILITIES' : `OF ${stations.length} FACILITIES`}
          </span>
        </div>
      </div>
    </div>
  );
}
