import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingLayersControl({ layers, onToggleLayer }) {
  const [isOpen, setIsOpen] = useState(false);

  const layerItems = [
    { key: 'seaIceConcentration', label: 'Sea Ice' },
    { key: 'icebergs', label: 'Icebergs' },
    { key: 'vessel', label: 'Vessel' },
    { key: 'recommendedRoute', label: 'Routes' },
    { key: 'stations', label: 'Stations' }
  ];

  return (
    <div className="absolute top-6 left-6 z-[1000] select-none font-mono">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 bg-[#0B1520]/90 hover:bg-[#0E1B29] text-[#F2F4F5] border border-white/10 rounded-sm backdrop-blur-md transition-all duration-200 shadow-xl"
        title="Toggle Map Layers"
      >
        <span className="text-xs text-[#38bdf8] leading-none">☷</span>
        <span className="text-[11px] tracking-[0.16em] uppercase font-medium">LAYERS</span>
      </button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="mt-2.5 w-52 bg-[#0B1520]/95 backdrop-blur-md border border-white/10 rounded-sm p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
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

            <div className="space-y-2.5">
              {layerItems.map((item) => {
                const isActive = layers[item.key];
                return (
                  <button
                    key={item.key}
                    onClick={() => onToggleLayer(item.key)}
                    className="w-full flex items-center justify-between py-1 text-left group transition-colors"
                  >
                    <span
                      className={`text-xs tracking-wide transition-colors ${
                        isActive ? 'text-[#F2F4F5]' : 'text-[#82909B] group-hover:text-[#F2F4F5]'
                      }`}
                    >
                      {item.label}
                    </span>
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
