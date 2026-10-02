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
    <aside className="w-80 bg-[#FFFFFF] border-r border-[#CCE0F0] flex flex-col shrink-0 select-none z-20 overflow-hidden shadow-sm">
      {/* Sidebar Header */}
      <div className="h-11 px-3.5 border-b border-[#CCE0F0] flex items-center justify-between bg-[#F4F8FB]/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A52] tracking-wide font-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#3385C6]" />
          <span>LAYER INTELLIGENCE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#3385C6] px-1.5 py-0.5 rounded bg-[#E8F3FA] border border-[#CCE0F0]">
          <Layers className="w-3 h-3 text-[#3385C6]" />
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
      <div className="p-2.5 bg-[#F4F8FB] border-t border-[#CCE0F0]">
        <div className="flex items-start gap-2 text-[10px] text-[#68869E] font-mono leading-tight">
          <Info className="w-3.5 h-3.5 text-[#3385C6] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#1E3A52] font-semibold">SIMULATION DEMO MODE</span>
            <p className="text-[#68869E] mt-0.5">
              Calibrated mock observations for system architecture validation. (SIH 2026 - NCPOR/MoES)
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
