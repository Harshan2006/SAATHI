import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Search, Loader2 } from "lucide-react";
import ComplaintCard from "../components/shared/ComplaintCard";
import EmptyState from "../components/shared/EmptyState";
import type { Complaint, ComplaintStatus } from "../types";
import { cn } from "../lib/utils";
import { api } from "../lib/api";

const FILTERS: Array<{ label: string; value: ComplaintStatus | "All" }> = [
  { label: "All", value: "All" },
  { label: "Under Review", value: "Under Review" },
  { label: "In Progress", value: "In Progress" },
  { label: "University Assigned", value: "University Assigned" },
  { label: "Resolved", value: "Resolved" },
];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ComplaintStatus | "All">("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadComplaints() {
      try {
        const data = await api.getProblems();
        setComplaints(data);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      } finally {
        setLoading(false);
      }
    }
    loadComplaints();
  }, []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesFilter = filter === "All" || c.status === filter;
      const matchesQuery =
        query.trim() === "" ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [complaints, filter, query]);

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
        <h2 className="text-lg font-semibold text-ink-900">My complaints</h2>
        <p className="text-sm text-ink-500">Track every issue you've reported, from submission to resolution.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                filter === f.value
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-ink-200 bg-surface text-ink-600 hover:bg-surface-sunken"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or ID..."
            className="w-full rounded border border-ink-200 bg-surface py-2 pl-8 pr-3 text-sm focus:border-teal-500 focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2.5">
          {filtered.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No complaints match"
          description="Try a different filter or search term."
        />
      )}
    </div>
  );
}
