import { useState } from "react";
import { FileCheck, HelpCircle } from "lucide-react";
import { fundingRecords } from "../../data/industryMockData";
import { useToast } from "../../components/shared/Toast";
import { cn } from "../../lib/utils";

export default function FundingDashboard() {
  const { showToast } = useToast();
  const [records, setRecords] = useState(fundingRecords);

  const totalCommitted = records.reduce((sum, r) => sum + r.committed, 0);
  const totalDisbursed = records.reduce((sum, r) => sum + r.disbursed, 0);
  const totalPending = totalCommitted - totalDisbursed;

  const handleApproveDisbursement = (projectId: string, phaseIndex: number, amount: number) => {
    setRecords(
      records.map((r) => {
        if (r.projectId === projectId) {
          const nextBreakdown = r.breakdown.map((b, i) => {
            if (i === phaseIndex) {
              return {
                ...b,
                status: "Completed" as const,
                disbursementDate: new Date().toISOString().split("T")[0],
              };
            }
            return b;
          });

          // Recompute disbursed
          const nextDisbursed = r.disbursed + amount;
          showToast(`Disbursement of ₹${amount.toLocaleString()} approved.`, "success");
          return {
            ...r,
            disbursed: nextDisbursed,
            breakdown: nextBreakdown,
            status: nextDisbursed === r.committed ? ("Fully Disbursed" as const) : ("Partially Disbursed" as const),
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Corporate Funding</h2>
        <p className="text-sm text-ink-500 mt-1">
          Monitor your corporate committed capital, milestone disbursements, and funding statuses.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Committed", value: `₹${totalCommitted.toLocaleString()}`, color: "border-ink-200 text-ink-900" },
          { label: "Total Disbursed", value: `₹${totalDisbursed.toLocaleString()}`, color: "border-green-200 text-green-700 bg-green-50/20" },
          { label: "Pending Milestones", value: `₹${totalPending.toLocaleString()}`, color: "border-amber-200 text-amber-700 bg-amber-50/20" },
        ].map((item, i) => (
          <div key={i} className={cn("rounded-card border p-5 shadow-sm", item.color)}>
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider block">{item.label}</span>
            <p className="mt-2 text-2xl font-extrabold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Funding Records Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-ink-950 uppercase tracking-wider">Milestone Disbursement Controls</h3>

        {records.map((record) => (
          <div
            key={record.projectId}
            className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4"
          >
            {/* Project description row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-ink-100 pb-3">
              <div>
                <h4 className="font-semibold text-ink-900 text-sm sm:text-base">{record.projectTitle}</h4>
                <p className="text-xs text-ink-500 mt-0.5">{record.universityName} • {record.projectId}</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-ink-500">
                  Funded: <span className="font-bold text-ink-800">₹{record.disbursed.toLocaleString()}</span> / ₹{record.committed.toLocaleString()}
                </span>
                <span className={cn(
                  "font-bold px-2 py-0.5 rounded text-[10px]",
                  record.status === "Fully Disbursed"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                )}>
                  {record.status}
                </span>
              </div>
            </div>

            {/* Milestones Breakdown */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-ink-800 uppercase tracking-wider">Funding Tranches</h5>
              
              <div className="space-y-2">
                {record.breakdown.map((tranche, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-surface-alt border border-ink-100 p-3.5 rounded text-xs"
                  >
                    <div className="space-y-0.5 max-w-md">
                      <p className="font-semibold text-ink-900">{tranche.phase}</p>
                      <p className="text-ink-500 text-[10px]"><span className="font-semibold">Requirement:</span> {tranche.condition}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                      <span className="font-bold text-ink-900">₹{tranche.amount.toLocaleString()}</span>
                      
                      {tranche.status === "Completed" ? (
                        <span className="text-green-700 font-semibold flex items-center gap-0.5">
                          <FileCheck className="h-4 w-4" /> Disbursed {tranche.disbursementDate}
                        </span>
                      ) : tranche.status === "Pending Approval" ? (
                        <button
                          onClick={() => handleApproveDisbursement(record.projectId, index, tranche.amount)}
                          className="rounded bg-teal-600 px-3 py-1.5 font-bold text-white hover:bg-teal-700 transition cursor-pointer"
                        >
                          Approve Release
                        </button>
                      ) : (
                        <span className="text-ink-400 font-medium flex items-center gap-0.5">
                          <HelpCircle className="h-4 w-4 text-ink-300" /> Milestone locked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
