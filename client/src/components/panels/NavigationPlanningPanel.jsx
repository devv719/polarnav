import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronDown, Navigation, Anchor, Compass, Radio, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';
import { analyzeRouteHazards, estimateRouteEnvironment } from '../../utils/routeAnalysis';
import { ANTARCTIC_STATIONS } from '../../data/antarcticStations';

// ─── Primitive helpers ────────────────────────────────────────────────────────

function riskColor(level) {
  const l = (level || '').toUpperCase();
  if (l === 'CRITICAL') return '#dc2626';
  if (l === 'HIGH')     return '#d97706';
  if (l === 'MODERATE') return '#ca8a04';
  return '#3385C6';
}

function Divider() {
  return <div className="w-full h-px bg-[#CCE0F0]" />;
}

function SectionHeading({ children }) {
  return (
    <p className="text-[11px] font-sans font-semibold tracking-[0.14em] uppercase text-[#68869E]">
      {children}
    </p>
  );
}

function Metric({ value, unit, label }) {
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] font-display font-bold text-[#0F2130] leading-none tracking-tight">
          {value}
        </span>
        <span className="text-sm font-sans text-[#68869E] font-medium">
          {unit}
        </span>
      </div>
      <p className="text-[10px] font-sans uppercase tracking-[0.12em] text-[#68869E] mt-1 font-semibold">
        {label}
      </p>
    </div>
  );
}

// ─── Route option card ────────────────────────────────────────────────────────

function RouteOption({ route, isActive, onSelect, riskHazards }) {
  if (!route) return null;

  const isRecommended = route.isRecommended;
  const criticals = (riskHazards || []).filter(b => b.routeRisk === 'CRITICAL').length;
  const highs = (riskHazards || []).filter(b => b.routeRisk === 'HIGH').length;
  const routeRisk = criticals > 0 ? 'CRITICAL' : highs > 0 ? 'HIGH' : isRecommended ? 'LOW' : 'MODERATE';

  return (
    <motion.button
      layout
      onClick={() => onSelect(route)}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      className={`w-full text-left transition-colors group ${
        isActive ? '' : 'opacity-60 hover:opacity-85'
      }`}
    >
      <div className={`flex items-start gap-4 p-4 border transition-all ${
        isActive
          ? 'border-[#0F2130] bg-[#FFFFFF] shadow-sm'
          : 'border-[#CCE0F0] bg-[#F4F8FB] hover:border-[#1E3A52]/40'
      }`}>
        <div className={`mt-1 w-3 h-3 rounded-full border-2 shrink-0 transition-colors ${
          isActive ? 'border-[#0F2130] bg-[#0F2130]' : 'border-[#CCE0F0]'
        }`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#68869E] font-semibold">
                {isRecommended ? 'ROUTE 01 — AI OPTIMIZED CORRIDOR' : 'ROUTE 02 — DIRECT RHUMB LINE'}
              </p>
              <p className="text-sm font-sans font-semibold text-[#0F2130] mt-0.5 leading-tight">
                {route.name}
              </p>
            </div>
          </div>

          <div className="flex items-end gap-5 flex-wrap">
            <div>
              <span className="text-2xl font-display font-bold text-[#0F2130] tracking-tight leading-none">
                {route.totalDistanceNM}
              </span>
              <span className="text-xs text-[#68869E] ml-1">NM</span>
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-[#0F2130] tracking-tight leading-none">
                {route.estimatedTimeHours}
              </span>
              <span className="text-xs text-[#68869E] ml-1">H</span>
            </div>
            {route.estimatedFuelMT && (
              <div>
                <span className="text-2xl font-display font-bold text-[#0F2130] tracking-tight leading-none">
                  {route.estimatedFuelMT}
                </span>
                <span className="text-xs text-[#68869E] ml-1">MT FUEL</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span
              className="text-[10px] font-sans font-bold uppercase tracking-[0.12em]"
              style={{ color: riskColor(routeRisk) }}
            >
              {routeRisk} ROUTE RISK
            </span>
            {(criticals > 0 || highs > 0) && (
              <span className="text-[10px] text-[#68869E]">
                · {criticals + highs} hazard{criticals + highs !== 1 ? 's' : ''} on path
              </span>
            )}
          </div>
        </div>

        <ChevronRight className={`w-4 h-4 shrink-0 mt-3 transition-colors ${
          isActive ? 'text-[#0F2130]' : 'text-[#CCE0F0]'
        }`} />
      </div>
    </motion.button>
  );
}

// ─── Iceberg hazard row ───────────────────────────────────────────────────────

function HazardRow({ iceberg, onSelectIceberg }) {
  const [open, setOpen] = useState(false);
  const risk = iceberg.routeRisk || 'LOW';

  return (
    <div className="border-b border-[#CCE0F0] py-3.5 last:border-b-0">
      <div
        className="flex items-baseline justify-between cursor-pointer group"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: riskColor(risk) }}
          />
          <span className="text-sm font-sans font-semibold text-[#0F2130] truncate group-hover:text-[#3385C6] transition-colors">
            {iceberg.name}
          </span>
          <span
            className="text-[10px] font-sans font-bold uppercase tracking-[0.1em]"
            style={{ color: riskColor(risk) }}
          >
            {risk}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          {iceberg.cpaDistanceNM != null && (
            <span className="text-xs font-mono text-[#68869E]">
              CPA {iceberg.cpaDistanceNM} NM
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-[#68869E] transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-3 pt-3 border-t border-[#CCE0F0]/60 space-y-2 text-xs font-sans text-[#68869E]"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>Type: <span className="text-[#1E3A52] font-medium">{iceberg.type || 'Tabular Iceberg'}</span></div>
              <div>Drift: <span className="text-[#1E3A52] font-medium">{iceberg.driftSpeedKnots || 0.8} kts @ {iceberg.driftHeading || 55}°T</span></div>
              <div>Length: <span className="text-[#1E3A52] font-medium">{iceberg.lengthKm || '—'} km</span></div>
              <div>Hazard Zone: <span className="text-[#1E3A52] font-medium">{iceberg.hazardRadiusNM || 3.5} NM</span></div>
            </div>

            <div className="pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIceberg(iceberg);
                }}
                className="w-full py-1.5 border border-[#CCE0F0] hover:border-[#1E3A52] text-[#1E3A52] text-xs font-sans font-semibold transition-colors bg-white hover:bg-[#F4F8FB]"
              >
                Run Drift & Melt Analysis →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Navigation Workspace Panel ──────────────────────────────────────────

export default function NavigationPlanningPanel({
  destination,
  vessel,
  vessels = [],
  stations = [],
  routes,
  icebergs = [],
  activeRouteType = 'recommended',
  onClose,
  onSelectIceberg,
  onSetActiveRoute,
  onChangeVessel,
  onChangeDestination,
  onStartNavigation
}) {
  const [selectedType, setSelectedType] = useState(activeRouteType);
  const [isNavActive, setIsNavActive] = useState(false);

  const activeRoute = selectedType === 'recommended' ? routes?.recommended : routes?.alternative;
  const otherRoute  = selectedType === 'recommended' ? routes?.alternative  : routes?.recommended;

  // Available destination stations
  const availableStations = useMemo(() => {
    if (stations && stations.length > 0) {
      // Merge unique stations from dataset
      const combined = [...ANTARCTIC_STATIONS];
      stations.forEach(st => {
        if (!combined.some(s => s.id === st.id || s.name.toLowerCase() === st.name.toLowerCase())) {
          combined.push({
            id: st.id,
            name: st.name,
            operator: st.country || st.operatorPrimary || 'International',
            coordinates: st.coordinates || [st.latitude, st.longitude]
          });
        }
      });
      return combined;
    }
    return ANTARCTIC_STATIONS;
  }, [stations]);

  // Route-aware hazard analysis for the currently active route
  const routeHazards = useMemo(() => {
    if (!activeRoute?.waypoints) return [];
    return analyzeRouteHazards(icebergs || [], activeRoute.waypoints);
  }, [activeRoute, icebergs]);

  const altHazards = useMemo(() => {
    if (!otherRoute?.waypoints) return [];
    return analyzeRouteHazards(icebergs || [], otherRoute.waypoints);
  }, [otherRoute, icebergs]);

  const env = useMemo(() => {
    if (!activeRoute?.waypoints) return null;
    return estimateRouteEnvironment(activeRoute.waypoints, vessel);
  }, [activeRoute, vessel]);

  const handleSelectRoute = (route) => {
    const type = route.isRecommended ? 'recommended' : 'alternative';
    setSelectedType(type);
    onSetActiveRoute?.(route);
  };

  const handleVesselChange = (e) => {
    const mmsiOrId = e.target.value;
    const selectedVessel = (vessels || []).find(v => v.mmsi === mmsiOrId || v.id === mmsiOrId);
    if (selectedVessel && onChangeVessel) {
      onChangeVessel(selectedVessel);
    }
  };

  const handleStationChange = (e) => {
    const stationId = e.target.value;
    const selectedSt = availableStations.find(s => s.id === stationId);
    if (selectedSt && onChangeDestination) {
      onChangeDestination(selectedSt);
    }
  };

  const handleStartNavClick = () => {
    setIsNavActive(true);
    if (onStartNavigation) {
      onStartNavigation({
        vessel,
        destination,
        route: activeRoute
      });
    }
  };

  const criticals = routeHazards.filter(b => b.routeRisk === 'CRITICAL');
  const highs     = routeHazards.filter(b => b.routeRisk === 'HIGH');
  const overallRisk = criticals.length > 0 ? 'CRITICAL' : highs.length > 0 ? 'HIGH' :
    routeHazards.some(b => b.routeRisk === 'MODERATE') ? 'MODERATE' : 'LOW';

  if (!destination) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col bg-[#FAFCFD] border-l border-[#CCE0F0] overflow-hidden select-none"
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="px-7 pt-6 pb-4 shrink-0 border-b border-[#CCE0F0] bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#68869E]">
              AIS LIVE TARGET NAVIGATION
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#CCE0F0] hover:text-[#1E3A52] transition-colors -mt-0.5 -mr-0.5 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── FLEET & DESTINATION TARGET SELECTORS ── */}
        <div className="space-y-3 pt-1">
          {/* Origin Vessel Selector */}
          <div>
            <label className="flex items-center justify-between text-[10px] font-sans font-semibold uppercase tracking-wider text-[#68869E] mb-1">
              <span className="flex items-center gap-1.5">
                <Anchor className="w-3 h-3 text-[#3385C6]" />
                Live Polar Vessel
              </span>
              <span className="font-mono text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                AIS STREAM ACTIVE
              </span>
            </label>
            <div className="relative">
              <select
                value={vessel?.mmsi || vessel?.id || ''}
                onChange={handleVesselChange}
                className="w-full py-2 pl-3 pr-8 bg-[#F4F8FB] border border-[#CCE0F0] text-xs font-sans font-bold text-[#0F2130] rounded-sm focus:outline-none focus:border-[#3385C6] transition-colors cursor-pointer appearance-none"
              >
                {(vessels && vessels.length > 0 ? vessels : [vessel]).filter(Boolean).map(v => (
                  <option key={v.mmsi || v.id} value={v.mmsi || v.id}>
                    {v.name} ({v.mmsi ? `MMSI: ${v.mmsi}` : v.callSign || 'AIS'}) — {v.speedKnots} kts
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#68869E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Live Vessel Telemetry strip */}
            {vessel && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-[#68869E] bg-[#F4F8FB]/80 px-2.5 py-1 rounded border border-[#CCE0F0]/50">
                <span>SPD: <strong className="text-[#0F2130]">{vessel.speedKnots} KT</strong></span>
                <span>HDG: <strong className="text-[#0F2130]">{vessel.heading}°T</strong></span>
                <span>MMSI: <strong className="text-[#0F2130]">{vessel.mmsi || '419000123'}</strong></span>
                <span>ETA: <strong className="text-[#0F2130]">{vessel.eta ? vessel.eta.split(' ')[0] : 'In Transit'}</strong></span>
              </div>
            )}
          </div>

          {/* Destination Target Selector */}
          <div>
            <label className="flex items-center justify-between text-[10px] font-sans font-semibold uppercase tracking-wider text-[#68869E] mb-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#3385C6]" />
                Target Research Station / Port
              </span>
              <span className="font-mono text-[9px] text-[#3385C6]">
                {formatCoordinates(
                  destination.coordinates?.[0] ?? destination.latitude,
                  destination.coordinates?.[1] ?? destination.longitude
                )}
              </span>
            </label>
            <div className="relative">
              <select
                value={destination.id || ''}
                onChange={handleStationChange}
                className="w-full py-2 pl-3 pr-8 bg-[#F4F8FB] border border-[#CCE0F0] text-xs font-sans font-bold text-[#0F2130] rounded-sm focus:outline-none focus:border-[#3385C6] transition-colors cursor-pointer appearance-none"
              >
                {availableStations.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.operator || st.country || 'Antarctic'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#68869E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── ROUTE CORRIDOR SUMMARY ── */}
        <div className="px-7 py-4 border-b border-[#CCE0F0] bg-white">
          <SectionHeading>Active Corridor Overview</SectionHeading>
          <div className="mt-2.5 flex items-center justify-between text-xs font-sans">
            <div className="max-w-[42%]">
              <p className="text-[#68869E] text-[10px] font-semibold uppercase">Origin</p>
              <p className="font-bold text-[#0F2130] truncate">{vessel?.name || 'ORV Sagar Nidhi'}</p>
            </div>
            <div className="flex-1 mx-3 h-px bg-[#CCE0F0] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Navigation className="w-3 h-3 text-[#3385C6] rotate-90 bg-white" />
              </div>
            </div>
            <div className="text-right max-w-[42%]">
              <p className="text-[#68869E] text-[10px] font-semibold uppercase">Destination</p>
              <p className="font-bold text-[#0F2130] truncate">{destination.name}</p>
            </div>
          </div>
        </div>

        {/* ── ROUTE OPTIONS ── */}
        <div className="px-7 py-5 border-b border-[#CCE0F0] space-y-2">
          <SectionHeading>Route Options</SectionHeading>
          <div className="mt-3 space-y-2">
            <RouteOption
              route={routes?.recommended}
              isActive={selectedType === 'recommended'}
              onSelect={handleSelectRoute}
              riskHazards={selectedType === 'recommended' ? routeHazards : altHazards}
            />
            <RouteOption
              route={routes?.alternative}
              isActive={selectedType === 'alternative'}
              onSelect={handleSelectRoute}
              riskHazards={selectedType === 'alternative' ? routeHazards : altHazards}
            />
          </div>

          {activeRoute?.decisionRationale && (
            <p className="text-xs text-[#68869E] font-sans leading-relaxed pt-2">
              {activeRoute.decisionRationale}
            </p>
          )}
        </div>

        {/* ── ROUTE INTELLIGENCE ── */}
        {activeRoute && (
          <div className="px-7 py-5 border-b border-[#CCE0F0]">
            <SectionHeading>Route Intelligence & Telemetry</SectionHeading>

            <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-5">
              <Metric value={activeRoute.totalDistanceNM} unit="NM" label="Distance" />
              <Metric value={activeRoute.estimatedTimeHours} unit="H" label="Estimated Time" />
              <Metric value={activeRoute.estimatedFuelMT || '—'} unit={activeRoute.estimatedFuelMT ? 'MT' : ''} label="Fuel" />
            </div>

            <Divider />

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              {env && (
                <>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.12em] text-[#68869E] font-semibold">
                      Wind Velocity
                    </p>
                    <p className="text-lg font-display font-bold text-[#0F2130] mt-1 leading-none">
                      {env.estimatedWindKnots}
                      <span className="text-sm font-sans font-normal text-[#68869E] ml-1">kt</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.12em] text-[#68869E] font-semibold">
                      Swell Height
                    </p>
                    <p className="text-lg font-display font-bold text-[#0F2130] mt-1 leading-none">
                      {env.estimatedWaveHeightM}
                      <span className="text-sm font-sans font-normal text-[#68869E] ml-1">m</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.12em] text-[#68869E] font-semibold">
                      Sea Ice Concentration
                    </p>
                    <p className="text-lg font-display font-bold mt-1 leading-none"
                      style={{ color: env.avgSeaIceConcentration > 70 ? '#dc2626' : env.avgSeaIceConcentration > 40 ? '#d97706' : '#3385C6' }}>
                      {env.avgSeaIceConcentration}
                      <span className="text-sm font-sans font-normal text-[#68869E] ml-1">%</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-[0.12em] text-[#68869E] font-semibold">
                      Corridor Visibility
                    </p>
                    <p className="text-lg font-display font-bold text-[#0F2130] mt-1 leading-none">
                      {env.visibilityNM}
                      <span className="text-sm font-sans font-normal text-[#68869E] ml-1">NM</span>
                    </p>
                  </div>
                </>
              )}

              <div className="col-span-2 pt-2">
                <Divider />
                <div className="flex items-baseline justify-between mt-3">
                  <p className="text-[10px] font-sans uppercase tracking-[0.12em] text-[#68869E] font-semibold">
                    Corridor Risk Classification
                  </p>
                  <p
                    className="text-lg font-display font-bold tracking-tight"
                    style={{ color: riskColor(overallRisk) }}
                  >
                    {overallRisk}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ROUTE HAZARDS ── */}
        <div className="px-7 py-5">
          <div className="flex items-baseline justify-between">
            <SectionHeading>Route Hazards</SectionHeading>
            {routeHazards.length > 0 && (
              <p className="text-[11px] text-[#68869E] font-sans">
                {routeHazards.length} iceberg{routeHazards.length !== 1 ? 's' : ''} tracked
              </p>
            )}
          </div>

          <div className="mt-3">
            {routeHazards.length === 0 ? (
              <p className="text-sm text-[#68869E] font-sans py-3">
                No tracked icebergs within significant range of this route corridor.
              </p>
            ) : (
              <div>
                {criticals.length > 0 && (
                  <div className="mb-4 py-3 border-l-2 border-rose-600 pl-4 bg-rose-50">
                    <p className="text-xs font-sans font-semibold text-rose-800">
                      {criticals.length} iceberg{criticals.length !== 1 ? 's' : ''} within critical proximity of the route corridor.
                      Route alteration or enhanced watch required before departure.
                    </p>
                  </div>
                )}

                {routeHazards.map(berg => (
                  <HazardRow
                    key={berg.id}
                    iceberg={berg}
                    onSelectIceberg={onSelectIceberg}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── FOOTER: START NAVIGATION ACTION ─────────────────────────────────── */}
      <div className="px-7 py-5 border-t border-[#CCE0F0] bg-white shrink-0">
        <div className="flex items-center justify-between text-xs text-[#68869E] font-sans mb-3">
          <span>{activeRoute?.name}</span>
          <span style={{ color: riskColor(overallRisk) }} className="font-semibold">
            {overallRisk} RISK
          </span>
        </div>

        {/* Primary Start Navigation Button */}
        <button
          onClick={handleStartNavClick}
          className={`w-full py-3.5 flex items-center justify-center gap-2.5 text-xs font-sans font-bold uppercase tracking-[0.16em] transition-all shadow-sm ${
            isNavActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#0F2130] hover:bg-[#1E3A52] text-white'
          }`}
        >
          <Navigation className="w-4 h-4" />
          {isNavActive ? 'Active Navigation Engaged' : 'Start Navigation'}
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 mt-2 text-xs font-sans text-[#68869E] hover:text-[#1E3A52] transition-colors"
        >
          Close Panel
        </button>
      </div>
    </motion.div>
  );
}
