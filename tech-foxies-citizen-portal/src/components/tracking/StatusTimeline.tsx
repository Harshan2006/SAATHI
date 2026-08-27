import { Check } from "lucide-react";
import type { TimelineStep } from "../../types";
import { cn, formatDateTime } from "../../lib/utils";

export default function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="rounded-card border border-ink-100 bg-surface p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Problem-to-Impact timeline</h3>
      </div>
      <p className="mb-5 text-xs text-ink-400">
        Every complaint moves through the same seven stages, from citizen report to a completed, field-tested solution.
      </p>

      <ol className="relative">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <li key={step.stage} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px",
                    step.status === "completed" ? "bg-teal-500" : "bg-ink-200"
                  )}
                />
              )}
              <span
                className={cn(
                  "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  step.status === "completed" && "border-teal-600 bg-teal-600 text-white",
                  step.status === "current" && "border-teal-600 bg-surface text-teal-700",
                  step.status === "upcoming" && "border-ink-200 bg-surface text-ink-300"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  idx + 1
                )}
              </span>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      step.status === "upcoming" ? "text-ink-400" : "text-ink-900"
                    )}
                  >
                    {step.stage}
                  </p>
                  {step.status === "current" && (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700">
                      In progress
                    </span>
                  )}
                </div>
                {step.status !== "upcoming" ? (
                  <>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {step.stakeholder} {step.date && `· ${formatDateTime(step.date)}`}
                    </p>
                    {step.description && (
                      <p className="mt-1 text-sm text-ink-600">{step.description}</p>
                    )}
                  </>
                ) : (
                  <p className="mt-0.5 text-xs text-ink-300">Not yet reached</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
