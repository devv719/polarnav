import React from 'react';

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-6 z-[1000] bg-[#080808]/85 backdrop-blur-md border border-white/[0.08] px-3 py-1.5 rounded-sm font-mono text-[10px] text-[#8E8C85] select-none pointer-events-none shadow-lg">
      <div className="flex items-center gap-3">
        <span className="tracking-widest uppercase text-[9px] text-[#F3F1EB] font-medium">SEA ICE</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px]">0%</span>
          <div className="w-16 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#00e5ff]/40 to-[#00e5ff]" />
          <span className="text-[9px]">100%</span>
        </div>
      </div>
    </div>
  );
}
