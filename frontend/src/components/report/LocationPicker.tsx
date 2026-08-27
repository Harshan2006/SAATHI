import { useState } from "react";
import { LocateFixed, LoaderCircle, CheckCircle2 } from "lucide-react";
import type { GeoLocation } from "../../types";
import MapPanel from "./MapPanel";
import { cn } from "../../lib/utils";

interface LocationPickerProps {
  location: GeoLocation;
  onChange: (location: GeoLocation) => void;
}

type LocateState = "idle" | "requesting" | "granted";

export default function LocationPicker({ location, onChange }: LocationPickerProps) {
  const [locateState, setLocateState] = useState<LocateState>("idle");
  const [mode, setMode] = useState<"current" | "manual">("manual");

  function useMyLocation() {
    setMode("current");
    setLocateState("requesting");
    setTimeout(() => {
      setLocateState("granted");
      onChange({
        ...location,
        district: "Ranchi",
        block: "Kanke",
        villageOrTown: "Kanke Road",
        address: "Near Govt. Middle School, Kanke Road, Ranchi, Jharkhand 834006",
        latitude: 23.4239,
        longitude: 85.331,
      });
    }, 1400);
  }

  function field<K extends keyof GeoLocation>(key: K, value: GeoLocation[K]) {
    onChange({ ...location, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useMyLocation}
          className={cn(
            "flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium transition",
            mode === "current"
              ? "border-teal-600 bg-teal-50 text-teal-700"
              : "border-ink-200 bg-surface text-ink-700 hover:bg-surface-sunken"
          )}
        >
          {locateState === "requesting" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : locateState === "granted" && mode === "current" ? (
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
          {locateState === "requesting" ? "Detecting location..." : "Use my location"}
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={cn(
            "rounded border px-3 py-2 text-sm font-medium transition",
            mode === "manual"
              ? "border-teal-600 bg-teal-50 text-teal-700"
              : "border-ink-200 bg-surface text-ink-700 hover:bg-surface-sunken"
          )}
        >
          Enter manually
        </button>
      </div>

      {mode === "current" && locateState === "granted" && (
        <div className="rounded-card border border-teal-500/30 bg-teal-50 px-3 py-2.5 text-sm text-teal-700">
          Detected: {location.address}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">District</label>
          <input
            value={location.district}
            onChange={(e) => field("district", e.target.value)}
            className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">Block</label>
          <input
            value={location.block}
            onChange={(e) => field("block", e.target.value)}
            className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">Village / Town</label>
          <input
            value={location.villageOrTown}
            onChange={(e) => field("villageOrTown", e.target.value)}
            className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">Address</label>
          <input
            value={location.address}
            onChange={(e) => field("address", e.target.value)}
            className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-600">
          Pinpoint on map — the reported location can differ from where you are now
        </label>
        <MapPanel
          latitude={location.latitude}
          longitude={location.longitude}
          onChange={(lat, lng) => onChange({ ...location, latitude: lat, longitude: lng })}
        />
      </div>

      <div className="flex gap-4 text-xs text-ink-500">
        <span>Lat: <span className="font-mono text-ink-700">{location.latitude.toFixed(6)}</span></span>
        <span>Lng: <span className="font-mono text-ink-700">{location.longitude.toFixed(6)}</span></span>
      </div>
    </div>
  );
}
