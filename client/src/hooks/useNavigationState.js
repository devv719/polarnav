import { useState, useEffect, useCallback } from 'react';
import { navigationService } from '../services/navigationService';

export function useNavigationState() {
  // Layer visibility state
  const [layers, setLayers] = useState({
    vessel: true,
    icebergs: true,
    recommendedRoute: true,
    alternativeRoute: true,
    riskZones: true,
    stations: true,
    seaIceConcentration: true,
    nasaGibs: false,
    icebergProbability: false,
    temperatureLayer: false,
    weatherVectors: false,
  });

  // Base Map Layer ('satellite', 'ocean', 'topo')
  const [baseLayer, setBaseLayer] = useState('satellite');

  // Loaded Data
  const [vessels, setVessels] = useState([]);
  const [vessel, setVessel] = useState(null);
  const [icebergs, setIcebergs] = useState([]);
  const [routes, setRoutes] = useState({ recommended: null, alternative: null });
  const [riskZones, setRiskZones] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected map entity for detailed right telemetry panel
  const [selectedObject, setSelectedObject] = useState(null);

  // Map viewport control
  const [mapCenter, setMapCenter] = useState([-68.2000, 72.0000]);
  const [mapZoom, setMapZoom] = useState(5);

  // Initial data loading
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [liveFleet, icebergData, routeData, zoneData, stationData] = await Promise.all([
          navigationService.getLiveVessels(),
          navigationService.getIcebergDetections(),
          navigationService.getNavigationRoutes(),
          navigationService.getRiskZones(),
          navigationService.getAntarcticStations()
        ]);

        setVessels(liveFleet);
        const primaryVessel = liveFleet[0] || null;
        setVessel(primaryVessel);
        setIcebergs(icebergData);
        setRoutes(routeData);
        setRiskZones(zoneData);
        setStations(stationData);

        if (primaryVessel?.coordinates) {
          setMapCenter(primaryVessel.coordinates);
        }

        setSelectedObject(null);
      } catch (err) {
        console.error('Error loading PolarNav data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Periodic AIS live vessel polling (every 10s)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updatedFleet = await navigationService.getLiveVessels();
        if (updatedFleet && updatedFleet.length > 0) {
          setVessels(updatedFleet);
          setVessel(prev => {
            if (!prev) return updatedFleet[0];
            const matching = updatedFleet.find(v => v.mmsi === prev.mmsi || v.id === prev.id);
            return matching || prev;
          });
        }
      } catch (err) {
        console.debug('AIS live poll status:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleLayer = useCallback((layerKey) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  }, []);

  const selectVessel = useCallback((vesselData) => {
    setVessel(vesselData);
    setSelectedObject({
      type: 'vessel',
      data: vesselData
    });
    if (vesselData?.coordinates) {
      setMapCenter(vesselData.coordinates);
      setMapZoom(6);
    }
  }, []);

  const resetAntarcticOverview = useCallback(() => {
    setMapCenter([-68.5000, 72.0000]);
    setMapZoom(5);
    setSelectedObject(null);
  }, []);

  const selectIceberg = useCallback((icebergData) => {
    setSelectedObject({
      type: 'iceberg',
      data: icebergData
    });
    if (icebergData.coordinates || (icebergData.latitude && icebergData.longitude)) {
      const coords = icebergData.coordinates || [icebergData.latitude, icebergData.longitude];
      setMapCenter(coords);
      setMapZoom(6);
    }
  }, []);

  const selectStation = useCallback((stationData) => {
    setSelectedObject({
      type: 'station',
      data: stationData
    });
    if (stationData.coordinates) {
      setMapCenter(stationData.coordinates);
      setMapZoom(6);
    }
  }, []);

  const selectRoute = useCallback((routeData) => {
    setSelectedObject({
      type: 'route',
      data: routeData
    });
  }, []);

  const selectCustomCoordinate = useCallback(async (lat, lng) => {
    const telemetry = await navigationService.queryCoordinateTelemetry(lat, lng);
    setSelectedObject({
      type: 'coordinate',
      data: telemetry
    });
  }, []);

  const focusVessel = useCallback(() => {
    if (vessel?.coordinates) {
      setMapCenter(vessel.coordinates);
      setMapZoom(6);
      selectVessel(vessel);
    }
  }, [vessel, selectVessel]);

  const zoomTo = useCallback((coordinates, zoom = 7) => {
    if (coordinates && coordinates.length === 2) {
      setMapCenter(coordinates);
      setMapZoom(zoom);
    }
  }, []);

  const planRouteForVessel = useCallback(async (vesselObj, destStationId, destCoords = null) => {
    if (!vesselObj) return;
    try {
      const newRoutes = await navigationService.planTargetedRoute(
        vesselObj.mmsi || vesselObj.id,
        destStationId,
        vesselObj.coordinates,
        destCoords
      );
      if (newRoutes) {
        setRoutes(newRoutes);
      }
      return newRoutes;
    } catch (err) {
      console.error('Error planning targeted route:', err);
    }
  }, []);

  return {
    layers,
    toggleLayer,
    baseLayer,
    setBaseLayer,
    vessel,
    vessels,
    setVessel,
    icebergs,
    routes,
    setRoutes,
    riskZones,
    stations,
    loading,
    selectedObject,
    setSelectedObject,
    selectVessel,
    selectIceberg,
    selectStation,
    selectRoute,
    selectCustomCoordinate,
    mapCenter,
    mapZoom,
    setMapCenter,
    setMapZoom,
    focusVessel,
    resetAntarcticOverview,
    zoomTo,
    planRouteForVessel
  };
}
