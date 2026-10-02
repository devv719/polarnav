import React from 'react';
import { TileLayer } from 'react-leaflet';

export default function MapBaseLayer({ mapType = 'satellite' }) {
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY || '';

  // MapTiler Basemap URL configurations with robust fallback
  const getTileUrl = () => {
    if (!apiKey) {
      if (mapType === 'satellite') {
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      }
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    switch (mapType) {
      case 'ocean':
        return `https://api.maptiler.com/maps/ocean/{z}/{x}/{y}.jpg?key=${apiKey}`;
      case 'topo':
        return `https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key=${apiKey}`;
      case 'satellite':
      default:
        return `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${apiKey}`;
    }
  };

  const attribution = '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <TileLayer
      key={`${mapType}-${apiKey ? 'maptiler' : 'fallback'}`}
      url={getTileUrl()}
      attribution={attribution}
      maxZoom={19}
      tileSize={512}
      zoomOffset={-1}
      crossOrigin="anonymous"
    />
  );
}
