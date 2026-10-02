import React from 'react';

export default function LayerToggleItem({
  label,
  description,
  active,
  onToggle,
  icon: Icon,
  colorClass = 'text-[#3385C6]',
  accentBorder = 'border-[#3385C6]/60',
  isFutureLayer = false,
  badgeText
}) {
  return (
    <div
      onClick={onToggle}
      className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-all border ${
        active
          ? `bg-[#F4F8FB] ${accentBorder} text-[#1E3A52] shadow-sm`
          : 'bg-[#FFFFFF] border-[#CCE0F0] text-[#68869E] hover:border-[#66A3D3] hover:bg-[#F8FBFE]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors ${
            active ? 'bg-[#E8F3FA] text-[#3385C6]' : 'bg-[#F4F8FB] text-[#68869E] group-hover:text-[#1E3A52]'
          }`}
        >
          {Icon && <Icon className={`w-3.5 h-3.5 ${active ? colorClass : ''}`} />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold tracking-tight truncate ${active ? 'text-[#1E3A52]' : 'text-[#4A6780]'}`}>
              {label}
            </span>
            {badgeText && (
              <span className={`text-[9px] font-mono px-1 py-0.2 rounded border leading-none font-medium ${
                active 
                  ? 'bg-[#E8F3FA] text-[#3385C6] border-[#CCE0F0]' 
                  : 'bg-[#F4F8FB] text-[#68869E] border-[#CCE0F0]'
              }`}>
                {badgeText}
              </span>
            )}
            {isFutureLayer && (
              <span className="text-[9px] font-mono px-1 rounded bg-[#F4F8FB] text-[#68869E] border border-[#CCE0F0]">
                PROJ
              </span>
            )}
          </div>
          {description && (
            <p className="text-[10px] text-[#68869E] truncate leading-tight mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Switch element */}
      <div
        className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 ml-2 ${
          active ? 'bg-[#3385C6]' : 'bg-[#CCE0F0]'
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform ${
            active ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
}
