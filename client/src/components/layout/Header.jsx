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
    <header className="h-[60px] bg-[#FFFFFF] border-b border-[#CCE0F0] px-6 flex items-center justify-between z-30 shrink-0 select-none shadow-sm">
      {/* Left: Brand + Subtitle */}
      <div className="flex items-center gap-6">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="text-base font-bold tracking-[0.18em] text-[#0F2130] font-display">
            POLARNAV
          </span>
          <span className="text-[10px] tracking-wider text-[#3385C6] font-mono font-semibold px-1 py-0.2 rounded bg-[#E8F3FA] border border-[#CCE0F0]">
            AI
          </span>
        </Link>
        <span className="hidden md:inline-block w-[1px] h-3.5 bg-[#CCE0F0]" />
        <span className="hidden md:inline-block text-[10px] tracking-[0.18em] uppercase text-[#68869E] font-mono font-medium">
          ANTARCTIC NAVIGATION INTELLIGENCE
        </span>
      </div>

      {/* Center: Clean Text Navigation */}
      <nav className="hidden sm:flex items-center gap-7">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`relative py-1 text-[11px] tracking-[0.16em] uppercase font-mono transition-colors duration-200 ${
                isActive
                  ? 'text-[#3385C6] font-bold'
                  : 'text-[#68869E] hover:text-[#1E3A52]'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3385C6] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Live UTC + Clean Status Dot */}
      <div className="flex items-center gap-4 text-right font-mono">
        <span className="text-xs tracking-wider text-[#1E3A52] font-semibold">
          {utcDisplay}
        </span>
        <div className="flex items-center gap-1.5 pl-3 border-l border-[#CCE0F0]" title="System Status: Operational">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden lg:inline text-[10px] tracking-wider uppercase text-[#68869E] font-medium">
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}
