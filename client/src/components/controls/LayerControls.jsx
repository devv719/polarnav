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
  Binary,
  Globe
} from 'lucide-react';
import LayerToggleItem from './LayerToggleItem';

export default function LayerControls({ layers, onToggleLayer }) {
  return (
    <div className="space-y-4">
      {/* Group 1: Core Navigation & Vessels */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#3385C6] font-semibold flex items-center gap-1.5">
            <Ship className="w-3 h-3 text-[#3385C6]" />
            Tactical Fleet & Routes
          </span>
          <span className="text-[9px] font-mono text-[#68869E]">ACTIVE</span>
        </div>
        <div className="space-y-1.5">
          <LayerToggleItem
            label="Research Vessel"
            description="ORV Sagar Nidhi / Bharati Exp"
            icon={Ship}
            active={layers.vessel}
            onToggle={() => onToggleLayer('vessel')}
            colorClass="text-[#3385C6]"
            badgeText="SOG: 11.4 kts"
          />

          <LayerToggleItem
            label="AI Optimal Route"
            description="Dynamic low-resistance polar path"
            icon={Navigation}
            active={layers.recommendedRoute}
            onToggle={() => onToggleLayer('recommendedRoute')}
            colorClass="text-emerald-600"
            accentBorder="border-emerald-300"
            badgeText="RECOMMENDED"
          />

          <LayerToggleItem
            label="Alternative Route"
            description="Direct rhumb line corridor"
            icon={RouteIcon}
            active={layers.alternativeRoute}
            onToggle={() => onToggleLayer('alternativeRoute')}
            colorClass="text-amber-600"
            accentBorder="border-amber-300"
            badgeText="CONVENTIONAL"
          />

          <LayerToggleItem
            label="Antarctic Stations"
            description="Maitri, Bharati & Polar Bases"
            icon={Building2}
            active={layers.stations}
            onToggle={() => onToggleLayer('stations')}
            colorClass="text-[#1E3A52]"
          />
        </div>
      </div>

      {/* Group 2: Ice Hazards & Remote Sensing */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 font-semibold flex items-center gap-1.5">
            <TriangleAlert className="w-3 h-3 text-rose-500" />
            Ice Hazards & Remote Sensing
          </span>
          <span className="text-[9px] font-mono text-[#68869E]">SAR / NASA GIBS</span>
        </div>
        <div className="space-y-1.5">
          <LayerToggleItem
            label="NASA GIBS Satellite"
            description="Daily MODIS True Color 250m"
            icon={Globe}
            active={layers.nasaGibs}
            onToggle={() => onToggleLayer('nasaGibs')}
            colorClass="text-[#3385C6]"
            accentBorder="border-[#66A3D3]"
            badgeText="DAILY NASA"
          />

          <LayerToggleItem
            label="Iceberg Locations"
            description="Tracked tabular & pinnacled bergs"
            icon={TriangleAlert}
            active={layers.icebergs}
            onToggle={() => onToggleLayer('icebergs')}
            colorClass="text-rose-500"
            accentBorder="border-rose-300"
            badgeText="5 TRACKED"
          />

          <LayerToggleItem
            label="Polar Risk Zones"
            description="Consolidated pack & convergence"
            icon={ShieldAlert}
            active={layers.riskZones}
            onToggle={() => onToggleLayer('riskZones')}
            colorClass="text-amber-600"
            accentBorder="border-amber-300"
          />

          <LayerToggleItem
            label="Sea Ice Concentration"
            description="Satellite multi-sensor SIC grid"
            icon={Layers}
            active={layers.seaIceConcentration}
            onToggle={() => onToggleLayer('seaIceConcentration')}
            colorClass="text-[#3385C6]"
            badgeText="SIC %"
          />

          <LayerToggleItem
            label="Iceberg Probability"
            description="Predictive ML spatial distribution"
            icon={Binary}
            active={layers.icebergProbability}
            onToggle={() => onToggleLayer('icebergProbability')}
            colorClass="text-purple-600"
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
