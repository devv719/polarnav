import React from 'react';

export default function LayerToggleItem({
  label,
  description,
  active,
  onToggle,
  icon: Icon,
  colorClass = 'text-cyan-400',
  accentBorder = 'border-cyan-500/30',
  isFutureLayer = false,
  badgeText
}) {
  return (
    <div
      onClick={onToggle}
      className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-all border ${
        active
          ? `bg-slate-900/90 ${accentBorder} text-slate-100 shadow-sm`
          : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors ${
            active ? 'bg-slate-800 text-cyan-300' : 'bg-slate-900 text-slate-500 group-hover:text-slate-400'
          }`}
        >
          {Icon && <Icon className={`w-3.5 h-3.5 ${active ? colorClass : ''}`} />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium tracking-tight truncate">
              {label}
            </span>
            {badgeText && (
              <span className={`text-[9px] font-mono px-1 py-0.2 rounded border leading-none ${
                active 
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}>
                {badgeText}
              </span>
            )}
            {isFutureLayer && (
              <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                PROJ
              </span>
            )}
          </div>
          {description && (
            <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Switch element */}
      <div
        className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 ml-2 ${
          active ? 'bg-cyan-600' : 'bg-slate-800'
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full bg-white transition-transform ${
            active ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
}
