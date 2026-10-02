import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Crosshair, 
  Navigation, 
  Activity, 
  Flame, 
  Compass, 
  Sparkles, 
  Loader2,
  Building2,
  Ship,
  TriangleAlert,
  Route as RouteIcon,
  Radio
} from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';
import { navigationService } from '../../services/navigationService';

export default function LocationInfoPanel({
  selectedObject,
  onClose,
  onZoomTo,
  onSetDestination
}) {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [etaHours, setEtaHours] = useState(24);

  useEffect(() => {
    setAnalysisResult(null);
    setAnalyzing(false);
  }, [selectedObject?.data?.id]);

  if (!selectedObject) return null;

  const { type, data } = selectedObject;

  const handleRunAnalysis = async () => {
    if (type !== 'iceberg') return;
    setAnalyzing(true);
    try {
      const area = (data.lengthKm && data.widthKm) ? (data.lengthKm * data.widthKm) : (data.areaKm2 || 1.2);
      const res = await navigationService.analyzeIcebergTarget({
        iceberg_id: data.id,
        current_lat: data.latitude || data.coordinates?.[0] || -68.5,
        current_lon: data.longitude || data.coordinates?.[1] || 74.0,
        initial_area_km2: area,
        ship_eta_hours: Number(etaHours)
      });
      setAnalysisResult(res);
    } catch (err) {
      console.error('Failed to run iceberg analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (risk) => {
    const r = (risk || '').toUpperCase();
    if (r.includes('CRITICAL') || r.includes('EXTREME')) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (r.includes('HIGH')) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-[#3385C6] bg-[#E8F3FA] border-[#CCE0F0]';
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 28 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 right-0 bottom-0 z-[1001] w-96 max-w-full max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:w-full max-md:max-h-[75vh] bg-[#FFFFFF] border-l max-md:border-l-0 max-md:border-t border-[#CCE0F0] p-6 flex flex-col justify-between select-none font-sans shadow-2xl overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#CCE0F0]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-[#F4F8FB] text-[#3385C6]">
                {type === 'station' && <Building2 className="w-4 h-4" />}
                {type === 'vessel' && <Ship className="w-4 h-4" />}
                {type === 'iceberg' && <TriangleAlert className="w-4 h-4 text-rose-500" />}
                {type === 'route' && <RouteIcon className="w-4 h-4" />}
                {type === 'coordinate' && <Radio className="w-4 h-4" />}
              </span>
              <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-[#68869E] font-bold">
                {type === 'station' ? 'ANTARCTIC FACILITY' : type === 'vessel' ? 'FLEET TELEMETRY' : type === 'iceberg' ? 'ICE HAZARD TARGET' : type === 'route' ? 'NAVIGATION ROUTE' : 'PROBED SECTOR'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#68869E] hover:text-[#0F2130] rounded hover:bg-[#F4F8FB] transition-colors"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ══════════════════════════════════════════════════════════
              1. ICEBERG TARGET VIEW (Redesigned Editorial Layout)
             ══════════════════════════════════════════════════════════ */}
          {type === 'iceberg' && (
            <div className="space-y-5">
              {/* Title & Type */}
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-semibold">
                  ICEBERG TARGET
                </div>
                <h2 className="text-2xl font-bold font-display text-[#0F2130] tracking-tight mt-0.5">
                  {data.id}
                </h2>
                <div className="text-xs font-sans text-[#68869E] mt-0.5">
                  {data.type || 'Tabular Iceberg'}
                </div>
              </div>

              {/* Position */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold">
                  POSITION
                </div>
                <div className="text-sm font-mono text-[#1E3A52] font-semibold">
                  {formatCoordinates(data.latitude || data.coordinates?.[0], data.longitude || data.coordinates?.[1])}
                </div>
                <div className="text-[11px] text-[#68869E] font-mono">
                  Observed {data.lastObserved || '2h ago'} via Sentinel-1 SAR
                </div>
              </div>

              {/* Risk Level */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold">
                  RISK ASSESSMENT
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono font-bold border uppercase tracking-wider ${getRiskColor(data.riskScore)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {data.riskScore || 'HIGH RISK'}
                  </span>
                </div>
              </div>

              {/* Dimensions */}
              {data.lengthKm && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold">
                    DIMENSIONS
                  </div>
                  <div className="text-xs font-mono text-[#1E3A52] font-semibold">
                    {data.lengthKm} × {data.widthKm} km &nbsp;•&nbsp; <span className="text-[#3385C6]">{(data.lengthKm * data.widthKm).toFixed(2)} km²</span>
                  </div>
                </div>
              )}

              {/* ── DRIFT & MELT ANALYSIS SECTION ───────────────── */}
              <div className="pt-4 border-t border-[#CCE0F0] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider text-[#0F2130] font-sans font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#3385C6]" />
                    DRIFT & MELT ANALYSIS
                  </div>
                  <span className="text-[10px] font-mono text-[#68869E]">
                    FORECAST: {etaHours}H
                  </span>
                </div>

                {/* Forecast Window Slider */}
                <div className="space-y-1.5 bg-[#F4F8FB] p-3 rounded-sm border border-[#CCE0F0]">
                  <div className="flex justify-between text-xs font-sans text-[#1E3A52]">
                    <span className="text-[#68869E]">Forecast Horizon:</span>
                    <span className="font-mono font-bold text-[#3385C6]">{etaHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="72"
                    step="6"
                    value={etaHours}
                    onChange={(e) => setEtaHours(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#CCE0F0] rounded-lg appearance-none cursor-pointer accent-[#3385C6]"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#68869E]">
                    <span>6h</span>
                    <span>24h</span>
                    <span>48h</span>
                    <span>72h</span>
                  </div>
                </div>

                {/* Run Analysis Trigger */}
                <button
                  onClick={handleRunAnalysis}
                  disabled={analyzing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#3385C6] hover:bg-[#246699] disabled:bg-[#9CBED8] text-white rounded-sm text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Computing Physics...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Run Drift & Melt Analysis
                    </>
                  )}
                </button>

                {/* Analytical Results */}
                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-2 font-sans"
                  >
                    {/* Thermodynamic Decay Card */}
                    <div className="p-3.5 bg-[#F4F8FB] border border-[#CCE0F0] rounded-sm space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#0F2130]">
                        <span className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          Thermodynamic Decay
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          analysisResult.physics_metrics.thermodynamics.will_melt_before_vessel_arrival 
                            ? 'text-emerald-700' 
                            : 'text-rose-700'
                        }`}>
                          {analysisResult.physics_metrics.thermodynamics.will_melt_before_vessel_arrival 
                            ? 'WILL FULLY MELT' 
                            : 'PERSISTENT ICE'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-[#68869E]">
                        <div>Melt Rate: <b className="text-[#1E3A52] block">{analysisResult.physics_metrics.thermodynamics.melt_rate_m_per_day} m/day</b></div>
                        <div>Area Loss: <b className="text-amber-700 block">{analysisResult.physics_metrics.thermodynamics.area_loss_percentage}%</b></div>
                        <div>Proj Area: <b className="text-[#1E3A52] block">{analysisResult.physics_metrics.thermodynamics.projected_area_km2} km²</b></div>
                        <div>ETA Window: <b className="text-[#1E3A52] block">{etaHours} Hours</b></div>
                      </div>
                    </div>

                    {/* ACC Drift Vector Card */}
                    <div className="p-3.5 bg-[#F4F8FB] border border-[#CCE0F0] rounded-sm space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#0F2130]">
                        <span className="flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-[#3385C6]" />
                          ACC Drift Vector
                        </span>
                        <span className="text-[10px] font-mono text-[#3385C6] font-bold">
                          {analysisResult.physics_metrics.trajectory.drift_vector.drift_distance_nm} NM
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#68869E]">
                        HDG {analysisResult.physics_metrics.trajectory.drift_vector.heading_degrees}°T @ {analysisResult.physics_metrics.trajectory.drift_vector.speed_knots} kts
                      </div>
                      <div className="text-[11px] font-mono text-[#1E3A52] font-medium pt-0.5">
                        Proj Coord: {formatCoordinates(
                          analysisResult.physics_metrics.trajectory.projected_position.lat,
                          analysisResult.physics_metrics.trajectory.projected_position.lon
                        )}
                      </div>
                    </div>

                    {/* AI Risk Advisory */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] uppercase font-mono tracking-widest text-[#0F2130] font-bold">
                          AI RISK ADVISORY
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#E8F3FA] text-[#3385C6] rounded border border-[#CCE0F0] font-semibold">
                          {analysisResult.advisory_report.engine}
                        </span>
                      </div>
                      <p className="text-xs text-[#1E3A52] leading-relaxed bg-[#FFFFFF] p-3 rounded-sm border border-[#CCE0F0]">
                        {analysisResult.advisory_report.collision_risk_assessment}
                      </p>
                    </div>

                    {/* Tactical Alteration Directive */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-mono tracking-widest text-[#3385C6] font-bold">
                        TACTICAL ALTERATION
                      </div>
                      <div className="p-3 bg-[#E8F3FA]/70 border border-[#CCE0F0] rounded-sm text-xs text-[#0F2130] font-medium leading-relaxed">
                        {analysisResult.advisory_report.tactical_recommendations?.action || analysisResult.advisory_report.tactical_recommendations}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              2. FACILITY / STATION VIEW
             ══════════════════════════════════════════════════════════ */}
          {type === 'station' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold font-display text-[#0F2130] tracking-tight">
                  {data.name}
                </h2>
                {data.officialName && data.officialName !== data.name && (
                  <p className="text-xs text-[#68869E] mt-0.5 italic">
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
                  <span className="px-2 py-0.5 rounded-sm border uppercase font-semibold bg-emerald-50 text-emerald-800 border-emerald-200">
                    {data.status}
                  </span>
                )}
              </div>

              {/* Coordinates */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold">
                  COORDINATES
                </div>
                <div className="text-sm font-mono text-[#1E3A52] font-semibold">
                  {formatCoordinates(data.coordinates?.[0] || data.latitude, data.coordinates?.[1] || data.longitude)}
                </div>
                {data.region && (
                  <div className="text-xs text-[#68869E]">
                    Region: {data.region}
                  </div>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-2 border-t border-[#CCE0F0]">
                {data.elevation !== null && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-semibold">Elevation</div>
                    <div className="text-xs font-bold text-[#1E3A52] mt-0.5">{data.elevation} m</div>
                  </div>
                )}
                {data.peakPopulation !== null && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-semibold">Peak Capacity</div>
                    <div className="text-xs font-bold text-[#1E3A52] mt-0.5">{data.peakPopulation} persons</div>
                  </div>
                )}
                {data.yearEstablished && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-semibold">Established</div>
                    <div className="text-xs font-bold text-[#1E3A52] mt-0.5">{data.yearEstablished}</div>
                  </div>
                )}
                {data.powerSupply && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-[#68869E] font-semibold">Power</div>
                    <div className="text-xs font-bold text-[#1E3A52] mt-0.5 truncate">{data.powerSupply}</div>
                  </div>
                )}
              </div>

              {/* Links */}
              {(data.photoUrl || data.webcamUrl) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {data.photoUrl && (
                    <a
                      href={data.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-sans text-[#3385C6] hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" /> Photo Source
                    </a>
                  )}
                  {data.webcamUrl && (
                    <a
                      href={data.webcamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-sans text-emerald-700 hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" /> Live Webcam
                    </a>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 space-y-2">
                {onZoomTo && (
                  <button
                    onClick={() => onZoomTo(data.coordinates || [data.latitude, data.longitude])}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#3385C6] hover:bg-[#246699] text-white rounded-sm text-xs font-mono uppercase tracking-wider font-bold transition-colors shadow-xs"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    Zoom To Facility
                  </button>
                )}
                {onSetDestination && (
                  <button
                    onClick={() => onSetDestination(data)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0F2130] hover:bg-[#1E3A52] text-white rounded-sm text-xs font-mono uppercase tracking-wider font-bold transition-colors shadow-xs"
                  >
                    <Navigation className="w-3 h-3" />
                    Set as Navigation Target
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              3. VESSEL VIEW
             ══════════════════════════════════════════════════════════ */}
          {type === 'vessel' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold font-display text-[#0F2130] tracking-tight">
                  {data.name}
                </h2>
                <div className="text-xs font-mono text-[#68869E] mt-0.5">
                  {data.iceClass || 'Polar Research Vessel'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold">
                  POSITION & SPEED
                </div>
                <div className="text-sm font-mono text-[#1E3A52] font-semibold">
                  {formatCoordinates(data.coordinates?.[0] || data.latitude, data.coordinates?.[1] || data.longitude)}
                </div>
                <div className="text-xs font-mono text-[#3385C6] font-bold">
                  {data.speedKnots} KTS &nbsp;•&nbsp; HEADING {data.heading}°T
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold">
                  DESTINATION
                </div>
                <div className="text-sm font-sans font-bold text-[#0F2130]">
                  {data.destination || 'BHARATI STATION'}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              4. ROUTE VIEW
             ══════════════════════════════════════════════════════════ */}
          {type === 'route' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-display text-[#0F2130] tracking-tight">
                  {data.name || 'RECOMMENDED ROUTE'}
                </h2>
                <div className="text-xs font-mono text-[#68869E] mt-0.5">
                  {data.isRecommended ? 'AI Optimal Polar Path' : 'Direct Corridor'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-semibold">Distance</div>
                  <div className="text-base font-bold text-[#1E3A52] mt-0.5">{data.totalDistanceNM} NM</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-semibold">Est. Time</div>
                  <div className="text-base font-bold text-[#3385C6] mt-0.5">{data.estimatedTimeHours} H</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#68869E] font-mono font-bold">
                  ICE HAZARD CATEGORY
                </div>
                <div className="text-sm font-mono font-bold text-[#1E3A52]">
                  {data.riskCategory ? data.riskCategory.toUpperCase() : 'LOW RISK'}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              5. COORDINATE PROBE VIEW
             ══════════════════════════════════════════════════════════ */}
          {type === 'coordinate' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-display text-[#0F2130] tracking-tight">
                  PROBED SECTOR
                </h2>
                <div className="text-xs font-mono text-[#68869E] mt-0.5">
                  Antarctic Marine Basin
                </div>
              </div>

              <div className="font-mono text-sm text-[#1E3A52] font-semibold">
                {formatCoordinates(data.coordinates?.[0] || data.latitude, data.coordinates?.[1] || data.longitude)}
              </div>

              <div className="space-y-2 font-mono text-xs pt-2 border-t border-[#CCE0F0]">
                <div className="flex justify-between text-[#68869E]">
                  <span>Sea Ice Concentration:</span>
                  <span className="text-[#1E3A52] font-bold">{data.seaIceConcentration || 0}%</span>
                </div>
                <div className="flex justify-between text-[#68869E]">
                  <span>Surface Temperature:</span>
                  <span className="text-[#1E3A52] font-bold">{data.temperature || -10}°C</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 mt-6 bg-[#F4F8FB] hover:bg-[#E8F3FA] border border-[#CCE0F0] text-xs font-mono uppercase tracking-[0.16em] text-[#1E3A52] rounded-sm transition-colors font-semibold"
        >
          Close Panel
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
