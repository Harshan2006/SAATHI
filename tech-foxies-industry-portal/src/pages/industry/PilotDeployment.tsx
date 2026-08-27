import { MapPin, Building, Activity, CheckCircle } from "lucide-react";
import { pilotDeployments } from "../../data/industryMockData";
import { cn } from "../../lib/utils";

export default function PilotDeployment() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Pilot & Field Deployments</h2>
        <p className="text-sm text-ink-500 mt-1">
          Track field trial executions, units deployed, site selections, and milestones for solutions entering deployment.
        </p>
      </div>

      {/* Deployment Projects List */}
      <div className="space-y-4">
        {pilotDeployments.map((pilot) => {
          const stages = ["Prototype", "Lab Testing", "Field Testing", "Pilot", "Deployment", "Completed"];
          const currentStageIndex = stages.indexOf(pilot.stage);

          return (
            <div
              key={pilot.id}
              className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4"
            >
              {/* Info Row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-ink-900 text-base sm:text-lg">{pilot.projectTitle}</h3>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-500 mt-1">
                    <span className="flex items-center gap-0.5"><Building className="h-3.5 w-3.5 text-ink-400" /> {pilot.universityName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5 text-ink-400" /> {pilot.locationName}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-3 py-1 rounded text-xs font-bold text-teal-700">
                  <Activity className="h-4.5 w-4.5" />
                  <span>{pilot.stage} Stage</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span>Current phase completion</span>
                  <span className="font-bold text-teal-700">{pilot.progress}%</span>
                </div>
                <div className="w-full bg-ink-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${pilot.progress}%` }} />
                </div>
              </div>

              {/* Milestones Flow indicator */}
              <div className="border-t border-ink-100 pt-4">
                <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider block mb-3">Deployment Lifecycle</span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative">
                  {stages.map((stg, index) => {
                    const isPassed = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;

                    return (
                      <div key={stg} className="flex items-center gap-2 sm:flex-col sm:items-center sm:text-center sm:flex-1">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold border transition",
                            isPassed
                              ? "bg-teal-600 text-white border-teal-600"
                              : isCurrent
                              ? "bg-teal-50 border-teal-500 text-teal-700 ring-2 ring-teal-100"
                              : "bg-surface border-ink-200 text-ink-400"
                          )}
                        >
                          {isPassed ? <CheckCircle className="h-3.5 w-3.5" /> : index + 1}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isPassed ? "text-ink-600" : isCurrent ? "text-teal-700 font-bold" : "text-ink-400"
                          )}
                        >
                          {stg}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deployment Details Box */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 bg-surface-alt p-3.5 rounded border border-ink-100 text-xs">
                <div className="space-y-0.5">
                  <span className="text-ink-400 font-semibold block text-[10px] uppercase">Commencement</span>
                  <p className="font-semibold text-ink-800">{pilot.startDate}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-ink-400 font-semibold block text-[10px] uppercase">Target Scope</span>
                  <p className="font-semibold text-ink-800">{pilot.targetUnits} Field Units</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-ink-400 font-semibold block text-[10px] uppercase">Deployed Units</span>
                  <p className="font-semibold text-ink-800">{pilot.deployedUnits} / {pilot.targetUnits}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-ink-400 font-semibold block text-[10px] uppercase">Est. Beneficiaries</span>
                  <p className="font-semibold text-ink-800">{pilot.beneficiariesCount.toLocaleString()} citizens</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
