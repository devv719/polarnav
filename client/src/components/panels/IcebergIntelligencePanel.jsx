import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Compass, Flame, ShieldAlert, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';
import { navigationService } from '../../services/navigationService';

// ─── Visual Helpers ───────────────────────────────────────────────────────────

function riskColor(level) {
  const l = (level || '').toUpperCase();
  if (l.includes('CRITICAL') || l.includes('EXTREME')) return '#dc2626';
  if (l.includes('HIGH')) return '#d97706';
  if (l.includes('MODERATE')) return '#ca8a04';
  return '#3385C6';
}

function riskBg(level) {
  const l = (level || '').toUpperCase();
  if (l.includes('CRITICAL') || l.includes('EXTREME')) return 'bg-rose-50 text-rose-800 border-rose-200';
  if (l.includes('HIGH')) return 'bg-amber-50 text-amber-800 border-amber-200';
  if (l.includes('MODERATE')) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
  return 'bg-[#E8F3FA] text-[#1E3A52] border-[#CCE0F0]';
}

function Divider() {
  return <div className="w-full h-px bg-[#CCE0F0]" />;
}

function SectionHeading({ children }) {
  return (
    <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-[#68869E]">
      {children}
    </p>
  );
}

// ─── Main Iceberg Intelligence Workspace Panel ────────────────────────────────

export default function IcebergIntelligencePanel({
  iceberg,
  onClose,
  onAnalysisComplete
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [etaHours, setEtaHours] = useState(24);

  // Reset analysis when switching between icebergs
  useEffect(() => {
    setAnalysisResult(null);
    setAnalyzing(false);
    if (onAnalysisComplete) {
      onAnalysisComplete(null);
    }
  }, [iceberg?.id]);

  if (!iceberg) return null;

  const lat = iceberg.latitude ?? iceberg.coordinates?.[0] ?? -68.5;
  const lon = iceberg.longitude ?? iceberg.coordinates?.[1] ?? 74.0;
  const lengthKm = iceberg.lengthKm || (iceberg.initial_area_km2 ? Math.sqrt(iceberg.initial_area_km2) : 2.4);
  const widthKm = iceberg.widthKm || (lengthKm * 0.55);
  const areaKm2 = Number((lengthKm * widthKm).toFixed(2));
  const heightM = Math.round(lengthKm * 12 + 15); // estimated freeboard height in meters
  const risk = iceberg.riskScore || iceberg.routeRisk || 'MODERATE';

  // Format latitude/longitude separately for clean technical display
  const latFormatted = `LAT ${Math.abs(lat).toFixed(2)}° ${lat < 0 ? 'S' : 'N'}`;
  const lonFormatted = `LON ${Math.abs(lon).toFixed(2)}° ${lon < 0 ? 'W' : 'E'}`;

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await navigationService.analyzeIcebergTarget({
        iceberg_id: iceberg.id,
        current_lat: lat,
        current_lon: lon,
        initial_area_km2: areaKm2,
        ship_eta_hours: Number(etaHours),
        water_temp_c: 0.5,
        ice_temp_c: -4.0
      });
      setAnalysisResult(res);
      if (onAnalysisComplete) {
        onAnalysisComplete(res);
      }
    } catch (err) {
      console.error('Failed to run iceberg analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const physics = analysisResult?.physics_metrics;
  const advisory = analysisResult?.advisory_report;
  const thermo = physics?.thermodynamics;
  const trajectory = physics?.trajectory;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col bg-[#FAFCFD] border-l border-[#CCE0F0] overflow-hidden select-none"
    >
      {/* ── 1. ICEBERG HEADER ─────────────────────────────────────────────── */}
      <div className="px-7 pt-7 pb-5 shrink-0 border-b border-[#CCE0F0] bg-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#68869E]">
              ICEBERG INTELLIGENCE
            </span>
            <h2 className="text-[30px] font-display font-bold text-[#0F2130] leading-none tracking-tight mt-1">
              {iceberg.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#CCE0F0] hover:text-[#0F2130] transition-colors p-1 -mr-1"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Status Line */}
        <div className="flex items-center justify-between gap-3 text-xs font-sans text-[#68869E] mb-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>OBSERVED · SENTINEL-1 SAR</span>
          </div>
          <span className="font-mono text-[11px] text-[#68869E]">
            {iceberg.lastObserved || '2 HOURS AGO'}
          </span>
        </div>

        {/* Risk Assessment Badge */}
        <div className="flex items-center justify-between pt-1">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.14em] border ${riskBg(risk)}`}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: riskColor(risk) }}
            />
            {risk} RISK
          </span>
          <span className="text-xs font-sans text-[#68869E] italic">
            {iceberg.type || 'Tabular Iceberg'}
          </span>
        </div>

        {/* Technical Location Bar */}
        <div className="mt-4 pt-3 border-t border-[#CCE0F0] flex items-center justify-between font-mono text-xs font-semibold text-[#0F2130] bg-[#F4F8FB] px-3 py-2 rounded-xs">
          <span>{latFormatted}</span>
          <span className="text-[#CCE0F0]">|</span>
          <span>{lonFormatted}</span>
        </div>
      </div>

      {/* ── 2. SCROLLABLE ANALYTICAL BODY ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── CORE OBSERVATION SECTION ── */}
        <div className="px-7 py-5 border-b border-[#CCE0F0] bg-white">
          <SectionHeading>Observation Telemetry</SectionHeading>

          <div className="mt-3.5 space-y-2.5 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="text-[#68869E]">Observation Time</span>
              <span className="font-mono text-[#0F2130] font-medium">{iceberg.lastObserved || '2h ago (14:22 UTC)'}</span>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-[#68869E]">Sensor / Data Source</span>
              <span className="text-[#0F2130] font-medium">Copernicus Sentinel-1 SAR</span>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-[#68869E]">Classification</span>
              <span className="text-[#0F2130] font-medium">{iceberg.type || 'Tabular Iceberg'}</span>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-[#68869E]">Spatial Dimensions</span>
              <span className="font-mono text-[#0F2130] font-semibold">
                {lengthKm} × {widthKm} km &nbsp;·&nbsp; {areaKm2} km²
              </span>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-[#68869E]">Estimated Freeboard</span>
              <span className="font-mono text-[#0F2130] font-medium">{heightM} m (ASL)</span>
            </div>
          </div>
        </div>

        {/* ── DRIFT & MELT ANALYSIS CONFIGURATION ── */}
        <div className="px-7 py-5 border-b border-[#CCE0F0]">
          <div className="flex items-baseline justify-between mb-3">
            <SectionHeading>Drift & Melt Analysis</SectionHeading>
            <span className="font-mono text-[11px] font-bold text-[#3385C6]">
              {etaHours}H PROJECTION
            </span>
          </div>

          {/* Forecast Horizon Selector Tabs */}
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {[12, 24, 48, 72].map((hours) => (
              <button
                key={hours}
                onClick={() => setEtaHours(hours)}
                className={`py-1.5 text-xs font-mono font-semibold transition-all border ${
                  etaHours === hours
                    ? 'bg-[#0F2130] text-white border-[#0F2130]'
                    : 'bg-white text-[#68869E] border-[#CCE0F0] hover:border-[#1E3A52] hover:text-[#0F2130]'
                }`}
              >
                {hours}H
              </button>
            ))}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className={`w-full py-3.5 flex items-center justify-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.16em] transition-all shadow-xs ${
              analyzing
                ? 'bg-[#E8F3FA] text-[#3385C6] cursor-wait'
                : 'bg-[#0F2130] hover:bg-[#1E3A52] text-white active:scale-[0.99]'
            }`}
          >
            {analyzing ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#3385C6] border-t-transparent animate-spin" />
                <span>Computing Thermodynamic & ACC Drift...</span>
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Run {etaHours}h Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* ── 3. STRUCTURED ANALYTICAL RESULTS ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          {analysisResult && (
            <motion.div
              key="analysis-results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-0 divide-y divide-[#CCE0F0]"
            >
              {/* SECTION A: THERMODYNAMIC DECAY */}
              <div className="px-7 py-5 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <SectionHeading>Thermodynamic Decay</SectionHeading>
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${
                    thermo?.will_melt_before_vessel_arrival
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {thermo?.will_melt_before_vessel_arrival ? 'Complete Ablation' : 'Persistent Ice Mass'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-sans text-xs">
                  <div>
                    <span className="text-[#68869E] text-[11px] block">Melt Erosion Rate</span>
                    <span className="font-mono font-bold text-sm text-[#0F2130]">
                      {thermo?.melt_rate_m_per_day || 0.0433}
                      <span className="text-xs font-normal text-[#68869E] ml-1">m/day</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#68869E] text-[11px] block">Projected Area ({etaHours}h)</span>
                    <span className="font-mono font-bold text-sm text-[#0F2130]">
                      {thermo?.projected_area_km2 || areaKm2}
                      <span className="text-xs font-normal text-[#68869E] ml-1">km²</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#68869E] text-[11px] block">Area Loss Percentage</span>
                    <span className="font-mono font-bold text-sm text-amber-700">
                      {thermo?.area_loss_percentage || 0.01}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[#68869E] text-[11px] block">Sea Temp Gradient</span>
                    <span className="font-mono font-bold text-sm text-[#0F2130]">
                      +0.5°C / -4.0°C
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION B: DRIFT VECTOR */}
              <div className="px-7 py-5 bg-[#FAFCFD]">
                <div className="flex items-center justify-between mb-3">
                  <SectionHeading>ACC Hydrodynamic Drift Vector</SectionHeading>
                  <span className="font-mono text-xs font-bold text-[#3385C6]">
                    {trajectory?.drift_vector?.drift_distance_nm || (0.8 * etaHours).toFixed(1)} NM
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-sans text-xs mb-3">
                  <div>
                    <span className="text-[#68869E] text-[11px] block">Drift Heading</span>
                    <span className="font-mono font-bold text-sm text-[#0F2130]">
                      {trajectory?.drift_vector?.heading_degrees || 55.0}°T (ACC)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#68869E] text-[11px] block">Drift Velocity</span>
                    <span className="font-mono font-bold text-sm text-[#0F2130]">
                      {trajectory?.drift_vector?.speed_knots || 0.8}
                      <span className="text-xs font-normal text-[#68869E] ml-1">kts</span>
                    </span>
                  </div>
                </div>

                {/* Projected coordinates */}
                {trajectory?.projected_position && (
                  <div className="p-2.5 bg-white border border-[#CCE0F0] rounded-xs font-mono text-[11px] text-[#1E3A52] flex items-center justify-between">
                    <span className="text-[#68869E] font-sans">Projected Pos ({etaHours}h):</span>
                    <span className="font-bold">
                      {formatCoordinates(trajectory.projected_position.lat, trajectory.projected_position.lon)}
                    </span>
                  </div>
                )}
              </div>

              {/* SECTION C: AI RISK ADVISORY */}
              <div className="px-7 py-5 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <SectionHeading>AI Risk Advisory</SectionHeading>
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${riskBg(advisory?.risk_level || 'HIGH')}`}>
                    {advisory?.risk_level || 'HIGH'} RISK
                  </span>
                </div>

                <p className="text-xs font-sans text-[#1E3A52] leading-relaxed mb-3">
                  {advisory?.collision_risk_assessment || (
                    `Target maintains mass with projected area ${areaKm2} km². Antarctic Circumpolar Current drift along 055°T establishes an active collision intercept corridor.`
                  )}
                </p>

                {advisory?.executive_report && (
                  <div className="p-3 bg-[#F4F8FB] border-l-2 border-[#3385C6] font-mono text-[10px] text-[#0F2130] leading-relaxed whitespace-pre-line">
                    {advisory.executive_report}
                  </div>
                )}
              </div>

              {/* SECTION D: TACTICAL ALTERATION */}
              <div className="px-7 py-5 bg-[#FAFCFD]">
                <SectionHeading>Tactical Alteration Directive</SectionHeading>

                <div className="mt-3 p-3 bg-white border border-[#CCE0F0] rounded-xs space-y-2 text-xs font-sans">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#0F2130]">
                        {advisory?.tactical_recommendations?.action || 'Execute 15° evasive detour to Starboard.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#CCE0F0] text-[11px] font-mono text-[#68869E]">
                    <div>
                      Min CPA Standoff:&nbsp;
                      <strong className="text-[#0F2130]">
                        {advisory?.tactical_recommendations?.min_cpa_nautical_miles || 3.5} NM
                      </strong>
                    </div>
                    <div>
                      Course Alteration:&nbsp;
                      <strong className="text-[#0F2130]">
                        +{advisory?.tactical_recommendations?.course_alteration_degrees || 15.0}° STBD
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── FOOTER: CLOSE / RETURN ─────────────────────────────────────────── */}
      <div className="px-7 py-4 border-t border-[#CCE0F0] bg-white shrink-0">
        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs font-sans text-[#68869E] hover:text-[#0F2130] font-semibold transition-colors"
        >
          Return to Antarctic Overview
        </button>
      </div>
    </motion.div>
  );
}
