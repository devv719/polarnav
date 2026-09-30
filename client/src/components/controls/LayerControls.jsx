import React from 'react';
import { 
  Ship, 
  TriangleAlert, 
  Navigation, 
  Route as RouteIcon, 
  ShieldAlert, 
  Building2, 
  Layers, 
  Thermometer, 
  Wind, 
  Binary
} from 'lucide-react';
import LayerToggleItem from './LayerToggleItem';

export default function LayerControls({ layers, onToggleLayer }) {
  return (
    <div className="space-y-4">
      {/* Group 1: Core Navigation & Vessels */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 font-semibold flex items-center gap-1.5">
            <Ship className="w-3 h-3 text-cyan-400" />
            Tactical Fleet & Routes
          </span>
          <span className="text-[9px] font-mono text-slate-400">ACTIVE</span>
        </div>
        <div className="space-y-1.5">
          <LayerToggleItem
            label="Research Vessel"
            description="ORV Sagar Nidhi / Bharati Exp"
            icon={Ship}
            active={layers.vessel}
            onToggle={() => onToggleLayer('vessel')}
            colorClass="text-cyan-400"
            badgeText="SOG: 11.4 kts"
          />

          <LayerToggleItem
            label="AI Optimal Route"
            description="Dynamic low-resistance polar path"
            icon={Navigation}
            active={layers.recommendedRoute}
            onToggle={() => onToggleLayer('recommendedRoute')}
            colorClass="text-emerald-400"
            accentBorder="border-emerald-500/40"
            badgeText="RECOMMENDED"
          />

          <LayerToggleItem
            label="Alternative Route"
            description="Direct rhumb line corridor"
            icon={RouteIcon}
            active={layers.alternativeRoute}
            onToggle={() => onToggleLayer('alternativeRoute')}
            colorClass="text-amber-400"
            accentBorder="border-amber-500/40"
            badgeText="CONVENTIONAL"
          />

          <LayerToggleItem
            label="Antarctic Stations"
            description="Maitri, Bharati & Polar Bases"
            icon={Building2}
            active={layers.stations}
            onToggle={() => onToggleLayer('stations')}
            colorClass="text-blue-300"
          />
        </div>
      </div>

      {/* Group 2: Ice Hazards & Icebergs */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400/80 font-semibold flex items-center gap-1.5">
            <TriangleAlert className="w-3 h-3 text-rose-400" />
            Ice Hazards & Targets
          </span>
          <span className="text-[9px] font-mono text-slate-400">SAR / RADAR</span>
        </div>
        <div className="space-y-1.5">
          <LayerToggleItem
            label="Iceberg Locations"
            description="Tracked tabular & pinnacled bergs"
            icon={TriangleAlert}
            active={layers.icebergs}
            onToggle={() => onToggleLayer('icebergs')}
            colorClass="text-rose-400"
            accentBorder="border-rose-500/40"
            badgeText="5 TRACKED"
          />

          <LayerToggleItem
            label="Polar Risk Zones"
            description="Consolidated pack & convergence"
            icon={ShieldAlert}
            active={layers.riskZones}
            onToggle={() => onToggleLayer('riskZones')}
            colorClass="text-orange-400"
            accentBorder="border-orange-500/40"
          />

          <LayerToggleItem
            label="Sea Ice Concentration"
            description="Satellite multi-sensor SIC grid"
            icon={Layers}
            active={layers.seaIceConcentration}
            onToggle={() => onToggleLayer('seaIceConcentration')}
            colorClass="text-sky-300"
            badgeText="SIC %"
          />

          <LayerToggleItem
            label="Iceberg Probability"
            description="Predictive ML spatial distribution"
            icon={Binary}
            active={layers.icebergProbability}
            onToggle={() => onToggleLayer('icebergProbability')}
            colorClass="text-purple-400"
            isFutureLayer={true}
          />
        </div>
      </div>

      {/* Group 3: Meteorological & Environmental */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-cyan-400" />
            Ocean & Atmosphere
          </span>
          <span className="text-[9px] font-mono text-slate-400">METOCEAN</span>
        </div>
        <div className="space-y-1.5">
          <LayerToggleItem
            label="Temperature & Weather"
            description="Surface isotherms & chill factors"
            icon={Thermometer}
            active={layers.temperatureLayer}
            onToggle={() => onToggleLayer('temperatureLayer')}
            colorClass="text-cyan-300"
            isFutureLayer={true}
          />

          <LayerToggleItem
            label="Katabatic Wind Vectors"
            description="Antarctic wind drift streamlines"
            icon={Wind}
            active={layers.weatherVectors}
            onToggle={() => onToggleLayer('weatherVectors')}
            colorClass="text-teal-300"
            isFutureLayer={true}
          />
        </div>
      </div>
    </div>
  );
}
