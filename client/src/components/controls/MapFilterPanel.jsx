import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, RotateCcw, Check, X } from 'lucide-react';
import { getUniqueCountries, getUniqueSeasonalities, getUniqueFacilityTypes } from '../../data/stations/stationUtils';

export default function MapFilterPanel({
  isOpen,
  onClose,
  stations = [],
  selectedCountry,
  setSelectedCountry,
  selectedSeasonality,
  setSelectedSeasonality,
  selectedType,
  setSelectedType,
  onResetFilters
}) {
  if (!isOpen) return null;

  const countries = getUniqueCountries(stations);
  const seasonalities = getUniqueSeasonalities(stations);
  const facilityTypes = getUniqueFacilityTypes(stations);

  const activeFiltersCount = 
    (selectedCountry !== 'All' ? 1 : 0) +
    (selectedSeasonality !== 'All' ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="absolute top-14 left-0 w-80 md:w-96 bg-[#FFFFFF] border border-[#CCE0F0] rounded-sm shadow-xl p-5 space-y-5 text-xs font-sans z-[1100]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#CCE0F0]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#3385C6]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F2130] font-sans">
              GIS FILTER WORKSPACE
            </span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#3385C6] text-white text-[10px] font-mono font-bold">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#68869E] hover:text-[#0F2130] rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Seasonality Filter */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold block">
            FACILITY SEASONALITY
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {seasonalities.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeasonality(s)}
                className={`py-1.5 px-2 text-xs rounded-sm transition-all border text-center ${
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

        {/* 2. Facility Type Filter */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold block">
            FACILITY TYPE
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {facilityTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`py-1.5 px-2.5 text-xs rounded-sm transition-all border text-left flex items-center justify-between ${
                  selectedType === t
                    ? 'bg-[#E8F3FA] border-[#3385C6] text-[#0F2130] font-bold shadow-xs'
                    : 'border-[#CCE0F0] text-[#68869E] hover:text-[#1E3A52] hover:bg-[#F4F8FB]'
                }`}
              >
                <span className="truncate">{t}</span>
                {selectedType === t && <Check className="w-3 h-3 text-[#3385C6]" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Country / Operator Dropdown */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold block">
            OPERATING COUNTRY / NATION
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full py-2 px-3 bg-[#FFFFFF] border border-[#CCE0F0] rounded-sm text-xs font-sans text-[#0F2130] font-medium outline-none focus:border-[#3385C6] cursor-pointer"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Operating Nations' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Bottom Actions: Reset & Apply */}
        <div className="pt-3 border-t border-[#CCE0F0] flex items-center justify-between gap-3">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-[#68869E] hover:text-[#1E3A52] rounded-sm transition-colors uppercase"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#3385C6] hover:bg-[#246699] text-white rounded-sm text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-xs"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
