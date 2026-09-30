import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUtcClock } from '../../hooks/useUtcClock';

export default function Header() {
  const { utcIso } = useUtcClock();
  const location = useLocation();

  // Extract just HH:MM from UTC (e.g. UTC 19:44)
  const utcDisplay = utcIso ? `UTC ${utcIso.slice(0, 5)}` : 'UTC 00:00';

  const navLinks = [
    { label: 'MAP', path: '/map' },
    { label: 'SEA ICE', path: '/sea-ice' },
    { label: 'ICEBERGS', path: '/icebergs' },
    { label: 'ROUTES', path: '/routes' },
    { label: 'WEATHER', path: '/ocean' },
  ];

  return (
    <header className="h-[60px] bg-[#071018] border-b border-white/[0.07] px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Brand + Subtitle */}
      <div className="flex items-center gap-6">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="text-sm font-semibold tracking-[0.2em] text-[#F2F4F5] font-display">
            POLARNAV
          </span>
          <span className="text-[10px] tracking-wider text-[#38bdf8] font-mono font-medium">
            AI
          </span>
        </Link>
        <span className="hidden md:inline-block w-[1px] h-3.5 bg-white/10" />
        <span className="hidden md:inline-block text-[10px] tracking-[0.18em] uppercase text-[#82909B] font-mono font-light">
          ANTARCTIC NAVIGATION INTELLIGENCE
        </span>
      </div>

      {/* Center: Clean Text Navigation */}
      <nav className="hidden sm:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`relative py-1 text-[11px] tracking-[0.18em] uppercase font-mono transition-colors duration-200 ${
                isActive
                  ? 'text-[#F2F4F5] font-medium'
                  : 'text-[#82909B] hover:text-[#F2F4F5]'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#38bdf8]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Live UTC + Single Clean Status Dot */}
      <div className="flex items-center gap-4 text-right font-mono">
        <span className="text-xs tracking-wider text-[#F2F4F5] font-normal">
          {utcDisplay}
        </span>
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10" title="System Status: Operational">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden lg:inline text-[10px] tracking-wider uppercase text-[#82909B]">
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}
