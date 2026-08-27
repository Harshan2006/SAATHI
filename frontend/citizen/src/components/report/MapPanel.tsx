import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

interface MapPanelProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

function MapEvents({ onChange }: Pick<MapPanelProps, "onChange">) {
  useMapEvents({ click(event) { onChange(Number(event.latlng.lat.toFixed(6)), Number(event.latlng.lng.toFixed(6))); } });
  return null;
}

function Recenter({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom(), { animate: true }); }, [center, map]);
  return null;
}

export default function MapPanel({ latitude, longitude, onChange }: MapPanelProps) {
  const center: LatLngExpression = [latitude, longitude];

  return (
    <div className="h-56 w-full overflow-hidden rounded-card border border-ink-200 sm:h-64">
      <MapContainer center={center} zoom={15} scrollWheelZoom className="h-full w-full" aria-label="OpenStreetMap location picker">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter center={center} />
        <MapEvents onChange={onChange} />
        <CircleMarker center={center} radius={10} pathOptions={{ color: "#0d6b60", fillColor: "#159488", fillOpacity: 1, weight: 3 }} />
      </MapContainer>
    </div>
  );
}
