import React, { useMemo } from 'react';
import { TileLayer } from 'react-leaflet';

/**
 * NASA GIBS Satellite Map Layer
 * Provides daily visual imagery from MODIS Terra TrueColor
 * Supports dynamic date selection (defaults to current/recent day)
 */
export default function SatelliteLayer({ 
  date, 
  opacity = 0.85, 
  visible = true 
}) {
  const formattedDate = useMemo(() => {
    if (date) return date;
    // Default to yesterday's UTC date to guarantee NASA GIBS tile availability
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [date]);

  if (!visible) return null;

  // NASA GIBS Web Mercator (EPSG:3857) GoogleMapsCompatible WMTS Tile URL
  const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${formattedDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

  const attribution = '&copy; <a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener noreferrer">NASA GIBS / EOSDIS</a> MODIS True Color';

  return (
    <TileLayer
      key={`gibs-${formattedDate}`}
      url={gibsUrl}
      attribution={attribution}
      maxZoom={9}
      minZoom={1}
      opacity={opacity}
      tileSize={256}
      crossOrigin="anonymous"
      zIndex={2}
    />
  );
}
