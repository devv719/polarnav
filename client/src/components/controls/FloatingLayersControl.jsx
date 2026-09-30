import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingLayersControl({
  layers,
  onToggleLayer,
  baseLayer = 'satellite',
  setBaseLayer
}) {
  const [isOpen, setIsOpen] = useState(false);

  const layerItems = [
    { num: '01', key: 'stations', label: 'STATIONS' },
    { num: '02', key: 'seaIceConcentration', label: 'SEA ICE' },
    { num: '03', key: 'icebergs', label: 'ICEBERGS' },
    { num: '04', key: 'vessel', label: 'VESSEL' },
    { num: '05', key: 'recommendedRoute', label: 'ROUTES' },
    { num: '06', key: 'riskZones', label: 'RISK ZONES' }
  ];

  const basemaps = [
    { id: 'satellite', label: 'SATELLITE' },
    { id: 'ocean', label: 'OCEAN' },
    { id: 'topo', label: 'TOPO' }
  ];

  return (
    <div className="absolute top-6 left-6 z-[1000] select-none font-mono">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#0B1520]/90 hover:bg-[#0E1B29] text-[#F2F4F5] border border-white/10 rounded-sm backdrop-blur-md transition-all duration-200 shadow-xl"
        title="Toggle Map Layers & Basemaps"
      >
        <span className="text-xs text-[#38bdf8] leading-none">☷</span>
        <span className="text-[10px] tracking-[0.16em] uppercase font-medium">LAYERS</span>
      </button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="mt-2.5 w-60 bg-[#0B1520]/95 backdrop-blur-md border border-white/10 rounded-sm p-4 shadow-2xl space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#82909B] font-medium">
                MAP LAYERS
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#82909B] hover:text-[#F2F4F5] transition-colors leading-none"
              >
                ✕
              </button>
            </div>

            {/* Basemap Switcher */}
            {setBaseLayer && (
              <div>
                <label className="text-[9px] uppercase tracking-widest text-[#82909B] block mb-1.5">
                  BASEMAP
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {basemaps.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBaseLayer(b.id)}
                      className={`py-1 text-[9px] tracking-wider rounded-sm transition-colors border ${
                        baseLayer === b.id
                          ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#F2F4F5] font-semibold'
                          : 'border-white/[0.06] text-[#82909B] hover:text-[#F2F4F5]'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Layer Toggles */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-[#82909B] block mb-1">
                OVERLAYS
              </label>
              {layerItems.map((item) => {
                const isActive = layers[item.key];
                return (
                  <button
                    key={item.key}
                    onClick={() => onToggleLayer(item.key)}
                    className="w-full flex items-center justify-between py-1 text-left group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#82909B] font-mono opacity-60">
                        {item.num}
                      </span>
                      <span
                        className={`text-[11px] tracking-wider transition-colors ${
                          isActive ? 'text-[#F2F4F5] font-medium' : 'text-[#82909B] group-hover:text-[#F2F4F5]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]'
                          : 'bg-white/20 group-hover:bg-white/40'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
