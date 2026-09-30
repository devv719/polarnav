import React from 'react';
import { 
  Compass, 
  Ship, 
  Globe2, 
  Activity,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUtcClock } from '../../hooks/useUtcClock';

export default function Header({ 
  onFocusVessel, 
  onResetOverview
}) {
  const { utcIso, utcDate, missionDay } = useUtcClock();

  return (
    <header className="h-14 bg-[#090e1a] border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0 select-none shadow-md">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3.5">
        <Link 
          to="/system"
          title="Return to System Modules"
          className="flex items-center justify-center w-9 h-9 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-900/60 hover:border-cyan-400 transition-colors shadow-[0_0_12px_rgba(0,229,255,0.2)] group"
        >
          <Compass className="w-5 h-5 animate-spin-slow group-hover:scale-110 transition-transform" />
        </Link>
        
        <div>
          <div className="flex items-center gap-2">
            <Link to="/system" className="hover:opacity-90">
              <h1 className="text-base font-bold tracking-wider text-white font-display flex items-center gap-1.5">
                POLARNAV <span className="text-cyan-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">AI</span>
              </h1>
            </Link>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700">
              SIH-26059
            </span>
            <span className="hidden md:inline-block text-[10px] uppercase font-medium tracking-wide text-cyan-300/80">
              MoES / NCPOR
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
            Antarctic Sea-Ice & Iceberg Trajectory Decision Support
          </p>
        </div>
      </div>

      {/* Center Operational Status HUD */}
      <div className="hidden lg:flex items-center gap-4 px-3 py-1 rounded bg-[#060a12]/80 border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold text-[11px]">SYSTEM OPERATIONAL</span>
        </div>
        <div className="w-[1px] h-3.5 bg-slate-800" />
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>SIMULATION MODE</span>
        </div>
        <div className="w-[1px] h-3.5 bg-slate-800" />
        <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
          <span className="text-slate-500">MISSION:</span>
          <span className="text-cyan-300">{missionDay}</span>
        </div>
      </div>

      {/* Right Telemetry & Time Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Nav Tools */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded p-0.5">
          <Link
            to="/system"
            title="System Modules"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 rounded transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">Modules</span>
          </Link>

          <button
            onClick={onFocusVessel}
            title="Center on Research Vessel"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-cyan-300 hover:text-white hover:bg-cyan-950/70 rounded transition-colors"
          >
            <Ship className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">Vessel Focus</span>
          </button>
          
          <button
            onClick={onResetOverview}
            title="Antarctic Polar Overview"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800/80 rounded transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Polar Overview</span>
          </button>
        </div>

        {/* Live UTC Clock */}
        <div className="flex items-center gap-2 bg-[#060a12] border border-slate-800 rounded px-2.5 py-1 font-mono text-right">
          <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <div className="leading-tight">
            <div className="text-[11px] font-semibold text-slate-100 tracking-wider">
              {utcIso}
            </div>
            <div className="text-[9px] text-slate-400 hidden sm:block">
              {utcDate}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
