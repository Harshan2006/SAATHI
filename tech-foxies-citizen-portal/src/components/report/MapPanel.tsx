import { useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface MapPanelProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

// Stylized, dependency-free map surface. Marker position maps to a
// bounded lat/lng box around the given center so it stays draggable
// without a live tiles API.
export default function MapPanel({ latitude, longitude, onChange }: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 }); // percent

  const BOUND = 0.01; // +/- lat/lng range represented across the panel

  function updateFromEvent(clientX: number, clientY: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setPos({ x, y });
    const lat = latitude + BOUND - (y / 100) * BOUND * 2;
    const lng = longitude - BOUND + (x / 100) * BOUND * 2;
    onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        setDragging(true);
        updateFromEvent(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => dragging && updateFromEvent(e.clientX, e.clientY)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onClick={(e) => updateFromEvent(e.clientX, e.clientY)}
      className="relative h-56 w-full cursor-crosshair overflow-hidden rounded-card border border-ink-200 select-none sm:h-64"
      style={{
        backgroundColor: "var(--color-surface-sunken)",
        backgroundImage:
          "linear-gradient(var(--color-ink-200) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink-200) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[15%] top-[30%] h-16 w-24 rounded-sm bg-teal-100" />
        <div className="absolute right-[20%] top-[55%] h-10 w-32 rounded-sm bg-blue-100" />
        <div className="absolute bottom-[8%] left-[40%] h-1.5 w-[55%] -rotate-3 bg-ink-200" />
      </div>

      <div
        className="absolute -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setDragging(true);
        }}
      >
        <MapPin className="h-8 w-8 fill-teal-600 text-teal-700 drop-shadow-md" strokeWidth={1.5} />
      </div>

      <div className="absolute bottom-2 left-2 rounded bg-surface/90 px-2 py-1 text-[11px] font-medium text-ink-500 shadow-sm">
        Drag the pin to adjust the exact spot
      </div>
    </div>
  );
}
