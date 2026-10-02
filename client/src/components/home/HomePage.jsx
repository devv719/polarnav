import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeroVideo from './HeroVideo';
import SectionNavigation from './SectionNavigation';
import CursorFollower from './CursorFollower';

/* ─── MODULE DATA ──────────────────────────────────────────── */
const MODULES = [
  {
    id: 'map',
    num: '01',
    title: 'POLAR MAP',
    subtitle: 'INTERACTIVE ANTARCTIC NAVIGATION & GIS',
    desc: 'Real-time Antarctic GIS dashboard with active vessel telemetry, NASA GIBS daily MODIS satellite imagery, and high-resolution sea-ice overlays.',
    route: '/map',
    accent: '#3385C6',
    tag: 'GIS / LIVE',
    status: 'ACTIVE ENGINE'
  },
  {
    id: 'sea-ice',
    num: '02',
    title: 'SEA ICE',
    subtitle: 'CONCENTRATION & EXTENT FORECASTING',
    desc: 'NSIDC & AMSR2-sourced sea-ice concentration maps with 5-day spatial extent forecasts and historical thermodynamic anomaly tracking.',
    route: '/sea-ice',
    accent: '#66A3D3',
    tag: 'NSIDC / AMSR2',
    status: 'SATELLITE SYNC'
  },
  {
    id: 'icebergs',
    num: '03',
    title: 'ICEBERGS',
    subtitle: 'DETECTION & THERMODYNAMIC DRIFT ENGINE',
    desc: 'Sentinel-1 SAR detected iceberg catalogue with ACC hydrodynamic drift vectors and thermodynamic ablation rate calculations.',
    route: '/icebergs',
    accent: '#3385C6',
    tag: 'SAR / PHYSICS',
    status: '5 TARGETS TRACKED'
  },
  {
    id: 'routes',
    num: '04',
    title: 'ROUTE INTELLIGENCE',
    subtitle: 'DYNAMIC RISK & FUEL OPTIMIZATION',
    desc: 'Multi-objective polar path planning across consolidated pack ice, metocean vectors, and fuel burn constraints.',
    route: '/routes',
    accent: '#059669',
    tag: 'AI OPTIMAL',
    status: 'POLAR ROUTE READY'
  },
  {
    id: 'ocean',
    num: '05',
    title: 'OCEAN & WEATHER',
    subtitle: 'ATMOSPHERIC AND CIRCUMPOLAR METOCEAN',
    desc: 'ERA5 atmospheric reanalysis and Copernicus Marine Service ocean current, SST, and katabatic wind streamline modeling.',
    route: '/ocean',
    accent: '#2563eb',
    tag: 'CMEMS / ERA5',
    status: 'METOCEAN ACTIVE'
  },
  {
    id: 'mission',
    num: '06',
    title: 'MISSION CONTROL',
    subtitle: 'EXPEDITION STATUS & VESSEL TELEMETRY',
    desc: 'ORV Sagar Nidhi telemetry, Bharati and Maitri station proximity monitoring, and IMO Polar Code compliance reporting.',
    route: '/mission',
    accent: '#d97706',
    tag: 'TELEMETRY',
    status: 'ORV SAGAR NIDHI'
  },
];

/* ─── MODULE ROW (Editorial List Item) ──────────────────────── */
function ModuleRow({ mod, index }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative cursor-pointer group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(mod.route)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glacial hover background fill */}
      <motion.div
        className="absolute inset-0 bg-[#E8F3FA]/70"
        style={{ originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#CCE0F0]" />

      <div className="relative flex items-center gap-6 md:gap-10 px-6 md:px-12 py-6 md:py-8">
        {/* Number */}
        <div className="w-10 shrink-0">
          <span className="font-mono text-[#68869E] text-xs font-semibold tracking-wider">
            ({mod.num})
          </span>
        </div>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          <motion.div
            className="font-display text-[#0F2130] uppercase"
            style={{
              fontSize: 'clamp(1.5rem, 3.2vw, 2.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
            animate={{ x: hovered ? 8 : 0, color: hovered ? '#3385C6' : '#0F2130' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {mod.title}
          </motion.div>
          <div className="font-mono text-[#68869E] text-[11px] tracking-[0.14em] uppercase mt-1">
            {mod.subtitle}
          </div>
        </div>

        {/* Tag badge */}
        <div className="hidden sm:block shrink-0">
          <span
            className={`font-mono text-[10px] px-2.5 py-1 rounded-sm border uppercase tracking-wider transition-all duration-200 ${
              hovered
                ? 'bg-[#FFFFFF] border-[#3385C6] text-[#3385C6] shadow-xs'
                : 'bg-[#FFFFFF]/60 border-[#CCE0F0] text-[#68869E]'
            }`}
          >
            {mod.tag}
          </span>
        </div>

        {/* Arrow indicator */}
        <div className="shrink-0 w-8 flex items-center justify-end overflow-hidden">
          <motion.div
            className="font-mono text-[#3385C6] font-bold text-sm"
            animate={{ x: hovered ? 0 : 12, opacity: hovered ? 1 : 0.2 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            →
          </motion.div>
        </div>
      </div>

      {/* Bottom divider for last element */}
      {index === MODULES.length - 1 && (
        <div className="h-px bg-[#CCE0F0]" />
      )}
    </motion.div>
  );
}

/* ─── MAIN HOMEPAGE ────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [heroComplete, setHeroComplete] = useState(false);

  // Scroll-based active section tracking
  const handleScroll = useCallback(() => {
    const sections = ['hero', 'modules', 'map', 'sea-ice', 'icebergs', 'routes', 'ocean', 'mission', 'enter'];
    const offset = window.innerHeight * 0.35;
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

  // Trigger side navigation reveal
  useEffect(() => {
    const t = setTimeout(() => setHeroComplete(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#F4F8FB] text-[#1E3A52] selection:bg-[#CCE0F0] selection:text-[#0F2130]">
      {/* ── Custom Animated Precision Cursor ─────────────────── */}
      <CursorFollower />

      {/* ── Fixed Side Section Navigation ───────────────────── */}
      {heroComplete && <SectionNavigation active={activeSection} />}

      {/* ══════════════════════════════════════════════════════
          SECTION 00 — HERO
      ══════════════════════════════════════════════════════ */}
      <section
        id="section-hero"
        className="relative flex flex-col min-h-screen justify-between overflow-hidden"
      >
        {/* Cinematic Glacial Background Video / Pattern */}
        <HeroVideo />

        {/* ── Header ─────────────────────────────────────── */}
        <motion.header
          className="relative z-10 flex items-start justify-between px-8 md:px-16 pt-8 pb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo block */}
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="font-display text-[#0F2130] font-extrabold tracking-tight text-xl flex items-center gap-1.5">
              POLARNAV
              <span className="text-[#3385C6] font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#E8F3FA] border border-[#CCE0F0]">
                AI
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-[#68869E] tracking-wider font-semibold uppercase">
              <span>SIH-26059</span>
              <span className="opacity-40">·</span>
              <span>MOES / NCPOR</span>
            </div>
          </div>

          {/* Navigation Links with Micro-interactions */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-semibold tracking-wider">
            {[
              { label: 'POLAR MAP', action: () => navigate('/map') },
              { label: 'SYSTEMS', action: () => document.getElementById('section-modules')?.scrollIntoView({ behavior: 'smooth' }) },
              { label: 'PHYSICS ENGINE', action: () => document.getElementById('section-icebergs')?.scrollIntoView({ behavior: 'smooth' }) },
              { label: 'LAUNCH', action: () => navigate('/map'), primary: true }
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className={`relative py-1 cursor-pointer transition-colors duration-200 uppercase text-[11px] tracking-[0.14em] ${
                  item.primary
                    ? 'px-3.5 py-1.5 bg-[#3385C6] hover:bg-[#246699] text-white rounded-sm font-bold shadow-xs'
                    : 'text-[#68869E] hover:text-[#0F2130]'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>
        </motion.header>

        {/* ── Hero Editorial Typography Block ────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 my-auto py-12">
          {/* Coordinates & Status Header Tag */}
          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="w-2 h-2 rounded-full bg-[#3385C6] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#68869E] font-semibold">
              90°00'S · SOUTHERN OCEAN · ANTARCTIC NAVIGATION SYSTEM
            </span>
          </motion.div>

          {/* POLAR (Oversized Editorial Typography) */}
          <div className="overflow-hidden">
            <motion.div
              className="hero-title text-[#0F2130]"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              POLAR
            </motion.div>
          </div>

          {/* NAV — Offset Right for High-End Editorial Composition */}
          <div className="overflow-hidden flex items-baseline">
            <motion.div
              className="hero-title text-[#0F2130]"
              style={{ marginLeft: 'clamp(2rem, 10vw, 14rem)' }}
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.65, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              NAV
              <motion.span
                className="inline-block text-[#3385C6] font-mono"
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 3.5rem)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  marginLeft: '1.2rem',
                  verticalAlign: 'super',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                AI
              </motion.span>
            </motion.div>
          </div>

          {/* Subtitle & Scientific Summary */}
          <motion.div
            className="mt-6 md:mt-8 max-w-2xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-tech text-[#1E3A52] font-semibold uppercase text-xs md:text-sm tracking-[0.18em]">
              Antarctic Marine Navigation & Ice Intelligence Platform
            </div>
            <div className="font-mono text-[#68869E] text-[11px] md:text-xs mt-1.5 tracking-[0.12em] uppercase">
              AI-ENABLED SEA-ICE &nbsp;·&nbsp; THERMODYNAMIC ICEBERG MELT &nbsp;·&nbsp; DYNAMIC POLAR ROUTING
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Bar ──────────────────────────────────── */}
        <div className="relative z-10 flex items-end justify-between px-8 md:px-16 pb-8 pt-4">
          {/* Restrained Scroll Cue */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => document.getElementById('section-modules')?.scrollIntoView({ behavior: 'smooth' })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div
              className="w-0.5 bg-[#3385C6]"
              animate={{ height: [14, 28, 14] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ height: 14 }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#68869E] font-semibold hover:text-[#1E3A52] transition-colors">
              SCROLL TO EXPLORE
            </span>
          </motion.div>

          {/* Tactical Status Tags */}
          <motion.div
            className="hidden md:flex items-center gap-6 font-mono text-[10px] text-[#68869E] tracking-wider uppercase font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>NASA GIBS LIVE</span>
            </div>
            <span className="opacity-30">·</span>
            <div>EPSG:3031 / EPSG:3857</div>
            <span className="opacity-30">·</span>
            <span>NCPOR EXPEDITION SUPPORT</span>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 01 — MODULE ARCHITECTURE (EDITORIAL LIST)
      ══════════════════════════════════════════════════════ */}
      <section
        id="section-modules"
        className="relative min-h-screen bg-[#FFFFFF] py-28 border-t border-b border-[#CCE0F0]"
      >
        <div className="px-8 md:px-16 lg:px-24 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-[#3385C6] font-bold mb-3">
              SYSTEM CAPABILITIES // 01-06
            </div>
            <div
              className="font-display text-[#0F2130] uppercase"
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 6rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 0.92,
              }}
            >
              CORE NAVIGATION
              <br />
              ARCHITECTURE
            </div>
          </motion.div>
        </div>

        {/* Modules List */}
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          {MODULES.map((mod, i) => (
            <ModuleRow key={mod.id} mod={mod} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SCROLL SECTIONS — Individual High-Fidelity Modules
      ══════════════════════════════════════════════════════ */}
      {MODULES.map((mod, i) => (
        <section
          key={mod.id}
          id={`section-${mod.id}`}
          className={`relative min-h-screen flex flex-col justify-center overflow-hidden py-24 ${
            i % 2 === 0 ? 'bg-[#F4F8FB]' : 'bg-[#FFFFFF]'
          }`}
        >
          {/* Subtle Polar Decorative Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, #CCE0F0 1px, transparent 1px), linear-gradient(to bottom, #CCE0F0 1px, transparent 1px)`,
              backgroundSize: '160px 160px',
            }}
          />

          <div className="relative z-10 px-8 md:px-16 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header Label Row */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs text-[#68869E] font-bold tracking-widest">
                  ({mod.num})
                </span>
                <div className="h-px w-16 bg-[#CCE0F0]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#3385C6] font-bold">
                  {mod.tag}
                </span>
              </div>

              {/* Title */}
              <div
                className="section-title text-[#0F2130] uppercase"
                style={{
                  fontSize: 'clamp(2.8rem, 8vw, 8rem)',
                  lineHeight: 0.9,
                }}
              >
                {mod.title}
              </div>

              {/* Subtitle */}
              <div className="font-tech text-[#68869E] font-semibold text-xs md:text-sm uppercase tracking-[0.18em] mt-4">
                {mod.subtitle}
              </div>

              {/* Description */}
              <p className="mt-6 text-[#1E3A52] font-body max-w-2xl text-sm md:text-base leading-relaxed">
                {mod.desc}
              </p>

              {/* Thin Divider */}
              <div className="mt-8 h-px bg-[#CCE0F0] max-w-md" />

              {/* Action Bar */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate(mod.route)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#3385C6] hover:bg-[#246699] text-white rounded-sm text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xs"
                >
                  <span>{mod.id === 'map' ? 'Open Polar GIS Map' : 'Launch Module'}</span>
                  <span>→</span>
                </button>
                <span className="font-mono text-[10px] px-3 py-2 rounded-sm border border-[#CCE0F0] bg-white text-[#68869E] font-semibold uppercase">
                  STATUS: {mod.status}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Large Ghost Number in Background */}
          <div
            className="absolute bottom-6 right-8 md:right-20 font-mono text-[#CCE0F0]/30 select-none pointer-events-none"
            style={{ fontSize: 'clamp(6rem, 16vw, 18rem)', fontWeight: 800, lineHeight: 1 }}
          >
            {mod.num}
          </div>
        </section>
      ))}

      {/* ══════════════════════════════════════════════════════
          ENTER SECTION — Clean Scientific Launch Portal
      ══════════════════════════════════════════════════════ */}
      <section
        id="section-enter"
        className="relative min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF] py-28 px-8 border-t border-[#CCE0F0] text-center"
      >
        <motion.div
          className="relative z-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#3385C6] font-bold mb-6">
            SYSTEM READY // READY FOR NAVIGATION
          </div>

          <div
            className="font-display text-[#0F2130] uppercase"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 0.92,
            }}
          >
            ENTER
            <br />
            <span className="text-[#3385C6]">POLARNAV</span>
          </div>

          <p className="mt-6 text-[#68869E] font-body text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            AI-Enabled Antarctic Sea-Ice, Thermodynamic Iceberg Decay,
            and Dynamic Multi-Objective Navigation Decision Support.
          </p>

          <motion.button
            className="mt-10 px-8 py-4 bg-[#3385C6] hover:bg-[#246699] text-white rounded-sm font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-3 mx-auto"
            onClick={() => navigate('/map')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>LAUNCH NAVIGATION SYSTEM</span>
            <span className="text-sm">→</span>
          </motion.button>

          {/* Academic & Government Credentials */}
          <div className="mt-16 flex items-center justify-center gap-6 font-mono text-[10px] text-[#68869E] tracking-widest uppercase font-semibold">
            <span>SMART INDIA HACKATHON 2026</span>
            <span>·</span>
            <span>PROBLEM ID: 26059</span>
            <span>·</span>
            <span>MOES / NCPOR</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
