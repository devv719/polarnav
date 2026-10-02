import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Crosshair, Navigation } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function LocationInfoPanel({
  selectedObject,
  onClose,
  onZoomTo,
  onSetDestination
}) {
  if (!selectedObject) return null;

  const { type, data } = selectedObject;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-0 right-0 bottom-0 z-[1001] w-84 max-w-full max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:w-full max-md:max-h-[65vh] bg-[#FFFFFF]/98 backdrop-blur-md border-l max-md:border-l-0 max-md:border-t border-[#CCE0F0] p-6 flex flex-col justify-between select-none font-sans shadow-xl overflow-y-auto"
      >
        <div className="space-y-5">
          {/* Header Tag + Close Icon */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#68869E] font-bold">
              {type === 'station'
                ? 'ANTARCTIC FACILITY'
                : type === 'vessel'
                ? 'RESEARCH VESSEL'
                : type === 'iceberg'
                ? 'ICE HAZARD'
                : type === 'route'
                ? 'NAVIGATION ROUTE'
                : 'COORDINATE'}
            </span>
            <button
              onClick={onClose}
              className="text-xs text-[#68869E] hover:text-[#1E3A52] transition-colors p-1 leading-none rounded hover:bg-[#F4F8FB]"
              title="Close Panel"
            >
              ✕
            </button>
          </div>

          <div className="h-[1px] bg-[#CCE0F0]" />

          {/* 1. STATION / FACILITY INTELLIGENCE */}
          {type === 'station' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-display text-[#0F2130] tracking-tight">
                  {data.name}
                </h2>
                {data.officialName && data.officialName !== data.name && (
                  <p className="text-xs text-[#68869E] mt-0.5 font-sans italic">
                    {data.officialName}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-mono text-[#3385C6] uppercase tracking-wider font-bold">
                    {data.country || data.operatorPrimary}
                  </span>
                  <span className="text-[#CCE0F0]">•</span>
                  <span className="text-xs font-mono text-[#68869E]">
                    {data.type || 'Station'}
                  </span>
                </div>
              </div>

              {/* Status & Seasonality */}
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {data.seasonality && (
                  <span className="px-2 py-0.5 rounded-sm bg-[#E8F3FA] text-[#3385C6] border border-[#CCE0F0] uppercase font-semibold">
                    {data.seasonality}
                  </span>
                )}
                {data.status && (
                  <span
                    className={`px-2 py-0.5 rounded-sm border uppercase font-semibold ${
                      data.status.toLowerCase().includes('open')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {data.status}
                  </span>
                )}
              </div>

              {/* Coordinates */}
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                  Location
                </div>
                <div className="text-sm font-mono text-[#1E3A52] mt-1 space-y-0.5 font-medium">
                  <div>
                    {formatCoordinates(data.coordinates?.[0] || data.latitude, data.coordinates?.[1] || data.longitude)}
                  </div>
                  {(data.latitudeDDM || data.longitudeDDM) && (
                    <div className="text-[10px] text-[#68869E]">
                      {data.latitudeDDM} {data.longitudeDDM}
                    </div>
                  )}
                  {data.region && (
                    <div className="text-[10px] text-[#68869E]">
                      Region: {data.region}
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-1 border-t border-[#CCE0F0]">
                {data.elevation !== null && data.elevation !== undefined && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-semibold">Elevation</div>
                    <div className="text-xs font-semibold text-[#1E3A52] mt-0.5">
                      {data.elevation} m {data.elevationDatum ? `(${data.elevationDatum})` : ''}
                    </div>
                  </div>
                )}
                {data.peakPopulation !== null && data.peakPopulation !== undefined && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-semibold">Peak Population</div>
                    <div className="text-xs font-semibold text-[#1E3A52] mt-0.5">
                      {data.peakPopulation} persons
                    </div>
                  </div>
                )}
                {data.yearEstablished && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-semibold">Established</div>
                    <div className="text-xs font-semibold text-[#1E3A52] mt-0.5">
                      {data.yearEstablished}
                    </div>
                  </div>
                )}
                {data.powerSupply && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-semibold">Power Supply</div>
                    <div className="text-xs font-semibold text-[#1E3A52] mt-0.5 truncate" title={data.powerSupply}>
                      {data.powerSupply}
                    </div>
                  </div>
                )}
              </div>

              {/* Photo / Webcam External Links if present */}
              {(data.photoUrl || data.webcamUrl) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {data.photoUrl && (
                    <a
                      href={data.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-[#3385C6] hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" /> Photo Source
                    </a>
                  )}
                  {data.webcamUrl && (
                    <a
                      href={data.webcamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" /> Live Webcam
                    </a>
                  )}
                </div>
              )}

              {/* Actions: Zoom to Station */}
              <div className="pt-2 space-y-2">
                {onZoomTo && (
                  <button
                    onClick={() => onZoomTo(data.coordinates || [data.latitude, data.longitude])}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#3385C6] hover:bg-[#246699] text-white rounded-sm text-xs font-mono uppercase tracking-wider transition-colors font-bold shadow-xs"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    Zoom To Facility
                  </button>
                )}
                {onSetDestination && (
                  <button
                    onClick={() => onSetDestination(data)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#F4F8FB] hover:bg-[#E8F3FA] text-[#1E3A52] hover:text-[#0F2130] border border-[#CCE0F0] rounded-sm text-[11px] font-mono uppercase tracking-wider transition-colors font-semibold"
                  >
                    <Navigation className="w-3 h-3 text-[#3385C6]" />
                    Set Nav Target
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 2. VESSEL */}
          {type === 'vessel' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-display text-[#0F2130] tracking-tight">
                  {data.name}
                </h2>
                <p className="text-xs text-[#68869E] mt-1 font-mono">
                  {data.iceClass || 'Research vessel'}
                </p>
              </div>

              <div className="space-y-1 font-mono text-sm">
                <div className="text-[#1E3A52] font-semibold">
                  {formatCoordinates(data.coordinates?.[0] || data.latitude, data.coordinates?.[1] || data.longitude)}
                </div>
                <div className="text-[#3385C6] font-bold text-xs">
                  {data.speedKnots} KT • HDG {data.heading}°
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                  Destination
                </div>
                <div className="text-sm font-semibold text-[#0F2130] mt-1">
                  {data.destination || 'BHARATI STATION'}
                </div>
              </div>
            </div>
          )}

          {/* 3. ICEBERG */}
          {type === 'iceberg' && (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                  ICEBERG
                </div>
                <h2 className="text-xl font-bold font-display text-[#0F2130] tracking-tight mt-0.5">
                  {data.id}
                </h2>
                <p className="text-xs text-[#68869E] mt-1 font-mono">
                  {data.type || 'Tabular Iceberg'}
                </p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                  POSITION
                </div>
                <div className="font-mono text-sm text-[#1E3A52] mt-1 font-semibold">
                  {formatCoordinates(data.latitude || data.coordinates?.[0], data.longitude || data.coordinates?.[1])}
                </div>
                <div className="text-xs text-[#68869E] font-mono mt-0.5">
                  Observed {data.lastObserved || '2h ago'}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                  RISK ASSESSMENT
                </div>
                <div className="text-sm font-semibold text-[#1E3A52] mt-1 flex items-center gap-2 font-mono">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      data.riskScore === 'CRITICAL' || data.riskScore === 'EXTREME'
                        ? 'bg-rose-500'
                        : data.riskScore === 'HIGH'
                        ? 'bg-amber-500'
                        : 'bg-[#3385C6]'
                    }`}
                  />
                  <span>{data.riskScore || 'Moderate'} Risk</span>
                </div>
              </div>

              {data.lengthKm && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                    DIMENSIONS
                  </div>
                  <div className="text-xs font-mono text-[#1E3A52] mt-1 font-semibold">
                    {data.lengthKm} × {data.widthKm} km
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. ROUTE */}
          {type === 'route' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold font-display text-[#0F2130] tracking-tight">
                  {data.name || 'RECOMMENDED ROUTE'}
                </h2>
                <p className="text-xs text-[#68869E] mt-1 font-mono">
                  {data.isRecommended ? 'AI Optimal Polar Path' : 'Direct Corridor'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-semibold">Distance</div>
                  <div className="text-sm font-bold text-[#1E3A52] mt-0.5">{data.totalDistanceNM} NM</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-semibold">Est. Time</div>
                  <div className="text-sm font-bold text-[#3385C6] mt-0.5">{data.estimatedTimeHours} H</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                  Ice Risk Level
                </div>
                <div className="text-sm font-bold text-[#1E3A52] mt-1 font-mono">
                  {data.riskCategory ? data.riskCategory.toUpperCase() : 'LOW RISK'}
                </div>
              </div>

              {data.estimatedFuelMT && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                    Fuel Consumption
                  </div>
                  <div className="text-xs font-mono text-[#68869E] mt-1 font-semibold">
                    {data.estimatedFuelMT} MT
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. COORDINATE PROBE */}
          {type === 'coordinate' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold font-display text-[#0F2130] tracking-tight">
                  PROBED SECTOR
                </h2>
                <p className="text-xs text-[#68869E] mt-1 font-mono">
                  {data.name || 'Antarctic Waters'}
                </p>
              </div>

              <div className="font-mono text-sm text-[#1E3A52] font-semibold">
                {formatCoordinates(data.coordinates?.[0] || data.latitude, data.coordinates?.[1] || data.longitude)}
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#68869E]">
                  <span>Sea Ice:</span>
                  <span className="text-[#1E3A52] font-semibold">{data.seaIceConcentration || 0}%</span>
                </div>
                <div className="flex justify-between text-[#68869E]">
                  <span>Temperature:</span>
                  <span className="text-[#1E3A52] font-semibold">{data.temperature || -10}°C</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clean Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 mt-6 bg-[#F4F8FB] hover:bg-[#E8F3FA] border border-[#CCE0F0] text-xs font-mono uppercase tracking-[0.16em] text-[#1E3A52] rounded-sm transition-colors font-semibold"
        >
          Close
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
