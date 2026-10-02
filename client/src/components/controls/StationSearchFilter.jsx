import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUniqueCountries, getUniqueSeasonalities, getUniqueFacilityTypes } from '../../data/stations/stationUtils';

export default function StationSearchFilter({
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
  onSelectStation,
  stats
}) {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const countries = getUniqueCountries(stations);
  const seasonalities = getUniqueSeasonalities(stations);
  const facilityTypes = getUniqueFacilityTypes(stations);

  // Suggestions for autocomplete when searching
  const searchResults = searchQuery.trim()
    ? filteredStations.slice(0, 6)
    : [];

  const handleSelectResult = (station) => {
    onSelectStation(station);
    setIsFocused(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('All');
    setSelectedSeasonality('All');
    setSelectedType('All');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCountry !== 'All' ||
    selectedSeasonality !== 'All' ||
    selectedType !== 'All';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="absolute top-6 left-32 z-[1000] select-none font-mono text-xs">
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative flex items-center bg-[#FFFFFF] backdrop-blur-md border border-[#CCE0F0] rounded-sm shadow-md px-3 py-1.5 w-64 md:w-72 transition-all focus-within:border-[#3385C6] focus-within:w-80">
          <Search className="w-3.5 h-3.5 text-[#68869E] shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search stations, countries..."
            className="bg-transparent border-none outline-none text-[#1E3A52] placeholder-[#68869E]/80 text-xs w-full font-mono font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#68869E] hover:text-[#1E3A52] p-0.5 ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsOpenFilter(!isOpenFilter)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-sm border backdrop-blur-md shadow-md transition-all ${
            hasActiveFilters
              ? 'bg-[#E8F3FA] border-[#3385C6] text-[#3385C6] font-semibold'
              : 'bg-[#FFFFFF] border-[#CCE0F0] text-[#68869E] hover:text-[#1E3A52]'
          }`}
          title="Filter Antarctic Stations"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span className="text-[10px] tracking-widest uppercase hidden sm:inline">
            FILTER
          </span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#3385C6]" />
          )}
        </button>

        {/* Subtle Facility Count Tag */}
        <div className="hidden lg:flex items-center px-3 py-2 bg-[#FFFFFF] backdrop-blur-md border border-[#CCE0F0] rounded-sm text-[10px] text-[#68869E] tracking-wider uppercase shadow-xs">
          <span className="text-[#1E3A52] font-bold mr-1">
            {filteredStations.length}
          </span>
          <span>/ {stations.length} FACILITIES</span>
        </div>
      </div>

      {/* Autocomplete Search Dropdown */}
      <AnimatePresence>
        {isFocused && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 mt-1.5 w-80 bg-[#FFFFFF] backdrop-blur-md border border-[#CCE0F0] rounded-sm shadow-xl overflow-hidden py-1 z-50"
          >
            <div className="px-3 py-1.5 border-b border-[#CCE0F0] text-[9px] tracking-[0.2em] text-[#68869E] uppercase font-bold flex justify-between bg-[#F4F8FB]">
              <span>MATCHING STATIONS</span>
              <span>{searchResults.length} RESULTS</span>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-[#CCE0F0]/50">
              {searchResults.map((station) => (
                <button
                  key={station.id}
                  onClick={() => handleSelectResult(station)}
                  className="w-full text-left px-3 py-2 hover:bg-[#F4F8FB] transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs text-[#1E3A52] font-semibold truncate group-hover:text-[#3385C6]">
                      {station.name}
                    </div>
                    <div className="text-[10px] text-[#68869E] truncate">
                      {station.operatorPrimary || station.country} • {station.type}
                    </div>
                  </div>
                  <span className="text-[9px] text-[#3385C6] uppercase px-1.5 py-0.5 rounded bg-[#E8F3FA] border border-[#CCE0F0] shrink-0 font-medium">
                    {station.seasonality}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Popover Panel */}
      <AnimatePresence>
        {isOpenFilter && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full left-0 mt-2 w-72 md:w-80 bg-[#FFFFFF] backdrop-blur-md border border-[#CCE0F0] rounded-sm p-4 shadow-xl z-50 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#CCE0F0]">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#68869E] font-bold">
                FACILITY FILTERS
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] text-[#3385C6] font-semibold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Seasonality */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-[#68869E] block mb-1.5 font-semibold">
                Seasonality
              </label>
              <div className="grid grid-cols-3 gap-1">
                {seasonalities.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeasonality(s)}
                    className={`py-1 text-[10px] rounded-sm transition-colors border ${
                      selectedSeasonality === s
                        ? 'bg-[#E8F3FA] border-[#3385C6] text-[#0F2130] font-bold shadow-xs'
                        : 'border-[#CCE0F0] text-[#68869E] hover:text-[#1E3A52] hover:bg-[#F4F8FB]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Facility Type */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-[#68869E] block mb-1.5 font-semibold">
                Facility Type
              </label>
              <div className="grid grid-cols-2 gap-1 max-h-28 overflow-y-auto">
                {facilityTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`py-1 px-2 text-[10px] text-left truncate rounded-sm transition-colors border ${
                      selectedType === t
                        ? 'bg-[#E8F3FA] border-[#3385C6] text-[#0F2130] font-bold shadow-xs'
                        : 'border-[#CCE0F0] text-[#68869E] hover:text-[#1E3A52] hover:bg-[#F4F8FB]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Country / Operator Dropdown */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-[#68869E] block mb-1.5 font-semibold">
                Country / National Program
              </label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#F4F8FB] border border-[#CCE0F0] rounded-sm py-1.5 px-2 text-[11px] text-[#1E3A52] outline-none font-mono cursor-pointer appearance-none pr-6 font-medium"
                >
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-[#FFFFFF] text-[#1E3A52]">
                      {c === 'All' ? 'All Countries / Operators' : c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#68869E] absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Statistical summary inside panel */}
            <div className="pt-2 border-t border-[#CCE0F0] flex justify-between text-[9px] text-[#68869E]">
              <span>Matching: {filteredStations.length} of {stations.length}</span>
              <span>Year-round: {stats?.yearRound || 0}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
