import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import type { Complaint } from "../../types";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { formatDate } from "../../lib/utils";

export default function ComplaintCard({ complaint }: { complaint: Complaint }) {
  return (
    <Link
      to={`/citizen/complaints/${complaint.id}`}
      className="group flex flex-col gap-3 rounded-card border border-ink-100 bg-surface p-4 shadow-sm transition hover:border-teal-500/50 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-ink-400">{complaint.id}</span>
          <PriorityBadge priority={complaint.priority} />
        </div>
        <h3 className="truncate text-sm font-semibold text-ink-900">{complaint.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
          <span>{complaint.category}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {complaint.location.villageOrTown}, {complaint.location.district}
          </span>
          <span>{formatDate(complaint.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
        <StatusBadge status={complaint.status} />
        <ChevronRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-teal-600" />
      </div>
    </Link>
  );
}
