import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ─── MODULE CONFIGURATION ──────────────────────────────────── */
const MODULE_CONFIG = {
  'sea-ice': {
    num: '02',
    title: 'SEA ICE',
    subtitle: 'SEA-ICE CONCENTRATION & FORECASTING',
    description: 'NSIDC AMSR-derived sea-ice concentration maps with 5-day extent forecasts and long-term anomaly analysis.',
    sources: ['NSIDC / AMSR-2', 'Copernicus C3S', 'MASIE Daily'],
    accent: '#7dd3fc',
    pipeline: [
      { id: 'NSIDC', status: 'PENDING' },
      { id: 'AMSR-2 L3', status: 'PENDING' },
      { id: 'SIC MODEL', status: 'PENDING' },
      { id: 'FORECAST ENGINE', status: 'PENDING' },
    ],
  },
  'icebergs': {
    num: '03',
    title: 'ICEBERGS',
    subtitle: 'ICEBERG DETECTION & TRAJECTORY PREDICTION',
    description: 'Sentinel-1 SAR-detected iceberg catalogue with AI drift trajectory modelling, calving probability scoring, and collision risk assessment.',
    sources: ['Sentinel-1 SAR', 'NIC Ice Centre', 'BYU Iceberg Track'],
    accent: '#e0f2fe',
    pipeline: [
      { id: 'SAR INGESTION', status: 'PENDING' },
      { id: 'DETECTION MODEL', status: 'PENDING' },
      { id: 'TRAJECTORY ML', status: 'PENDING' },
      { id: 'RISK SCORER', status: 'PENDING' },
    ],
  },
  'routes': {
    num: '04',
    title: 'ROUTE INTELLIGENCE',
    subtitle: 'DYNAMIC NAVIGATION & RISK OPTIMIZATION',
    description: 'Multi-objective route planning across ice concentration, weather windows, iceberg hazard zones, and fuel efficiency constraints with real-time recalculation.',
    sources: ['PolarNav Map', 'SIC Forecast', 'Weather Model'],
    accent: '#fbbf24',
    pipeline: [
      { id: 'ICE LAYER', status: 'PENDING' },
      { id: 'WEATHER LAYER', status: 'PENDING' },
      { id: 'ROUTE SOLVER', status: 'PENDING' },
      { id: 'RISK ASSESSMENT', status: 'PENDING' },
    ],
  },
  'ocean': {
    num: '05',
    title: 'OCEAN & WEATHER',
    subtitle: 'ATMOSPHERIC AND OCEAN CONDITIONS',
    description: 'ERA5 reanalysis and Copernicus Marine Service ocean current, sea surface temperature, wave height, and wind field integration for operational planning.',
    sources: ['ERA5 / ECMWF', 'CMEMS', 'Open-Meteo'],
    accent: '#34d399',
    pipeline: [
      { id: 'ERA5 FETCH', status: 'PENDING' },
      { id: 'CMEMS SST', status: 'PENDING' },
      { id: 'WAVE MODEL', status: 'PENDING' },
      { id: 'ATMOSPHERE', status: 'PENDING' },
    ],
  },
  'mission': {
    num: '06',
    title: 'MISSION CONTROL',
    subtitle: 'VESSEL TELEMETRY & MISSION OVERVIEW',
    description: 'Real-time vessel telemetry monitoring, fuel consumption tracking, position reporting, and expedition status for active polar research operations.',
    sources: ['AIS Stream', 'GMDSS', 'Onboard Systems'],
    accent: '#f87171',
    pipeline: [
      { id: 'AIS RECEIVER', status: 'PENDING' },
      { id: 'TELEMETRY', status: 'PENDING' },
      { id: 'FUEL MONITOR', status: 'PENDING' },
      { id: 'MISSION LOG', status: 'PENDING' },
    ],
  },
};

/* ─── PIPELINE STATUS ITEM ──────────────────────────────────── */
function PipelineItem({ item, accent, index }) {
  return (
    <motion.div
      className="flex items-center gap-4 py-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.0 + index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="h-px flex-1 bg-white/[0.06]" />
      <span className="font-mono text-white/25" style={{ fontSize: '0.6rem', letterSpacing: '0.18em' }}>
        {item.id}
      </span>
      <span
        className="font-mono"
        style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}
      >
        {item.status}
      </span>
      <div className="w-1.5 h-1.5 rounded-full border border-white/20" />
    </motion.div>
  );
}

/* ─── MODULE PAGE ───────────────────────────────────────────── */
export default function ModulePage({ type }) {
  const navigate = useNavigate();
  const config = MODULE_CONFIG[type] || MODULE_CONFIG['sea-ice'];

  useEffect(() => {
    document.title = `${config.title} — PolarNav AI`;
    return () => { document.title = 'PolarNav AI — Antarctic Navigation Intelligence'; };
  }, [config.title]);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 40%, ${config.accent}08 0%, transparent 55%)`,
        }}
      />

      {/* ── Header ─────────────────────────────────────────── */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-8 md:px-12 pt-8 pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer"
          style={{ background: 'none', border: 'none' }}
        >
          <span className="font-mono text-white/40 hover:text-white transition-colors" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>
            ← POLARNAV AI
          </span>
        </button>
        <span className="font-mono text-white/20" style={{ fontSize: '0.6rem', letterSpacing: '0.18em' }}>
          ({config.num}) / {config.title}
        </span>
      </motion.header>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="relative z-10 px-8 md:px-12 lg:px-24 pt-24 pb-32">

        {/* Section number */}
        <motion.div
          className="flex items-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <span className="font-mono text-white/20" style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>
            ({config.num})
          </span>
          <div className="h-px w-16 bg-white/[0.08]" />
          <span className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: config.accent, opacity: 0.6 }}>
            SIMULATION MODE
          </span>
        </motion.div>

        {/* Main title */}
        <div className="overflow-hidden mb-2">
          <motion.div
            className="font-display text-white uppercase"
            style={{
              fontSize: 'clamp(4rem, 14vw, 16rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 0.88,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {config.title}
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.div
          className="font-tech text-white/35 uppercase mt-6"
          style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)', letterSpacing: '0.2em' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {config.subtitle}
        </motion.div>

        {/* Divider line */}
        <motion.div
          className="h-px bg-white/[0.07] my-14"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left — description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-white/50"
              style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)', lineHeight: 1.75 }}
            >
              {config.description}
            </p>

            {/* Data sources */}
            <div className="mt-10">
              <div className="label-xs mb-4">DATA SOURCES</div>
              <div className="flex flex-wrap gap-2">
                {config.sources.map((src) => (
                  <span
                    key={src}
                    className="font-mono border px-3 py-1.5 text-white/30"
                    style={{
                      fontSize: '0.6rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      borderColor: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch button to map */}
            <motion.button
              className="mt-14 group relative overflow-hidden"
              onClick={() => navigate('/map')}
              style={{
                background: 'none',
                border: `1px solid ${config.accent}33`,
                color: config.accent,
                padding: '0.9rem 2.5rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
              whileHover={{ borderColor: config.accent }}
              transition={{ duration: 0.3 }}
            >
              VIEW ON POLAR MAP →
            </motion.button>
          </motion.div>

          {/* Right — pipeline status */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="label-xs mb-6">DATA PIPELINE STATUS</div>

            {/* Main status block */}
            <div
              className="border p-8"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-white/20" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>
                  PIPELINE
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full border"
                    style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                  />
                  <span className="font-mono text-white/20" style={{ fontSize: '0.6rem', letterSpacing: '0.15em' }}>
                    INITIALIZING
                  </span>
                </div>
              </div>

              {config.pipeline.map((item, i) => (
                <PipelineItem key={item.id} item={item} accent={config.accent} index={i} />
              ))}

              {/* Status message */}
              <div
                className="mt-8 pt-6 border-t text-white/20 font-mono"
                style={{ borderColor: 'rgba(255,255,255,0.04)', fontSize: '0.6rem', letterSpacing: '0.12em' }}
              >
                <div>STATUS: SIMULATION MODE ACTIVE</div>
                <div className="mt-1 opacity-60">
                  REAL DATA: NOAA · NSIDC · COPERNICUS · ERA5 · FASTAPI
                </div>
              </div>
            </div>

            {/* Coming soon note */}
            <motion.div
              className="mt-6 text-white/20 font-mono"
              style={{ fontSize: '0.58rem', letterSpacing: '0.12em', lineHeight: 1.8 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <span style={{ color: config.accent, opacity: 0.5 }}>// </span>
              This module will connect to live data sources via
              <br />
              the PolarNav FastAPI backend when deployed.
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Giant background number */}
      <div
        className="fixed bottom-0 right-0 font-display text-white pointer-events-none select-none"
        style={{
          fontSize: 'clamp(12rem, 30vw, 30rem)',
          fontWeight: 800,
          lineHeight: 0.8,
          opacity: 0.02,
          letterSpacing: '-0.04em',
        }}
      >
        {config.num}
      </div>
    </div>
  );
}
