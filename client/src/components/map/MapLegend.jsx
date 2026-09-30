import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function MapLegend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-[#070d18]/90 backdrop-blur-md border border-slate-800/90 rounded p-2.5 shadow-xl font-mono text-[10px] text-slate-300 max-w-[240px]">
      <div 
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between cursor-pointer font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1.5"
      >
        <span className="flex items-center gap-1.5 text-cyan-400">
          <Layers className="w-3 h-3" />
          MAP SYMBOLOGY
        </span>
        {collapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </div>

      {!collapsed && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white shrink-0"></span>
            <span>Research Vessel (Active)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-rose-600 rounded-sm border border-rose-300 shrink-0"></span>
            <span>Iceberg / Calved Mass (Critical)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 rounded-sm border border-amber-300 shrink-0"></span>
            <span>Growler / Bergy Bit Field</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-cyan-400 border-b border-dashed border-cyan-200 shrink-0"></span>
            <span className="text-cyan-300 font-semibold">AI Optimal Low-Ice Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-amber-500 border-b border-dashed border-amber-300 shrink-0"></span>
            <span>Conventional Direct Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 bg-rose-500/30 border border-rose-500 shrink-0"></span>
            <span>Heavy Pack Ice Hazard Zone</span>
          </div>
        </div>
      )}
    </div>
  );
}
