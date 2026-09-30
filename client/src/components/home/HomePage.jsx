import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroVideo from './HeroVideo';
import SectionNavigation from './SectionNavigation';

/* ─── MODULE DATA ──────────────────────────────────────────── */
const MODULES = [
  {
    id: 'map',
    num: '01',
    title: 'POLAR MAP',
    subtitle: 'INTERACTIVE ANTARCTIC NAVIGATION',
    desc: 'Real-time GIS dashboard with vessel tracking, sea-ice layers, and risk overlays on MapTiler satellite imagery.',
    route: '/map',
    accent: '#00e5ff',
    tag: 'GIS / LIVE',
  },
  {
    id: 'sea-ice',
    num: '02',
    title: 'SEA ICE',
    subtitle: 'SEA-ICE CONCENTRATION & FORECASTING',
    desc: 'NSIDC-sourced sea-ice concentration maps with 5-day extent forecasts and historical anomaly tracking.',
    route: '/sea-ice',
    accent: '#7dd3fc',
    tag: 'NSIDC / AMSR',
  },
  {
    id: 'icebergs',
    num: '03',
    title: 'ICEBERGS',
    subtitle: 'ICEBERG DETECTION & TRAJECTORY PREDICTION',
    desc: 'Sentinel-1 SAR-detected iceberg catalogue with AI-powered drift trajectory modelling and collision risk scoring.',
    route: '/icebergs',
    accent: '#e0f2fe',
    tag: 'SAR / ML',
  },
  {
    id: 'routes',
    num: '04',
    title: 'ROUTE INTELLIGENCE',
    subtitle: 'DYNAMIC NAVIGATION & RISK OPTIMIZATION',
    desc: 'Multi-objective route planning across ice, weather, and fuel constraints with real-time recalculation.',
    route: '/routes',
    accent: '#fbbf24',
    tag: 'OPTIMIZATION',
  },
  {
    id: 'ocean',
    num: '05',
    title: 'OCEAN & WEATHER',
    subtitle: 'ATMOSPHERIC AND OCEAN CONDITIONS',
    desc: 'ERA5 reanalysis and Copernicus Marine Service ocean current, SST, and wind field integration.',
    route: '/ocean',
    accent: '#34d399',
    tag: 'CMEMS / ERA5',
  },
  {
    id: 'mission',
    num: '06',
    title: 'MISSION CONTROL',
    subtitle: 'VESSEL TELEMETRY & MISSION OVERVIEW',
    desc: 'Real-time vessel telemetry, fuel consumption monitoring, and expedition status dashboard.',
    route: '/mission',
    accent: '#f87171',
    tag: 'TELEMETRY',
  },
];



/* ─── MODULE ROW (Hobro-inspired feature list item) ────────── */
function ModuleRow({ mod, index }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative cursor-pointer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(mod.route)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hover background fill */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, ${mod.accent}08, transparent)`, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: mod.accent }}
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 0.4 : 0, originX: 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative flex items-center gap-8 px-8 py-7">
        {/* Number */}
        <div className="w-12 shrink-0">
          <span className="font-mono text-white/25" style={{ fontSize: '0.7rem', letterSpacing: '0.18em' }}>
            ({mod.num})
          </span>
        </div>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          <motion.div
            className="font-display text-white uppercase"
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
            animate={{ x: hovered ? 8 : 0, color: hovered ? mod.accent : '#ffffff' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {mod.title}
          </motion.div>
          <motion.div
            className="font-mono text-white/35 mt-1"
            style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}
            animate={{ opacity: hovered ? 0.7 : 0.35 }}
          >
            {mod.subtitle}
          </motion.div>
        </div>

        {/* Tag */}
        <div className="hidden md:block shrink-0">
          <motion.span
            className="font-mono border px-3 py-1"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              borderColor: hovered ? mod.accent : 'rgba(255,255,255,0.1)',
              color: hovered ? mod.accent : 'rgba(255,255,255,0.3)',
            }}
            animate={{ borderColor: hovered ? mod.accent : 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.3 }}
          >
            {mod.tag}
          </motion.span>
        </div>

        {/* Arrow */}
        <div className="shrink-0 w-8 overflow-hidden">
          <motion.div
            className="font-mono text-white"
            style={{ fontSize: '0.75rem' }}
            animate={{ x: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            →
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="h-px bg-white/[0.06] mx-8" />
    </motion.div>
  );
}

/* ─── SCROLL SECTION ───────────────────────────────────────── */
function ExperienceSection({ id, number, title, subtitle, children }) {
  return (
    <section
      id={`section-${id}`}
      className="min-h-screen flex flex-col justify-center relative px-8 md:px-16 lg:px-24 py-32"
    >
      {children}
    </section>
  );
}

/* ─── MAIN HOMEPAGE ────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [heroComplete, setHeroComplete] = useState(false);

  // Scroll-based section tracking
  const handleScroll = useCallback(() => {
    const sections = ['hero', 'map', 'sea-ice', 'icebergs', 'routes', 'ocean', 'mission'];
    const offset = window.innerHeight * 0.4;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(`section-${sections[i]}`);
      if (el && el.getBoundingClientRect().top <= offset) {
        setActiveSection(sections[i]);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Announce hero complete after initial animation
  useEffect(() => {
    const t = setTimeout(() => setHeroComplete(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-black text-white">
      {/* ── Fixed Side Navigation ──────────────────────────── */}
      {heroComplete && <SectionNavigation active={activeSection} />}

      {/* ══════════════════════════════════════════════════════
          SECTION 00 — HERO
      ══════════════════════════════════════════════════════ */}
      <section
        id="section-hero"
        className="relative flex flex-col min-h-screen overflow-hidden"
      >
        {/* Video background */}
        <HeroVideo />

        {/* ── Header ─────────────────────────────────────── */}
        <motion.header
          className="relative z-10 flex items-start justify-between px-8 md:px-12 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Logo block */}
          <div>
            <div className="font-display text-white font-bold tracking-tight" style={{ fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              POLARNAV
              <span className="text-[#00e5ff] ml-1" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>AI</span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <span className="label-xs">SIH-26059</span>
              <span className="label-xs opacity-30">·</span>
              <span className="label-xs">MOES / NCPOR</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {['SYSTEM', 'EXPLORE', 'ABOUT'].map((item) => (
              <motion.button
                key={item}
                className="label-sm text-white/50 hover:text-white transition-colors duration-300 cursor-pointer"
                style={{ background: 'none', border: 'none' }}
                whileHover={{ opacity: 1 }}
                onClick={() => {
                  if (item === 'SYSTEM') navigate('/map');
                  else if (item === 'EXPLORE') {
                    document.getElementById('section-map')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {item}
              </motion.button>
            ))}
          </nav>
        </motion.header>

        {/* ── Hero Typography Block ───────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-16">
          {/* Coordinates decoration */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-xs">
              90°S · ANTARCTICA · {new Date().getUTCFullYear()}
            </span>
          </motion.div>

          {/* POLAR */}
          <div className="overflow-hidden">
            <motion.div
              className="hero-title text-white"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.75, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              POLAR
            </motion.div>
          </div>

          {/* NAV — offset right for editorial composition */}
          <div className="overflow-hidden">
            <motion.div
              className="hero-title text-white"
              style={{ marginLeft: 'clamp(2rem, 8vw, 12rem)' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              NAV
              <motion.span
                className="inline-block text-[#00e5ff] font-mono"
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 4rem)',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  marginLeft: '1.5rem',
                  verticalAlign: 'super',
                }}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                AI
              </motion.span>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.div
            className="mt-8 md:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="font-tech text-white/60 uppercase"
              style={{ fontSize: 'clamp(0.7rem, 1.5vw, 1rem)', letterSpacing: '0.2em' }}
            >
              Antarctic Navigation Intelligence
            </div>
            <div
              className="font-mono text-white/30 mt-2"
              style={{ fontSize: 'clamp(0.55rem, 1vw, 0.75rem)', letterSpacing: '0.12em' }}
            >
              AI-ENABLED SEA-ICE &nbsp;·&nbsp; ICEBERG TRAJECTORY &nbsp;·&nbsp; ROUTE OPTIMIZATION
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Bar ──────────────────────────────────── */}
        <div className="relative z-10 flex items-end justify-between px-8 md:px-12 pb-8">
          {/* Scroll cue */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <motion.div
              className="w-px bg-white/40"
              animate={{ height: [16, 32, 16] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ height: 16 }}
            />
            <span className="label-xs">SCROLL TO EXPLORE</span>
          </motion.div>

          {/* Status tags */}
          <motion.div
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
          >
            <span className="label-xs flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00e5ff]" style={{ boxShadow: '0 0 6px rgba(0,229,255,0.8)' }} />
              SIMULATION MODE
            </span>
            <span className="label-xs opacity-40">SIH 2026 — NCPOR</span>
          </motion.div>
        </div>

        {/* Scroll chevron */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <motion.div
            className="w-px mx-auto bg-white/25"
            animate={{ height: [20, 48, 20], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ height: 20 }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MODULES SECTION — Full-screen feature list
      ══════════════════════════════════════════════════════ */}
      <section
        id="section-modules"
        className="relative min-h-screen bg-black py-32"
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 80% 50%, rgba(0,40,80,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 px-8 md:px-16 lg:px-24 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="label-xs mb-4">NAVIGATION INTELLIGENCE SYSTEMS</div>
            <div
              className="font-display text-white uppercase"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 8rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
              }}
            >
              THE
              <br />
              PLATFORM
            </div>
          </motion.div>
        </div>

        {/* Module list */}
        <div className="relative z-10">
          {/* Top border */}
          <motion.div
            className="h-px bg-white/[0.06] mx-8 md:mx-16 lg:mx-24 mb-0"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          {MODULES.map((mod, i) => (
            <ModuleRow key={mod.id} mod={mod} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SCROLL SECTIONS — Individual module sections
      ══════════════════════════════════════════════════════ */}
      {MODULES.map((mod, i) => (
        <section
          key={mod.id}
          id={`section-${mod.id}`}
          className="relative min-h-screen flex flex-col justify-center overflow-hidden"
          style={{ background: i % 2 === 0 ? '#000' : '#050810' }}
        >
          {/* Background gradient per module */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${i % 2 === 0 ? '20% 60%' : '80% 40%'}, ${mod.accent}0c 0%, transparent 55%)`,
            }}
          />

          <div className="relative z-10 px-8 md:px-16 lg:px-24 py-24">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Section number */}
              <div className="flex items-center gap-4 mb-8">
                <span
                  className="font-mono text-white/20"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}
                >
                  ({mod.num})
                </span>
                <div className="h-px flex-1 bg-white/[0.06]" style={{ maxWidth: 80 }} />
                <span
                  className="font-mono"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: mod.accent, opacity: 0.7 }}
                >
                  {mod.tag}
                </span>
              </div>

              {/* Title */}
              <div
                className="font-display text-white uppercase"
                style={{
                  fontSize: 'clamp(3.5rem, 10vw, 11rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.88,
                }}
              >
                {mod.title}
              </div>

              {/* Subtitle */}
              <div
                className="font-tech text-white/40 mt-6 uppercase"
                style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)', letterSpacing: '0.18em' }}
              >
                {mod.subtitle}
              </div>

              {/* Desc */}
              <motion.p
                className="mt-8 text-white/50 font-body max-w-xl"
                style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', lineHeight: 1.7 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {mod.desc}
              </motion.p>

              {/* Thin line */}
              <motion.div
                className="mt-12 h-px bg-white/[0.06]"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ maxWidth: 400 }}
              />

              {/* Status */}
              <motion.div
                className="mt-8 flex items-center gap-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span
                  className="font-mono border px-3 py-1.5"
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  DATA PIPELINE INITIALIZING
                </span>
                <span className="font-mono text-white/20" style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}>
                  SIMULATION MODE
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Section index */}
          <div
            className="absolute bottom-8 right-8 md:right-16 font-mono text-white/[0.06]"
            style={{ fontSize: 'clamp(4rem, 12vw, 14rem)', fontWeight: 800, lineHeight: 1, userSelect: 'none' }}
          >
            {mod.num}
          </div>
        </section>
      ))}

      {/* ══════════════════════════════════════════════════════
          ENTER — CTA to launch the system
      ══════════════════════════════════════════════════════ */}
      <section
        id="section-enter"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: '#000' }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,80,120,0.25) 0%, transparent 65%)',
          }}
        />

        <motion.div
          className="relative z-10 text-center px-8"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="label-xs mb-10 opacity-40">SYSTEM READY</div>

          <div
            className="font-display text-white uppercase"
            style={{
              fontSize: 'clamp(2rem, 7vw, 8rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
            }}
          >
            ENTER
            <br />
            <span className="text-[#00e5ff]">POLARNAV</span>
          </div>

          <p
            className="mt-8 text-white/35 font-body max-w-md mx-auto"
            style={{ fontSize: '0.9rem', lineHeight: 1.7 }}
          >
            AI-Enabled Antarctic Sea-Ice, Iceberg Trajectory,
            <br />
            and Navigation Decision Support System
          </p>

          <motion.button
            className="mt-14 group relative overflow-hidden"
            onClick={() => navigate('/map')}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '1rem 3rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
            whileHover={{ borderColor: '#00e5ff' }}
            transition={{ duration: 0.3 }}
          >
            {/* Fill on hover */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(0,229,255,0.06)', originX: 0 }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.4 }}
            />
            <span className="relative z-10">LAUNCH NAVIGATION SYSTEM →</span>
          </motion.button>

          {/* Metadata row */}
          <div className="mt-16 flex items-center justify-center gap-8 opacity-20">
            <span className="label-xs">SIH 2026</span>
            <span className="label-xs">·</span>
            <span className="label-xs">PROBLEM ID 26059</span>
            <span className="label-xs">·</span>
            <span className="label-xs">MOES / NCPOR</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
