import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Map, 
  Globe, 
  Layers, 
  TriangleAlert, 
  Ship, 
  Navigation, 
  Route as RouteIcon, 
  ShieldAlert, 
  Building2, 
  Thermometer, 
  Wind,
  Binary
} from 'lucide-react';

export default function LayersPanel({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
  baseLayer = 'satellite',
  setBaseLayer
}) {
  if (!isOpen) return null;

  const basemaps = [
    { id: 'satellite', label: 'Satellite' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'topo', label: 'Terrain' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="absolute top-14 left-0 w-80 md:w-88 bg-[#FFFFFF] border border-[#CCE0F0] rounded-sm shadow-xl p-5 space-y-5 text-xs font-sans z-[1100] max-h-[75vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#CCE0F0]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#3385C6]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F2130] font-sans">
              GIS LAYER CONTROLS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#68869E] hover:text-[#0F2130] rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. BASE MAP */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold block">
            BASE MAP
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {basemaps.map((b) => (
              <button
                key={b.id}
                onClick={() => setBaseLayer(b.id)}
                className={`py-1.5 px-2 text-xs rounded-sm transition-all border text-center font-medium ${
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

        {/* 2. ENVIRONMENT LAYERS */}
        <div className="space-y-1.5 pt-1 border-t border-[#CCE0F0]">
          <label className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold block mb-2 pt-2">
            ENVIRONMENT & REMOTE SENSING
          </label>

          <LayerRow
            label="Sea Ice Concentration"
            desc="Multi-sensor satellite SIC grid"
            icon={Layers}
            active={layers.seaIceConcentration}
            onToggle={() => onToggleLayer('seaIceConcentration')}
            accentColor="#3385C6"
          />

          <LayerRow
            label="NASA GIBS Satellite"
            desc="Daily MODIS True Color 250m"
            icon={Globe}
            active={layers.nasaGibs}
            onToggle={() => onToggleLayer('nasaGibs')}
            accentColor="#3385C6"
          />

          <LayerRow
            label="Iceberg Observations"
            desc="Sentinel-1 SAR tracked ice targets"
            icon={TriangleAlert}
            active={layers.icebergs}
            onToggle={() => onToggleLayer('icebergs')}
            accentColor="#e11d48"
          />

          <LayerRow
            label="Surface Temperature"
            desc="Southern Ocean isotherms"
            icon={Thermometer}
            active={layers.temperatureLayer}
            onToggle={() => onToggleLayer('temperatureLayer')}
            accentColor="#0284c7"
          />

          <LayerRow
            label="Katabatic Wind Streamlines"
            desc="Antarctic wind drift vectors"
            icon={Wind}
            active={layers.weatherVectors}
            onToggle={() => onToggleLayer('weatherVectors')}
            accentColor="#0d9488"
          />
        </div>

        {/* 3. NAVIGATION LAYERS */}
        <div className="space-y-1.5 pt-1 border-t border-[#CCE0F0]">
          <label className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold block mb-2 pt-2">
            TACTICAL NAVIGATION
          </label>

          <LayerRow
            label="Research Vessel"
            desc="ORV Sagar Nidhi / Expedition Fleet"
            icon={Ship}
            active={layers.vessel}
            onToggle={() => onToggleLayer('vessel')}
            accentColor="#3385C6"
          />

          <LayerRow
            label="Recommended Route"
            desc="AI optimal low-resistance polar path"
            icon={Navigation}
            active={layers.recommendedRoute}
            onToggle={() => onToggleLayer('recommendedRoute')}
            accentColor="#059669"
          />

          <LayerRow
            label="Alternative Route"
            desc="Direct conventional corridor"
            icon={RouteIcon}
            active={layers.alternativeRoute}
            onToggle={() => onToggleLayer('alternativeRoute')}
            accentColor="#d97706"
          />

          <LayerRow
            label="Polar Risk Zones"
            desc="Consolidated pack & convergence"
            icon={ShieldAlert}
            active={layers.riskZones}
            onToggle={() => onToggleLayer('riskZones')}
            accentColor="#ea580c"
          />

          <LayerRow
            label="Antarctic Stations"
            desc="COMNAP research facilities"
            icon={Building2}
            active={layers.stations}
            onToggle={() => onToggleLayer('stations')}
            accentColor="#1E3A52"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function LayerRow({ label, desc, icon: Icon, active, onToggle, accentColor = '#3385C6' }) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center justify-between p-2 rounded-sm cursor-pointer transition-colors border ${
        active 
          ? 'bg-[#F4F8FB] border-[#CCE0F0]' 
          : 'border-transparent hover:bg-[#F4F8FB] hover:border-[#CCE0F0]/50'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <div 
          className="p-1 rounded-sm shrink-0"
          style={{ 
            color: active ? accentColor : '#68869E',
            backgroundColor: active ? `${accentColor}15` : 'transparent' 
          }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className={`text-xs truncate font-medium ${active ? 'text-[#0F2130] font-semibold' : 'text-[#68869E]'}`}>
            {label}
          </div>
          {desc && (
            <div className="text-[10px] text-[#68869E] truncate">
              {desc}
            </div>
          )}
        </div>
      </div>

      {/* Clean Switch Toggle */}
      <div
        className={`w-7 h-4 rounded-full transition-colors relative shrink-0 ${
          active ? 'bg-[#3385C6]' : 'bg-[#CCE0F0]'
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform duration-150 ${
            active ? 'left-3.5' : 'left-0.5'
          }`}
        />
      </div>
    </div>
  );
}
