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
        const data = await api.getProblems();
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch nearby problems:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  function toggleSupport(id: string) {
    // This is currently frontend-only since support functionality isn't in backend yet
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, supportCount: p.supportCount + 1 }
          : p
      )
    );
    showToast("Added your support to this report.", "success");
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
    </div>
  );
}
