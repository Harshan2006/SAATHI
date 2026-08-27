import { Link2 } from "lucide-react";
import type { SimilarReport } from "../../types";

export default function SimilarProblemCard({
  report,
  onView,
  onLink,
}: {
  report: SimilarReport;
  onView: () => void;
  onLink: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded border border-ink-200 bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-600">
            {report.similarity}% similarity
          </span>
          <span className="text-[11px] text-ink-400">{report.relatedReportCount} related reports</span>
        </div>
        <p className="truncate text-sm font-medium text-ink-800">{report.title}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={onView}
          className="rounded border border-ink-200 px-2.5 py-1.5 text-xs font-medium text-ink-700 hover:bg-surface-sunken"
        >
          View
        </button>
        <button
          onClick={onLink}
          className="flex items-center gap-1 rounded bg-ink-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-ink-800"
        >
          <Link2 className="h-3.5 w-3.5" /> Link my report
        </button>
      </div>
    </div>
  );
}
