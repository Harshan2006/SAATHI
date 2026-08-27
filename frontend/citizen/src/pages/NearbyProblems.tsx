import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MapPin, Loader2 } from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import { cn } from "../lib/utils";
import { useToast } from "../components/shared/Toast";
import { api } from "../lib/api";
import type { Complaint } from "../types";

export default function NearbyProblems() {
  const [problems, setProblems] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadProblems() {
      try {
        // Default to Ranchi coordinates if geolocation is unavailable or denied
        let lat = 23.3441;
        let lng = 85.3096;

        if ("geolocation" in navigator) {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
            );
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
          } catch {
            // Geolocation denied or timed out — use defaults
          }
        }

        const data = await api.getNearbyProblems(lat, lng);
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch nearby problems:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  async function toggleSupport(complaintId: string) {
    try {
      const numericId = complaintId.split('-').pop();
      if (!numericId) return;
      
      await api.supportProblem(numericId);
      
      setProblems((prev) =>
        prev.map((p) =>
          p.id === complaintId
            ? { ...p, supportCount: p.supportCount + 1 }
            : p
        )
      );
      showToast("Added your support to this report.", "success");
    } catch (error) {
      showToast("Failed to add support. Are you logged in?", "warning");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">Nearby problems</h2>
        <p className="text-sm text-ink-500">
          Issues reported by other citizens near you. Add your support to help prioritize action.
        </p>
      </div>

      {problems.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {problems.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 rounded-card border border-ink-100 bg-surface p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-ink-400">{p.category}</span>
                <StatusBadge status={p.status} />
              </div>
              <Link to={`/citizen/complaints/${p.id}`} className="text-sm font-semibold text-ink-900 hover:text-teal-700">
                {p.title}
              </Link>
              <span className="flex items-center gap-1 text-xs text-ink-500">
                <MapPin className="h-3.5 w-3.5" /> {p.location.district}
              </span>
              <div className="flex items-center justify-between border-t border-ink-100 pt-3">
                <span className="text-xs text-ink-500">{p.supportCount} people supporting</span>
                <button
                  onClick={() => toggleSupport(p.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition",
                    "border-ink-200 text-ink-600 hover:bg-surface-sunken"
                  )}
                >
                  <ThumbsUp className="h-3.5 w-3.5" /> Support
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-ink-200 p-12 text-center">
          <p className="text-sm text-ink-500">No problems found near your current location.</p>
        </div>
      )}
    </div>
  );
}
