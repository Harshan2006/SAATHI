import { Sparkles, Users } from "lucide-react";
import type { AIAnalysis } from "../../types";
import PriorityBadge from "../shared/PriorityBadge";
import SimilarProblemCard from "./SimilarProblemCard";
import { useToast } from "../shared/Toast";

export default function AIAnalysisCard({
  analysis,
  onContinue,
}: {
  analysis: AIAnalysis;
  onContinue: () => void;
}) {
  const { showToast } = useToast();

  return (
    <div className="rounded-card border border-ink-200 bg-surface">
      <div className="flex items-center gap-2 border-b border-ink-100 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-teal-50">
          <Sparkles className="h-4 w-4 text-teal-600" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-semibold text-ink-900">AI analysis</p>
        <span className="ml-auto text-[11px] font-medium text-ink-400">Auto-generated, editable by reviewers</span>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 py-4 sm:grid-cols-4">
        <div>
          <p className="text-[11px] font-medium text-ink-400">Category</p>
          <p className="text-sm font-medium text-ink-800">{analysis.category}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-ink-400">Subcategory</p>
          <p className="text-sm font-medium text-ink-800">{analysis.subcategory}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-ink-400">Priority</p>
          <PriorityBadge priority={analysis.priority} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-ink-400">Est. affected</p>
          <p className="flex items-center gap-1 text-sm font-medium text-ink-800">
            <Users className="h-3.5 w-3.5 text-ink-400" /> ~{analysis.affectedPopulationEstimate.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="border-t border-ink-100 px-4 py-3">
        <p className="mb-1.5 text-[11px] font-medium text-ink-400">Keywords detected</p>
        <div className="flex flex-wrap gap-1.5">
          {analysis.keywords.map((k) => (
            <span key={k} className="rounded bg-surface-sunken px-2 py-0.5 text-xs text-ink-600">
              {k}
            </span>
          ))}
        </div>
      </div>

      {analysis.similarReports.length > 0 && (
        <div className="space-y-2 border-t border-ink-100 px-4 py-3">
          <p className="text-[11px] font-medium text-ink-400">Possible duplicate reports nearby</p>
          {analysis.similarReports.map((r) => (
            <SimilarProblemCard
              key={r.id}
              report={r}
              onView={() => showToast(`Opening ${r.id}`, "info")}
              onLink={() => showToast("Your report has been linked to the existing complaint.", "success")}
            />
          ))}
        </div>
      )}

      <div className="flex justify-end border-t border-ink-100 px-4 py-3">
        <button
          onClick={onContinue}
          className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
