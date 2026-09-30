import React from 'react';
import { useMap } from 'react-leaflet';
import { Plus, Minus, Globe } from 'lucide-react';


export default function MapControls({
  baseLayer,
  setBaseLayer,
  onResetAntarctica,
  cursorCoord
}) {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 font-mono text-xs select-none pointer-events-none">
      {/* Zoom and Reset Controls */}
      <div className="flex flex-col gap-1 self-end pointer-events-auto shadow-lg">
        <button
          onClick={() => map.zoomIn()}
          title="Zoom In"
          className="w-8 h-8 rounded bg-[#09111e]/90 hover:bg-[#12223c] text-cyan-300 border border-slate-700/80 flex items-center justify-center transition-colors shadow"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => map.zoomOut()}
          title="Zoom Out"
          className="w-8 h-8 rounded bg-[#09111e]/90 hover:bg-[#12223c] text-cyan-300 border border-slate-700/80 flex items-center justify-center transition-colors shadow"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={onResetAntarctica}
          title="Reset View to Antarctica"
          className="h-8 px-2 rounded bg-[#09111e]/90 hover:bg-[#12223c] text-cyan-300 border border-cyan-500/50 flex items-center gap-1.5 transition-colors shadow text-[10px] font-bold"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Antarctica</span>
        </button>
      </div>

      {/* MapTiler Basemap Switcher */}
      <div className="bg-[#070d18]/90 backdrop-blur-sm border border-slate-800/90 rounded p-1 shadow-xl flex items-center gap-1 pointer-events-auto self-end">
        <button
          onClick={() => setBaseLayer('satellite')}
          className={`px-2 py-1 rounded text-[10px] transition-colors ${
            baseLayer === 'satellite'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setBaseLayer('ocean')}
          className={`px-2 py-1 rounded text-[10px] transition-colors ${
            baseLayer === 'ocean'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ocean
        </button>
        <button
          onClick={() => setBaseLayer('topo')}
          className={`px-2 py-1 rounded text-[10px] transition-colors ${
            baseLayer === 'topo'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Topo
        </button>
      </div>

      {/* Live Cursor Coordinates */}
      {cursorCoord && (
        <div className="bg-[#070d18]/90 backdrop-blur-sm border border-slate-800/90 rounded px-2 py-1 text-[10px] text-slate-300 shadow text-right pointer-events-auto self-end">
          <span className="text-slate-400 mr-1.5">COORD:</span>
          <span className="text-cyan-300 font-bold">{cursorCoord}</span>
        </div>
      )}
    </div>
  );
}
