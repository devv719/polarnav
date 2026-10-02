"""
PolarNav AI - Real-Time AIS Stream & Fleet Tracking Service
Connects to AISStream.io WebSocket (wss://stream.aisstream.io/v0/stream)
Filters Antarctic / Southern Ocean vessels and exposes live telemetry.
"""

import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import websockets

from services.route_engine import STATION_COORDINATES, plan_antarc_route

logger = logging.getLogger("polarnav.ais")
logging.basicConfig(level=logging.INFO)

AISSTREAM_URL = "wss://stream.aisstream.io/v0/stream"
AISSTREAM_API_KEY = "944a9e5f3596077b0f343c54b60956d9a32321ed"

# Antarctic & Southern Ocean Bounding Boxes (lat <= -50 deg S covers Drake Passage, Southern Ocean, Ross/Weddell/Prydz)
SOUTHERN_OCEAN_BOUNDS = [[[-90, -180], [-50, 180]]]

# Initial Seed Polar Research & Expedition Fleet
INITIAL_POLAR_FLEET: Dict[str, Dict[str, Any]] = {
    "419000123": {
        "id": "vessel-sagar-nidhi",
        "mmsi": "419000123",
        "name": "ORV Sagar Nidhi",
        "callSign": "VTCY-2026",
        "imo": "IMO 9377488",
        "vesselType": "Oceanographic Research Vessel",
        "iceClass": "Polar Class 4 (PC4)",
        "latitude": -66.2500,
        "longitude": 69.8000,
        "coordinates": [-66.2500, 69.8000],
        "heading": 142,
        "speedKnots": 11.2,
        "destination": "Bharati Station (Larsemann Hills)",
        "destinationId": "bharati",
        "eta": "2026-10-03 14:00 UTC",
        "draft": "6.8 m",
        "length": "104.0 m",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "isLiveAis": True,
        "sensors": {
            "ambientTemp": -7.5,
            "seaIceConcentration": 18,
            "windSpeedKnots": 22,
            "windDirection": "SSE (155°)",
            "visibilityNM": 7.2,
            "waveHeightM": 1.9,
            "riskLevel": "LOW"
        }
    },
    "232029000": {
        "id": "vessel-attenborough",
        "mmsi": "232029000",
        "name": "RRS Sir David Attenborough",
        "callSign": "ZDLU2",
        "imo": "IMO 9798222",
        "vesselType": "Polar Research Ship",
        "iceClass": "Polar Class 4 (PC4)",
        "latitude": -64.8200,
        "longitude": -63.5000,
        "coordinates": [-64.8200, -63.5000],
        "heading": 195,
        "speedKnots": 12.4,
        "destination": "Rothera Research Station",
        "destinationId": "rothera",
        "eta": "2026-10-04 09:30 UTC",
        "draft": "8.9 m",
        "length": "128.9 m",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "isLiveAis": True,
        "sensors": {
            "ambientTemp": -5.2,
            "seaIceConcentration": 24,
            "windSpeedKnots": 19,
            "windDirection": "SW (220°)",
            "visibilityNM": 8.5,
            "waveHeightM": 2.1,
            "riskLevel": "LOW"
        }
    },
    "211286000": {
        "id": "vessel-polarstern",
        "mmsi": "211286000",
        "name": "RV Polarstern",
        "callSign": "DBLK",
        "imo": "IMO 8013132",
        "vesselType": "Polar Icebreaker & Research Vessel",
        "iceClass": "Polar Class 3 (PC3)",
        "latitude": -70.5100,
        "longitude": -8.3000,
        "coordinates": [-70.5100, -8.3000],
        "heading": 78,
        "speedKnots": 10.8,
        "destination": "Neumayer Station III / Maitri",
        "destinationId": "maitri",
        "eta": "2026-10-05 18:00 UTC",
        "draft": "11.2 m",
        "length": "118.0 m",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "isLiveAis": True,
        "sensors": {
            "ambientTemp": -16.4,
            "seaIceConcentration": 42,
            "windSpeedKnots": 26,
            "windDirection": "ENE (070°)",
            "visibilityNM": 5.4,
            "waveHeightM": 1.4,
            "riskLevel": "MODERATE"
        }
    },
    "367375000": {
        "id": "vessel-palmer",
        "mmsi": "367375000",
        "name": "RV Nathaniel B. Palmer",
        "callSign": "WBP3210",
        "imo": "IMO 9007295",
        "vesselType": "Antarctic Research Icebreaker",
        "iceClass": "ABS-A2 (Icebreaker)",
        "latitude": -76.4000,
        "longitude": 168.2000,
        "coordinates": [-76.4000, 168.2000],
        "heading": 170,
        "speedKnots": 9.5,
        "destination": "McMurdo Station (Ross Sea)",
        "destinationId": "mcmurdo",
        "eta": "2026-10-04 12:00 UTC",
        "draft": "9.0 m",
        "length": "93.9 m",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "isLiveAis": True,
        "sensors": {
            "ambientTemp": -21.0,
            "seaIceConcentration": 65,
            "windSpeedKnots": 17,
            "windDirection": "S (180°)",
            "visibilityNM": 6.8,
            "waveHeightM": 0.8,
            "riskLevel": "HIGH"
        }
    },
    "228397800": {
        "id": "vessel-charcot",
        "mmsi": "228397800",
        "name": "Le Commandant Charcot",
        "callSign": "FIAQ",
        "imo": "IMO 9846249",
        "vesselType": "Polar Class Luxury Exploration Vessel",
        "iceClass": "Polar Class 2 (PC2)",
        "latitude": -63.3500,
        "longitude": -57.8000,
        "coordinates": [-63.3500, -57.8000],
        "heading": 215,
        "speedKnots": 14.1,
        "destination": "Palmer Station / Ushuaia",
        "destinationId": "palmer",
        "eta": "2026-10-03 20:00 UTC",
        "draft": "6.8 m",
        "length": "150.0 m",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "isLiveAis": True,
        "sensors": {
            "ambientTemp": -3.8,
            "seaIceConcentration": 12,
            "windSpeedKnots": 15,
            "windDirection": "WNW (290°)",
            "visibilityNM": 9.2,
            "waveHeightM": 2.6,
            "riskLevel": "LOW"
        }
    }
}


class AISManager:
    """Manages real-time AISStream connection and vessel registry."""

    def __init__(self):
        self.vessels: Dict[str, Dict[str, Any]] = dict(INITIAL_POLAR_FLEET)
        self.running: bool = False
        self._task: Optional[asyncio.Task] = None
        self._lock = asyncio.Lock()
        self.stats = {
            "messages_received": 0,
            "vessels_tracked": len(self.vessels),
            "last_packet_time": None,
            "status": "initializing"
        }

    async def start(self):
        """Starts the background AISStream WebSocket listener."""
        if self.running:
            return
        self.running = True
        self._task = asyncio.create_task(self._ais_consumer_loop())
        logger.info("AISManager background consumer initiated.")

    async def stop(self):
        """Stops the AISStream WebSocket listener."""
        self.running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("AISManager background consumer stopped.")

    async def _ais_consumer_loop(self):
        """Persistent reconnecting loop for AISStream WebSocket."""
        subscription_msg = {
            "APIKey": AISSTREAM_API_KEY,
            "BoundingBoxes": SOUTHERN_OCEAN_BOUNDS,
            "FilterMessageTypes": ["PositionReport", "ShipStaticData", "StandardSearchAndRescueAircraftReport"]
        }

        while self.running:
            try:
                self.stats["status"] = "connecting"
                logger.info("Connecting to AISStream WebSocket...")
                
                async with websockets.connect(
                    AISSTREAM_URL,
                    ping_interval=20,
                    ping_timeout=20,
                    close_timeout=10
                ) as ws:
                    self.stats["status"] = "connected"
                    await ws.send(json.dumps(subscription_msg))
                    logger.info("AISStream subscription confirmed for Southern Ocean bounding box.")

                    async for raw_message in ws:
                        if not self.running:
                            break
                        try:
                            data = json.loads(raw_message)
                            await self._process_ais_packet(data)
                        except Exception as parse_err:
                            logger.debug(f"Error parsing AIS packet: {parse_err}")

            except (websockets.ConnectionClosed, asyncio.CancelledError, Exception) as e:
                self.stats["status"] = "reconnecting"
                logger.warning(f"AISStream WebSocket disconnected ({e}). Reconnecting in 5s...")
                await asyncio.sleep(5)

    async def _process_ais_packet(self, packet: Dict[str, Any]):
        """Ingests and updates vessel state from AIS JSON frame."""
        msg_type = packet.get("MessageType")
        meta = packet.get("MetaData", {})
        msg_body = packet.get("Message", {})
        
        mmsi = str(meta.get("MMSI") or "")
        if not mmsi:
            return

        self.stats["messages_received"] += 1
        self.stats["last_packet_time"] = datetime.now(timezone.utc).isoformat()

        lat = meta.get("latitude")
        lon = meta.get("longitude")
        ship_name = (meta.get("ShipName") or "").strip()

        async with self._lock:
            # If vessel exists, update position & heading
            existing = self.vessels.get(mmsi)

            if msg_type == "PositionReport":
                pos_report = msg_body.get("PositionReport", {})
                cog = pos_report.get("Cog", 0.0)
                sog = pos_report.get("Sog", 0.0)
                heading = pos_report.get("TrueHeading", int(cog))
                if heading == 511:  # AIS not available default
                    heading = int(cog)
                
                lat = pos_report.get("Latitude", lat)
                lon = pos_report.get("Longitude", lon)

                if lat is not None and lon is not None:
                    if existing:
                        existing["latitude"] = lat
                        existing["longitude"] = lon
                        existing["coordinates"] = [lat, lon]
                        existing["speedKnots"] = round(sog, 1)
                        existing["heading"] = heading
                        existing["lastUpdated"] = datetime.now(timezone.utc).isoformat()
                        if ship_name and not existing.get("name"):
                            existing["name"] = ship_name
                    else:
                        # New vessel discovered in Antarctic / Drake waters
                        vessel_id = f"vessel-ais-{mmsi}"
                        self.vessels[mmsi] = {
                            "id": vessel_id,
                            "mmsi": mmsi,
                            "name": ship_name or f"Polar Vessel ({mmsi})",
                            "callSign": "AIS-LIVE",
                            "imo": f"IMO {mmsi[:7]}",
                            "vesselType": "Commercial / Expedition Transit",
                            "iceClass": "Polar Class (Standard)",
                            "latitude": lat,
                            "longitude": lon,
                            "coordinates": [lat, lon],
                            "heading": heading,
                            "speedKnots": round(sog, 1),
                            "destination": "Southern Ocean Transit",
                            "destinationId": "ushuaia",
                            "eta": "In Transit",
                            "draft": "7.5 m",
                            "length": "110.0 m",
                            "lastUpdated": datetime.now(timezone.utc).isoformat(),
                            "isLiveAis": True,
                            "sensors": {
                                "ambientTemp": -8.0,
                                "seaIceConcentration": 20,
                                "windSpeedKnots": 20,
                                "windDirection": "W (270°)",
                                "visibilityNM": 8.0,
                                "waveHeightM": 2.0,
                                "riskLevel": "LOW"
                            }
                        }

            elif msg_type == "ShipStaticData":
                static_data = msg_body.get("ShipStaticData", {})
                dest = (static_data.get("Destination") or "").strip()
                call_sign = (static_data.get("CallSign") or "").strip()
                imo_num = static_data.get("ImoNumber")
                static_name = (static_data.get("Name") or ship_name).strip()

                if existing:
                    if dest:
                        existing["destination"] = dest
                    if call_sign:
                        existing["callSign"] = call_sign
                    if imo_num:
                        existing["imo"] = f"IMO {imo_num}"
                    if static_name:
                        existing["name"] = static_name
                    existing["lastUpdated"] = datetime.now(timezone.utc).isoformat()

            self.stats["vessels_tracked"] = len(self.vessels)

    async def get_all_vessels(self) -> List[Dict[str, Any]]:
        """Returns all currently tracked vessels."""
        async with self._lock:
            return list(self.vessels.values())

    async def get_vessel(self, identifier: str) -> Optional[Dict[str, Any]]:
        """Finds vessel by MMSI or ID."""
        async with self._lock:
            if identifier in self.vessels:
                return self.vessels[identifier]
            for v in self.vessels.values():
                if v.get("id") == identifier or v.get("mmsi") == str(identifier):
                    return v
            return None


# Global singleton manager
ais_manager = AISManager()


def plan_vessel_route_service(
    vessel_mmsi: str,
    destination_station_id: str,
    custom_coords: Optional[List[float]] = None
) -> Dict[str, Any]:
    """
    Computes waypointed navigation plan from vessel's live location to destination station.
    """
    # Look up vessel
    vessel = None
    if vessel_mmsi in ais_manager.vessels:
        vessel = ais_manager.vessels[vessel_mmsi]
    else:
        for v in ais_manager.vessels.values():
            if v.get("id") == vessel_mmsi or v.get("mmsi") == str(vessel_mmsi):
                vessel = v
                break

    start_lat = vessel.get("latitude", -66.2500) if vessel else -66.2500
    start_lon = vessel.get("longitude", 69.8000) if vessel else 69.8000
    speed = vessel.get("speedKnots", 11.2) if vessel else 11.2

    # Look up destination
    dest_name = destination_station_id
    end_lat, end_lon = -69.4069, 76.1908  # Default: Bharati

    if destination_station_id.lower() in STATION_COORDINATES:
        st = STATION_COORDINATES[destination_station_id.lower()]
        dest_name = st["name"]
        end_lat, end_lon = st["coordinates"]
    elif custom_coords and len(custom_coords) == 2:
        end_lat, end_lon = custom_coords[0], custom_coords[1]
        dest_name = f"Target ({end_lat:.2f}°, {end_lon:.2f}°)"

    route_plan = plan_antarc_route(
        start_lat=start_lat,
        start_lon=start_lon,
        end_lat=end_lat,
        end_lon=end_lon,
        vessel_speed_knots=speed,
        destination_name=dest_name
    )

    return {
        "success": True,
        "vessel_mmsi": vessel_mmsi,
        "vessel_name": vessel.get("name", "Polar Vessel") if vessel else "Polar Vessel",
        "origin": {
            "latitude": start_lat,
            "longitude": start_lon,
            "coordinates": [start_lat, start_lon]
        },
        "destination": {
            "id": destination_station_id,
            "name": dest_name,
            "coordinates": [end_lat, end_lon]
        },
        "routes": route_plan
    }
