import React from 'react';
import { Layers, Info, SlidersHorizontal } from 'lucide-react';
import LayerControls from '../controls/LayerControls';
import StationQuickSelector from '../panels/StationQuickSelector';

export default function Sidebar({
  layers,
  onToggleLayer,
  stations,
  onSelectStation,
  selectedObjectId
}) {
  return (
    <aside className="w-80 bg-[#080d18] border-r border-slate-800/80 flex flex-col shrink-0 select-none z-20 overflow-hidden">
      {/* Sidebar Header */}
      <div className="h-11 px-3.5 border-b border-slate-800/70 flex items-center justify-between bg-[#060a12]/70">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 tracking-wide font-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>LAYER INTELLIGENCE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>V1.0</span>
        </div>
      </div>

      {/* Scrollable controls area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Layer Controls */}
        <LayerControls layers={layers} onToggleLayer={onToggleLayer} />

        {/* Station Navigation */}
        <StationQuickSelector
          stations={stations}
          onSelectStation={onSelectStation}
          activeStationId={selectedObjectId}
        />
      </div>

      {/* Footer System Disclaimer */}
      <div className="p-2.5 bg-[#060a12] border-t border-slate-800/80">
        <div className="flex items-start gap-2 text-[10px] text-slate-400 font-mono leading-tight">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-300 font-medium">SIMULATION DEMO MODE</span>
            <p className="text-slate-400 mt-0.5">
              Calibrated mock observations for system architecture validation. (SIH 2026 - NCPOR/MoES)
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
