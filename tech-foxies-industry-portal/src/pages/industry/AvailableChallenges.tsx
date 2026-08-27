import { useState } from "react";
import { MapPin, Sparkles, Calendar, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { availableChallenges } from "../../data/industryMockData";
import { useToast } from "../../components/shared/Toast";

export default function AvailableChallenges() {
  const { showToast } = useToast();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((x) => x !== id));
      showToast("Challenge removed from saved list.", "info");
    } else {
      setSavedIds([...savedIds, id]);
      showToast("Challenge saved to your profile.", "success");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Available Challenges</h2>
        <p className="text-sm text-ink-500 mt-1">
          Government-validated societal challenges that are awaiting university acceptance.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="rounded-card border border-amber-100 bg-amber-50/20 p-4 text-xs text-amber-800 flex gap-2.5 items-start shadow-sm">
        <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Note for Industry Partners:</span> These challenges do not yet have an active university team assigned. If you express interest, we can prioritize matching this challenge with interested research departments and support the initial university-team formation.
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {availableChallenges.map((challenge) => {
          const isSaved = savedIds.includes(challenge.id);
          
          return (
            <div
              key={challenge.id}
              className="rounded-card border border-ink-150 border-dashed bg-surface p-5 shadow-sm space-y-4 hover:border-ink-200 transition"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-ink-400 uppercase">
                    <span>{challenge.id}</span>
                    <span>•</span>
                    <span>{challenge.category}</span>
                  </div>
                  <h3 className="font-semibold text-ink-900 text-base sm:text-lg mt-1">{challenge.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-500 mt-1">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {challenge.district}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" /> Validated {challenge.dateValidated}</span>
                    <span>•</span>
                    <span className={cn(
                      "font-semibold",
                      challenge.priority === "Critical" ? "text-red-600" : challenge.priority === "High" ? "text-amber-600" : "text-blue-600"
                    )}>
                      {challenge.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="flex items-center gap-1 bg-ink-50 border border-ink-100 px-3 py-1 rounded text-xs font-bold text-ink-600 w-fit">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                    <span>{challenge.matchScore}% AI Match</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-ink-600 leading-relaxed">
                {challenge.problemSummary}
              </p>

              {/* Required expertise */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-ink-500 uppercase">Required Skills:</span>
                {challenge.requiredExpertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-surface-alt border border-ink-100 px-2 py-0.5 text-xs text-ink-700"
                  >
                    {exp}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-ink-100 pt-4">
                <div className="text-xs text-ink-500">
                  Estimated beneficiaries: <span className="font-semibold text-ink-700">{challenge.affectedPopulation.toLocaleString()} citizens</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSave(challenge.id)}
                    className={cn(
                      "rounded border px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
                      isSaved
                        ? "border-teal-600 bg-teal-50 text-teal-700"
                        : "border-ink-200 text-ink-700 hover:bg-surface-sunken"
                    )}
                  >
                    {isSaved ? "Saved" : "Save Challenge"}
                  </button>
                  <button
                    onClick={() => showToast(`Expressed interest in challenge ${challenge.id}. Government matching office notified.`, "success")}
                    className="rounded bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition cursor-pointer"
                  >
                    Express Interest
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
