import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Building2, TriangleAlert, Ship, MapPin, Compass, ArrowRight } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function MapSearchOverlay({
  isOpen,
  onClose,
  stations = [],
  icebergs = [],
  vessel,
  onSelectStation,
  onSelectIceberg,
  onSelectVessel,
  onZoomTo
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL'); // ALL, STATIONS, ICEBERGS, FLEET
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Unified GIS Search Across All Layers
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { stations: [], icebergs: [], vessels: [], total: 0 };

    // 1. Stations search
    const matchedStations = (stations || []).filter((s) => {
      const name = (s.name || '').toLowerCase();
      const country = (s.country || s.operatorPrimary || '').toLowerCase();
      const type = (s.type || '').toLowerCase();
      return name.includes(q) || country.includes(q) || type.includes(q);
    });

    // 2. Icebergs search
    const matchedIcebergs = (icebergs || []).filter((b) => {
      const id = (b.id || '').toLowerCase();
      const type = (b.type || '').toLowerCase();
      const risk = (b.riskScore || '').toLowerCase();
      return id.includes(q) || type.includes(q) || risk.includes(q);
    });

    // 3. Vessel search
    const matchedVessels = [];
    if (vessel) {
      const vName = (vessel.name || '').toLowerCase();
      const vCallsign = (vessel.callsign || '').toLowerCase();
      const vDest = (vessel.destination || '').toLowerCase();
      if (vName.includes(q) || vCallsign.includes(q) || vDest.includes(q) || q === 'vessel' || q === 'ship') {
        matchedVessels.push(vessel);
      }
    }

    const total = matchedStations.length + matchedIcebergs.length + matchedVessels.length;
    return {
      stations: matchedStations.slice(0, 15),
      icebergs: matchedIcebergs.slice(0, 8),
      vessels: matchedVessels,
      total
    };
  }, [query, stations, icebergs, vessel]);

  const handleSelectStation = (station) => {
    onSelectStation(station);
    if (onZoomTo) {
      onZoomTo(station.coordinates || [station.latitude, station.longitude]);
    }
    onClose();
  };

  const handleSelectIceberg = (iceberg) => {
    onSelectIceberg(iceberg);
    if (onZoomTo) {
      onZoomTo([iceberg.latitude, iceberg.longitude]);
    }
    onClose();
  };

  const handleSelectVessel = (v) => {
    onSelectVessel(v);
    if (onZoomTo) {
      onZoomTo(v.coordinates || [v.latitude, v.longitude]);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-start justify-center pt-20 sm:pt-24 px-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F2130]/30 backdrop-blur-xs transition-opacity"
        />

        {/* Search Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#CCE0F0] rounded-sm shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#CCE0F0] bg-[#FFFFFF]">
            <Search className="w-4 h-4 text-[#3385C6] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Antarctic stations, countries, icebergs, vessels or coordinates..."
              className="w-full bg-transparent border-none outline-none text-[#0F2130] placeholder-[#68869E] text-sm font-sans font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#68869E] hover:text-[#0F2130] rounded transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#68869E] bg-[#F4F8FB] border border-[#CCE0F0] rounded">
              ESC
            </kbd>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 px-5 py-2 bg-[#F4F8FB] border-b border-[#CCE0F0] text-xs font-sans">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#68869E] font-semibold mr-1">
              CATEGORY:
            </span>
            {[
              { id: 'ALL', label: 'All Targets' },
              { id: 'STATIONS', label: `Stations (${stations.length})` },
              { id: 'ICEBERGS', label: `Icebergs (${icebergs.length})` },
              { id: 'FLEET', label: 'Fleet & Vessels' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#FFFFFF] border border-[#CCE0F0] text-[#0F2130] font-semibold shadow-xs'
                    : 'text-[#68869E] hover:text-[#1E3A52]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#F4F8FB]">
            {query.trim() === '' ? (
              <div className="py-12 text-center text-[#68869E] space-y-2">
                <Compass className="w-8 h-8 text-[#CCE0F0] mx-auto" />
                <div className="text-sm font-sans font-medium text-[#1E3A52]">
                  Antarctic Geospatial Directory
                </div>
                <div className="text-xs font-mono max-w-sm mx-auto text-[#68869E]">
                  Type to search across 114 research stations, tracked tabular icebergs, and fleet vessels.
                </div>
              </div>
            ) : searchResults.total === 0 ? (
              <div className="py-12 text-center text-[#68869E] space-y-2">
                <div className="text-sm font-sans font-medium text-[#1E3A52]">
                  No matching targets found
                </div>
                <div className="text-xs font-mono text-[#68869E]">
                  No records matching "{query}" in the active database.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. VESSEL MATCHES */}
                {(activeCategory === 'ALL' || activeCategory === 'FLEET') && searchResults.vessels.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-[#3385C6] font-bold">
                      VESSEL TELEMETRY
                    </div>
                    {searchResults.vessels.map((v) => (
                      <div
                        key={v.id || 'vessel'}
                        onClick={() => handleSelectVessel(v)}
                        className="group flex items-center justify-between p-3 rounded hover:bg-[#F4F8FB] cursor-pointer transition-colors border border-transparent hover:border-[#CCE0F0]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#E8F3FA] text-[#3385C6] rounded">
                            <Ship className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-sans font-bold text-[#0F2130] group-hover:text-[#3385C6] transition-colors">
                              {v.name}
                            </div>
                            <div className="text-xs font-mono text-[#68869E] mt-0.5">
                              {v.iceClass || 'Research Vessel'} • Dest: {v.destination}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-semibold text-[#1E3A52]">
                            {v.speedKnots} kts • {v.heading}°
                          </div>
                          <div className="text-[10px] font-mono text-[#68869E]">
                            {formatCoordinates(v.coordinates?.[0] || v.latitude, v.coordinates?.[1] || v.longitude)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. ICEBERG MATCHES */}
                {(activeCategory === 'ALL' || activeCategory === 'ICEBERGS') && searchResults.icebergs.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-rose-600 font-bold">
                      TRACKED ICEBERGS & HAZARDS
                    </div>
                    {searchResults.icebergs.map((berg) => (
                      <div
                        key={berg.id}
                        onClick={() => handleSelectIceberg(berg)}
                        className="group flex items-center justify-between p-3 rounded hover:bg-[#F4F8FB] cursor-pointer transition-colors border border-transparent hover:border-[#CCE0F0]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-50 text-rose-600 rounded">
                            <TriangleAlert className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-sans font-bold text-[#0F2130] group-hover:text-[#3385C6] transition-colors">
                              {berg.id}
                            </div>
                            <div className="text-xs font-mono text-[#68869E] mt-0.5">
                              {berg.type || 'Tabular Iceberg'} • {berg.lengthKm ? `${berg.lengthKm}×${berg.widthKm} km` : 'Tracked Berg'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                              berg.riskScore === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800'
                                : berg.riskScore === 'HIGH'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-[#E8F3FA] text-[#3385C6]'
                            }`}
                          >
                            {berg.riskScore || 'Moderate'}
                          </span>
                          <div className="text-[10px] font-mono text-[#68869E] mt-1">
                            {formatCoordinates(berg.latitude, berg.longitude)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. STATION MATCHES */}
                {(activeCategory === 'ALL' || activeCategory === 'STATIONS') && searchResults.stations.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-[#1E3A52] font-bold">
                      RESEARCH STATIONS & FACILITIES ({searchResults.stations.length})
                    </div>
                    {searchResults.stations.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => handleSelectStation(st)}
                        className="group flex items-center justify-between p-3 rounded hover:bg-[#F4F8FB] cursor-pointer transition-colors border border-transparent hover:border-[#CCE0F0]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#F4F8FB] text-[#1E3A52] group-hover:bg-[#E8F3FA] group-hover:text-[#3385C6] rounded transition-colors">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-sans font-bold text-[#0F2130] group-hover:text-[#3385C6] transition-colors">
                              {st.name}
                            </div>
                            <div className="text-xs font-mono text-[#68869E] mt-0.5">
                              {st.country || st.operatorPrimary} • {st.type || 'Station'} {st.seasonality ? `(${st.seasonality})` : ''}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-mono text-[#1E3A52] font-medium">
                              {formatCoordinates(st.coordinates?.[0] || st.latitude, st.coordinates?.[1] || st.longitude)}
                            </div>
                            {st.elevation !== null && (
                              <div className="text-[10px] font-mono text-[#68869E]">
                                Elev: {st.elevation}m
                              </div>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#CCE0F0] group-hover:text-[#3385C6] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-2.5 bg-[#F4F8FB] border-t border-[#CCE0F0] flex items-center justify-between text-[11px] font-mono text-[#68869E]">
            <span>COMNAP & NIC Active Database</span>
            <span>Click any target to focus GIS viewport</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
