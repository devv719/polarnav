import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCoordinates } from '../../utils/formatters';

export default function LocationInfoPanel({ selectedObject, onClose }) {
  if (!selectedObject) return null;

  const { type, data } = selectedObject;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-0 right-0 bottom-0 z-[1001] w-80 max-w-[320px] bg-[#0B1520]/95 backdrop-blur-md border-l border-white/[0.08] p-6 flex flex-col justify-between select-none font-sans shadow-2xl"
      >
        <div className="space-y-6">
          {/* Header Tag + Close Icon */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#82909B]">
              {type === 'vessel'
                ? 'RESEARCH VESSEL'
                : type === 'iceberg'
                ? 'ICE HAZARD'
                : type === 'route'
                ? 'NAVIGATION ROUTE'
                : type === 'station'
                ? 'POLAR STATION'
                : 'COORDINATE'}
            </span>
            <button
              onClick={onClose}
              className="text-xs text-[#82909B] hover:text-[#F2F4F5] transition-colors p-1"
              title="Close Panel"
            >
              ✕
            </button>
          </div>

          <div className="h-[1px] bg-white/[0.08]" />

          {/* Type-Specific Content */}
          {type === 'vessel' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-display text-[#F2F4F5] tracking-tight">
                  {data.name}
                </h2>
                <p className="text-xs text-[#82909B] mt-1 font-mono">
                  {data.iceClass || 'Research vessel'}
                </p>
              </div>

              <div className="space-y-1 font-mono text-sm">
                <div className="text-[#F2F4F5]">
                  {formatCoordinates(data.coordinates?.[0] || data.latitude, data.coordinates?.[1] || data.longitude)}
                </div>
                <div className="text-[#38bdf8] font-medium">
                  {data.speedKnots} KT • HDG {data.heading}°
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#82909B] font-mono">
                  Destination
                </div>
                <div className="text-sm font-medium text-[#F2F4F5] mt-1">
                  {data.destination || 'BHARATI STATION'}
                </div>
              </div>
            </div>
          )}

          {type === 'iceberg' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-display text-[#F2F4F5] tracking-tight">
                  {data.id}
                </h2>
                <p className="text-xs text-[#82909B] mt-1 font-mono">
                  {data.type || 'Tabular Iceberg'}
                </p>
              </div>

              <div className="space-y-1 font-mono text-sm text-[#F2F4F5]">
                <div>{formatCoordinates(data.latitude || data.coordinates?.[0], data.longitude || data.coordinates?.[1])}</div>
                <div className="text-xs text-[#82909B]">
                  Observed {data.lastObserved || '2h ago'}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#82909B] font-mono">
                  Risk Assessment
                </div>
                <div className="text-sm font-medium text-[#F2F4F5] mt-1 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      data.riskScore === 'CRITICAL' || data.riskScore === 'EXTREME'
                        ? 'bg-rose-500'
                        : data.riskScore === 'HIGH'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span>{data.riskScore || 'Moderate'} Risk</span>
                </div>
              </div>

              {data.lengthKm && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#82909B] font-mono">
                    Dimensions
                  </div>
                  <div className="text-xs font-mono text-[#F2F4F5] mt-1">
                    {data.lengthKm} × {data.widthKm} km
                  </div>
                </div>
              )}
            </div>
          )}

          {type === 'route' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold font-display text-[#F2F4F5] tracking-tight">
                  {data.name || 'RECOMMENDED ROUTE'}
                </h2>
                <p className="text-xs text-[#82909B] mt-1 font-mono">
                  {data.isRecommended ? 'AI Optimal Polar Path' : 'Direct Corridor'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#82909B]">Distance</div>
                  <div className="text-sm font-medium text-[#F2F4F5] mt-0.5">{data.totalDistanceNM} NM</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#82909B]">Est. Time</div>
                  <div className="text-sm font-medium text-[#38bdf8] mt-0.5">{data.estimatedTimeHours} H</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#82909B] font-mono">
                  Ice Risk Level
                </div>
                <div className="text-sm font-medium text-[#F2F4F5] mt-1">
                  {data.riskCategory ? data.riskCategory.toUpperCase() : 'LOW RISK'}
                </div>
              </div>

              {data.estimatedFuelMT && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#82909B] font-mono">
                    Fuel Consumption
                  </div>
                  <div className="text-xs font-mono text-[#82909B] mt-1">
                    {data.estimatedFuelMT} MT
                  </div>
                </div>
              )}
            </div>
          )}

          {type === 'station' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-display text-[#F2F4F5] tracking-tight">
                  {data.name}
                </h2>
                <p className="text-xs text-[#82909B] mt-1 font-mono">
                  {data.operator}
                </p>
              </div>

              <div className="space-y-1 font-mono text-sm text-[#F2F4F5]">
                <div>{formatCoordinates(data.coordinates?.[0], data.coordinates?.[1])}</div>
                <div className="text-xs text-[#38bdf8]">
                  Sector: {data.sector || 'Prydz Bay'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#82909B]">Temperature</div>
                  <div className="text-sm font-medium text-[#F2F4F5] mt-0.5">{data.currentTemp}°C</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#82909B]">Wind</div>
                  <div className="text-sm font-medium text-[#F2F4F5] mt-0.5">{data.windSpeed} kts</div>
                </div>
              </div>
            </div>
          )}

          {type === 'coordinate' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold font-display text-[#F2F4F5] tracking-tight">
                  PROBED SECTOR
                </h2>
                <p className="text-xs text-[#82909B] mt-1 font-mono">
                  {data.name || 'Antarctic Waters'}
                </p>
              </div>

              <div className="font-mono text-sm text-[#F2F4F5]">
                {formatCoordinates(data.coordinates?.[0] || data.latitude, data.coordinates?.[1] || data.longitude)}
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#82909B]">
                  <span>Sea Ice:</span>
                  <span className="text-[#F2F4F5]">{data.seaIceConcentration || 0}%</span>
                </div>
                <div className="flex justify-between text-[#82909B]">
                  <span>Temperature:</span>
                  <span className="text-[#F2F4F5]">{data.temperature || -10}°C</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Clean Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 mt-6 bg-transparent hover:bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.16em] text-[#82909B] hover:text-[#F2F4F5] rounded-sm transition-colors"
        >
          Close
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
