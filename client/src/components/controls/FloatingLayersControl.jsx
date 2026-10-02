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
    { num: '06', key: 'riskZones', label: 'RISK' }
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
        className="flex items-center gap-2 px-3.5 py-2 bg-[#FFFFFF] hover:bg-[#F4F8FB] text-[#1E3A52] border border-[#CCE0F0] rounded-sm backdrop-blur-md transition-all duration-200 shadow-md"
        title="Map Layers & Basemap Control"
      >
        <span className="text-xs text-[#3385C6] leading-none">☷</span>
        <span className="text-[10px] tracking-[0.18em] uppercase font-semibold">LAYERS</span>
      </button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="mt-2.5 w-60 bg-[#FFFFFF]/98 backdrop-blur-md border border-[#CCE0F0] rounded-sm p-4 shadow-xl space-y-4 text-xs"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#CCE0F0]">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#68869E] font-semibold">
                MAP CONTROLS
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#68869E] hover:text-[#1E3A52] transition-colors leading-none"
              >
                ✕
              </button>
            </div>

            {/* Basemap Switcher */}
            {setBaseLayer && (
              <div>
                <label className="text-[9px] uppercase tracking-widest text-[#68869E] block mb-1.5 font-semibold">
                  BASEMAP
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {basemaps.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBaseLayer(b.id)}
                      className={`py-1 text-[9px] tracking-wider rounded-sm transition-colors border ${
                        baseLayer === b.id
                          ? 'bg-[#E8F3FA] border-[#3385C6] text-[#0F2130] font-bold shadow-xs'
                          : 'border-[#CCE0F0] text-[#68869E] hover:text-[#1E3A52] hover:bg-[#F4F8FB]'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Layer Toggles */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[9px] uppercase tracking-widest text-[#68869E] block mb-1 font-semibold">
                LAYERS
              </label>
              {layerItems.map((item) => {
                const isActive = layers[item.key];
                return (
                  <button
                    key={item.key}
                    onClick={() => onToggleLayer(item.key)}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded-sm text-left group hover:bg-[#F4F8FB] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#68869E] font-mono">
                        {item.num}
                      </span>
                      <span
                        className={`text-[11px] tracking-wider transition-colors ${
                          isActive ? 'text-[#1E3A52] font-semibold' : 'text-[#68869E] group-hover:text-[#1E3A52]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-[#3385C6] shadow-[0_0_6px_#66A3D3]'
                          : 'bg-[#CCE0F0] group-hover:bg-[#9CBED8]'
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
