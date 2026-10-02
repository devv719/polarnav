import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Navigation,
  ArrowRight,
  Route as RouteIcon,
  Wind,
  Thermometer,
  Waves,
  Eye,
  Clock,
  Fuel,
  ChevronDown,
  ChevronUp,
  Compass,
  Shield,
  AlertCircle,
  CheckCircle,
  MapPin,
  Activity
} from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';
import { analyzeRouteHazards, estimateRouteEnvironment } from '../../utils/routeAnalysis';

function riskClass(level) {
  const l = (level || '').toUpperCase();
  if (l === 'CRITICAL' || l === 'EXTREME') return 'text-rose-700 bg-rose-50 border-rose-200';
  if (l === 'HIGH') return 'text-amber-700 bg-amber-50 border-amber-200';
  if (l === 'MODERATE') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-emerald-700 bg-emerald-50 border-emerald-200';
}

function riskDot(level) {
  const l = (level || '').toUpperCase();
  if (l === 'CRITICAL' || l === 'EXTREME') return 'bg-rose-600';
  if (l === 'HIGH') return 'bg-amber-500';
  if (l === 'MODERATE') return 'bg-yellow-500';
  return 'bg-emerald-500';
}

function SectionLabel({ children }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.2em] text-[#68869E] font-mono font-bold">
      {children}
    </div>
  );
}

function MetricCell({ label, value, unit, accent }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
        {label}
      </div>
      <div className={`text-sm font-bold font-mono mt-0.5 ${accent ? 'text-[#3385C6]' : 'text-[#0F2130]'}`}>
        {value}
        {unit && <span className="text-[10px] font-normal text-[#68869E] ml-0.5">{unit}</span>}
      </div>
    </div>
  );
}

function RouteCard({ route, isActive, onSelect }) {
  if (!route) return null;
  const isRecommended = route.isRecommended;
  return (
    <button
      onClick={() => onSelect(route)}
      className={`w-full text-left p-3 rounded-sm border transition-all font-sans ${
        isActive
          ? isRecommended
            ? 'bg-[#E8F3FA] border-[#3385C6] shadow-xs'
            : 'bg-amber-50 border-amber-300 shadow-xs'
          : 'bg-[#F4F8FB] border-[#CCE0F0] hover:border-[#3385C6]/60 hover:bg-[#EFF6FB]'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRecommended ? 'bg-[#3385C6]' : 'bg-amber-400'}`} />
          <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-[#68869E]">
            {isRecommended ? 'Route 01 — RECOMMENDED' : 'Route 02 — DIRECT'}
          </span>
        </div>
        {isActive && (
          <span className="text-[9px] font-mono font-bold text-[#3385C6] uppercase tracking-wider">
            ACTIVE
          </span>
        )}
      </div>
      <div className="text-xs font-sans font-semibold text-[#0F2130] mb-2 leading-tight">
        {route.name}
      </div>
      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
        <div>
          <div className="text-[9px] text-[#68869E] uppercase tracking-wider">Distance</div>
          <div className="font-bold text-[#1E3A52]">{route.totalDistanceNM}<span className="font-normal text-[#68869E]"> NM</span></div>
        </div>
        <div>
          <div className="text-[9px] text-[#68869E] uppercase tracking-wider">ETA</div>
          <div className="font-bold text-[#1E3A52]">{route.estimatedTimeHours}<span className="font-normal text-[#68869E]"> H</span></div>
        </div>
        <div>
          <div className="text-[9px] text-[#68869E] uppercase tracking-wider">Fuel</div>
          <div className="font-bold text-[#1E3A52]">{route.estimatedFuelMT}<span className="font-normal text-[#68869E]"> MT</span></div>
        </div>
      </div>
      <div className="mt-2">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold border uppercase tracking-wider ${
          route.riskCategory?.includes('LOW') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${route.riskCategory?.includes('LOW') ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          {route.riskCategory?.replace('_', ' ') || 'ASSESSED'}
        </span>
      </div>
    </button>
  );
}

function IcebergHazardRow({ iceberg, isExpanded, onToggle, onSelectIceberg }) {
  const risk = iceberg.routeRisk || iceberg.riskScore || 'MODERATE';
  return (
    <div className="border border-[#CCE0F0] rounded-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 hover:bg-[#F4F8FB] transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${riskDot(risk)}`} />
          <div>
            <div className="text-xs font-mono font-bold text-[#0F2130]">{iceberg.id}</div>
            <div className="text-[10px] font-sans text-[#68869E] mt-0.5">{iceberg.type || 'Tabular Iceberg'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-1">
            <span className={`inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold border uppercase tracking-wider ${riskClass(risk)}`}>
              {risk}
            </span>
            {iceberg.routeDistanceNM != null && (
              <div className="text-[9px] font-mono text-[#68869E] mt-0.5">
                {iceberg.routeDistanceNM} NM off route
              </div>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 bg-[#F4F8FB] border-t border-[#CCE0F0] space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[11px]">
                <div>
                  <span className="text-[#68869E]">Position: </span>
                  <span className="text-[#1E3A52] font-semibold">
                    {formatCoordinates(iceberg.latitude ?? iceberg.coordinates?.[0], iceberg.longitude ?? iceberg.coordinates?.[1])}
                  </span>
                </div>
                {iceberg.lengthKm && (
                  <div>
                    <span className="text-[#68869E]">Size: </span>
                    <span className="text-[#1E3A52] font-semibold">{iceberg.lengthKm}x{iceberg.widthKm} km</span>
                  </div>
                )}
                {iceberg.driftSpeedKnots && (
                  <div>
                    <span className="text-[#68869E]">Drift: </span>
                    <span className="text-[#1E3A52] font-semibold">{iceberg.driftSpeedKnots} kts @ {iceberg.driftHeading}T</span>
                  </div>
                )}
                {iceberg.hazardRadiusNM && (
                  <div>
                    <span className="text-[#68869E]">Hazard R: </span>
                    <span className="text-[#1E3A52] font-semibold">{iceberg.hazardRadiusNM} NM</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onSelectIceberg && onSelectIceberg(iceberg)}
                className="w-full text-center text-[10px] font-mono font-bold text-[#3385C6] hover:text-[#246699] py-1 border border-[#CCE0F0] hover:border-[#3385C6] rounded-sm bg-white transition-colors"
              >
                Run Drift and Melt Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NavigationPlanningPanel({
  destination,
  vessel,
  routes,
  icebergs,
  onClose,
  onSelectIceberg,
  onSetActiveRoute,
  activeRouteType = 'recommended'
}) {
  const [selectedRouteType, setSelectedRouteType] = useState(activeRouteType);
  const [expandedIceberg, setExpandedIceberg] = useState(null);
  const [showRationale, setShowRationale] = useState(false);

  useEffect(() => {
    setSelectedRouteType(activeRouteType);
  }, [activeRouteType]);

  const activeRoute = selectedRouteType === 'recommended' ? routes?.recommended : routes?.alternative;

  const routeHazards = useMemo(() => {
    if (!activeRoute?.waypoints) return [];
    return analyzeRouteHazards(icebergs, activeRoute.waypoints);
  }, [icebergs, activeRoute]);

  const routeEnv = useMemo(() => {
    if (!activeRoute?.waypoints) return null;
    return estimateRouteEnvironment(activeRoute.waypoints, vessel);
  }, [activeRoute, vessel]);

  const handleSelectRoute = (route) => {
    const type = route.isRecommended ? 'recommended' : 'alternative';
    setSelectedRouteType(type);
    if (onSetActiveRoute) onSetActiveRoute(route);
  };

  const criticalHazards = routeHazards.filter(b => b.routeRisk === 'CRITICAL');
  const highHazards = routeHazards.filter(b => b.routeRisk === 'HIGH');
  const closeHazards = routeHazards.filter(b => b.routeRisk !== 'LOW' && b.routeRisk !== 'UNKNOWN');

  const overallRisk = criticalHazards.length > 0 ? 'CRITICAL' :
    highHazards.length > 0 ? 'HIGH' :
    closeHazards.length > 0 ? 'MODERATE' : 'LOW';

  if (!destination) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 32 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 right-0 bottom-0 z-[1001] w-[420px] max-w-full bg-[#FFFFFF] border-l border-[#CCE0F0] flex flex-col select-none font-sans overflow-hidden shadow-2xl max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:w-full max-md:max-h-[85vh] max-md:border-l-0 max-md:border-t"
      >
        {/* PANEL HEADER */}
        <div className="px-5 pt-5 pb-4 border-b border-[#CCE0F0] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-[#E8F3FA] text-[#3385C6]">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#68869E] font-bold">
                NAVIGATION PLANNING
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#68869E] hover:text-[#0F2130] rounded hover:bg-[#F4F8FB] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* FROM > TO route header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-mono font-semibold mb-0.5">FROM</div>
              <div className="text-xs font-bold text-[#0F2130] font-sans truncate">{vessel?.name || 'ORV Sagar Nidhi'}</div>
              <div className="text-[10px] font-mono text-[#68869E]">
                {formatCoordinates(vessel?.coordinates?.[0] ?? vessel?.latitude, vessel?.coordinates?.[1] ?? vessel?.longitude)}
              </div>
            </div>
            <div className="shrink-0 text-[#3385C6]">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-mono font-semibold mb-0.5">DESTINATION</div>
              <div className="text-xs font-bold text-[#0F2130] font-sans truncate">{destination.name}</div>
              <div className="text-[10px] font-mono text-[#68869E]">
                {formatCoordinates(
                  destination.coordinates?.[0] ?? destination.latitude,
                  destination.coordinates?.[1] ?? destination.longitude
                )}
              </div>
            </div>
          </div>

          {/* Overall assessment badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-mono font-bold ${riskClass(overallRisk)}`}>
            <span className={`w-2 h-2 rounded-full ${riskDot(overallRisk)}`} />
            <span>ROUTE ASSESSMENT: {overallRisk}</span>
            {criticalHazards.length > 0 && (
              <span className="ml-auto text-[10px] font-normal">
                {criticalHazards.length} CRITICAL HAZARD{criticalHazards.length !== 1 ? 'S' : ''}
              </span>
            )}
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-5">

          {/* ROUTE SELECTION */}
          <div className="space-y-2">
            <SectionLabel>Route Options</SectionLabel>
            <div className="space-y-2">
              <RouteCard
                route={routes?.recommended}
                isActive={selectedRouteType === 'recommended'}
                onSelect={handleSelectRoute}
              />
              <RouteCard
                route={routes?.alternative}
                isActive={selectedRouteType === 'alternative'}
                onSelect={handleSelectRoute}
              />
            </div>

            {activeRoute?.decisionRationale && (
              <div>
                <button
                  onClick={() => setShowRationale(r => !r)}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-[#3385C6] hover:text-[#246699] transition-colors"
                >
                  {showRationale ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Route Decision Rationale
                </button>
                <AnimatePresence>
                  {showRationale && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 text-[11px] text-[#1E3A52] leading-relaxed bg-[#F4F8FB] border border-[#CCE0F0] rounded-sm p-2.5 font-sans">
                        {activeRoute.decisionRationale}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ROUTE METRICS */}
          {activeRoute && (
            <div className="space-y-2">
              <SectionLabel>Route Metrics</SectionLabel>
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F4F8FB] border border-[#CCE0F0] rounded-sm">
                <div className="flex items-center gap-2">
                  <RouteIcon className="w-3.5 h-3.5 text-[#3385C6] shrink-0" />
                  <MetricCell label="Distance" value={activeRoute.totalDistanceNM} unit="NM" accent />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
                  <MetricCell label="ETA" value={activeRoute.estimatedTimeHours} unit="H" />
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
                  <MetricCell label="Fuel" value={activeRoute.estimatedFuelMT} unit="MT" />
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
                  <MetricCell
                    label="Ice Risk"
                    value={activeRoute.riskCategory?.replace('_RISK', '') || 'LOW'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ENVIRONMENTAL CONDITIONS */}
          {routeEnv && (
            <div className="space-y-2">
              <SectionLabel>Environmental Exposure</SectionLabel>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 p-3 bg-[#F4F8FB] border border-[#CCE0F0] rounded-sm">
                <div className="flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
                  <MetricCell label="Wind" value={routeEnv.estimatedWindKnots} unit="kts" />
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
                  <MetricCell label="Swell" value={routeEnv.estimatedWaveHeightM} unit="m" />
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
                  <MetricCell label="Temp" value={routeEnv.estimatedTempC} unit="C" />
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-[#68869E] shrink-0" />
                  <MetricCell label="Visibility" value={routeEnv.visibilityNM} unit="NM" />
                </div>
              </div>
              <div className="p-3 bg-[#F4F8FB] border border-[#CCE0F0] rounded-sm space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-[#68869E]">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3" />
                    Sea Ice Concentration
                  </span>
                  <span className="font-bold text-[#1E3A52]">{routeEnv.avgSeaIceConcentration}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#CCE0F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${routeEnv.avgSeaIceConcentration}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      routeEnv.avgSeaIceConcentration > 70 ? 'bg-rose-500' :
                      routeEnv.avgSeaIceConcentration > 40 ? 'bg-amber-400' : 'bg-[#3385C6]'
                    }`}
                  />
                </div>
                <div className="text-[9px] font-mono text-[#68869E] uppercase tracking-wider">
                  {routeEnv.polarCodeRequirement}
                </div>
              </div>
            </div>
          )}

          {/* ICEBERG HAZARD ASSESSMENT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <SectionLabel>Iceberg Hazards Along Route</SectionLabel>
              {routeHazards.length > 0 && (
                <span className="text-[9px] font-mono text-[#68869E]">
                  {routeHazards.filter(b => b.routeRisk !== 'LOW').length} within alert radius
                </span>
              )}
            </div>

            {routeHazards.length === 0 ? (
              <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs font-sans text-emerald-800">
                  No tracked icebergs within hazard range of this route.
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex gap-2 mb-2 flex-wrap">
                  {criticalHazards.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      {criticalHazards.length} CRITICAL
                    </span>
                  )}
                  {highHazards.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {highHazards.length} HIGH
                    </span>
                  )}
                  {routeHazards.filter(b => b.routeRisk === 'MODERATE').length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      {routeHazards.filter(b => b.routeRisk === 'MODERATE').length} MOD
                    </span>
                  )}
                </div>

                {routeHazards.map((berg) => (
                  <IcebergHazardRow
                    key={berg.id}
                    iceberg={berg}
                    isExpanded={expandedIceberg === berg.id}
                    onToggle={() => setExpandedIceberg(expandedIceberg === berg.id ? null : berg.id)}
                    onSelectIceberg={onSelectIceberg}
                  />
                ))}
              </div>
            )}
          </div>

          {/* TACTICAL ADVISORY */}
          {criticalHazards.length > 0 && (
            <div className="space-y-1.5">
              <SectionLabel>Tactical Advisory</SectionLabel>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs font-sans text-rose-900 leading-relaxed">
                    <strong>{criticalHazards.length} iceberg{criticalHazards.length !== 1 ? 's' : ''}</strong> within
                    5 NM of the selected route corridor. Immediate route alteration or enhanced watch is required.
                    Execute drift and melt analysis on each CRITICAL target before departure.
                  </div>
                </div>
                <div className="text-[10px] font-mono text-rose-700 border-t border-rose-200 pt-2">
                  RECOMMENDATION: Consider Route 01 (AI Recommended Low-Ice Corridor) or execute a 15+ degree starboard
                  course alteration to establish CPA greater than 3.5 NM from each tracked hazard.
                </div>
              </div>
            </div>
          )}

          {/* DESTINATION FACILITY INFO */}
          <div className="space-y-2">
            <SectionLabel>Destination Facility</SectionLabel>
            <div className="p-3 bg-[#F4F8FB] border border-[#CCE0F0] rounded-sm space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#3385C6] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#0F2130] font-sans">{destination.name}</div>
                  {destination.officialName && destination.officialName !== destination.name && (
                    <div className="text-[10px] text-[#68869E] italic">{destination.officialName}</div>
                  )}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] font-mono text-[#3385C6] font-semibold">{destination.country || destination.operatorPrimary}</span>
                    {destination.type && (
                      <>
                        <span className="text-[#CCE0F0]">&#xB7;</span>
                        <span className="text-[10px] font-mono text-[#68869E]">{destination.type}</span>
                      </>
                    )}
                    {destination.seasonality && (
                      <>
                        <span className="text-[#CCE0F0]">&#xB7;</span>
                        <span className="text-[10px] font-mono text-[#68869E]">{destination.seasonality}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#CCE0F0] text-[10px] font-mono">
                <div className="text-[#68869E]">
                  Coordinates:&nbsp;
                  <span className="text-[#1E3A52] font-semibold">
                    {formatCoordinates(
                      destination.coordinates?.[0] ?? destination.latitude,
                      destination.coordinates?.[1] ?? destination.longitude
                    )}
                  </span>
                </div>
                {destination.elevation != null && (
                  <div className="text-[#68869E]">
                    Elevation:&nbsp;<span className="text-[#1E3A52] font-semibold">{destination.elevation} m</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL FOOTER */}
        <div className="px-5 py-4 border-t border-[#CCE0F0] bg-[#F4F8FB] shrink-0 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#68869E] mb-1">
            <span>Active: <span className="font-bold text-[#1E3A52]">{activeRoute?.name || '—'}</span></span>
            <span>{activeRoute?.totalDistanceNM} NM&#xB7;{activeRoute?.estimatedTimeHours}H&#xB7;{activeRoute?.estimatedFuelMT}MT</span>
          </div>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#3385C6] hover:bg-[#246699] text-white text-xs font-mono uppercase tracking-widest font-bold transition-colors rounded-sm shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            Confirm Navigation Target
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-[10px] font-mono text-[#68869E] hover:text-[#1E3A52] transition-colors"
          >
            Cancel Planning
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
