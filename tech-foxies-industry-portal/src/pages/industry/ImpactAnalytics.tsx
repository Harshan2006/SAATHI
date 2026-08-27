import { TrendingUp, Award, MapPin, Smile } from "lucide-react";
import { impactMetrics } from "../../data/industryMockData";

export default function ImpactAnalytics() {
  const totalBeneficiaries = impactMetrics.reduce((sum, m) => sum + m.beneficiaries, 0);
  const totalFunding = impactMetrics.reduce((sum, m) => sum + m.fundingContributed, 0);
  const totalHours = impactMetrics.reduce((sum, m) => sum + m.mentorshipHours, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Social Impact Analytics</h2>
        <p className="text-sm text-ink-500 mt-1">
          Measure and audit the societal outcomes created by your company's funding and technical guidance.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Community Beneficiaries", value: `${totalBeneficiaries.toLocaleString()}+ residents`, icon: Smile, color: "text-teal-600 bg-teal-50/20 border-teal-200" },
          { label: "Mentorship Hours Contributed", value: `${totalHours} Hours`, icon: Award, color: "text-amber-600 bg-amber-50/20 border-amber-200" },
          { label: "Social Capital Disbursed", value: `₹${totalFunding.toLocaleString()}`, icon: TrendingUp, color: "text-green-600 bg-green-50/20 border-green-200" },
        ].map((item, i) => (
          <div key={i} className={`rounded-card border p-5 shadow-sm flex items-center justify-between ${item.color}`}>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block opacity-90">{item.label}</span>
              <p className="mt-1 text-base sm:text-xl font-extrabold">{item.value}</p>
            </div>
            <item.icon className="h-7 w-7 shrink-0 opacity-80" />
          </div>
        ))}
      </div>

      {/* Impact Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider">Before-vs-After Operational Metrics</h3>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {impactMetrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-bold text-ink-400">{metric.sector}</span>
                  <span className="flex items-center gap-0.5 text-xs text-ink-500 font-medium">
                    <MapPin className="h-3 w-3" /> {metric.district}
                  </span>
                </div>
                <h4 className="font-semibold text-ink-900 text-sm sm:text-base leading-snug">{metric.projectTitle}</h4>
                <p className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded w-fit">
                  {metric.metricLabel}
                </p>
              </div>

              {/* Before vs After comparison layout */}
              <div className="grid grid-cols-2 gap-3 bg-surface-alt p-3.5 rounded border border-ink-100 text-xs">
                <div className="space-y-0.5 border-r border-ink-200 pr-2">
                  <span className="text-[9px] uppercase font-bold text-ink-400">Baseline (Before)</span>
                  <p className="font-semibold text-red-600">{metric.beforeValue}</p>
                </div>
                <div className="space-y-0.5 pl-2">
                  <span className="text-[9px] uppercase font-bold text-ink-400">Outcome (After)</span>
                  <p className="font-semibold text-green-700 flex items-center gap-0.5">
                    <TrendingUp className="h-3.5 w-3.5 text-green-600 shrink-0" />
                    {metric.afterValue}
                  </p>
                </div>
              </div>

              {/* Contributed metrics footer */}
              <div className="border-t border-ink-100 pt-3 text-[11px] text-ink-500 flex justify-between">
                <span>Beneficiaries: <span className="font-bold text-ink-800">{metric.beneficiaries.toLocaleString()}</span></span>
                <span>Hours: <span className="font-bold text-ink-850">{metric.mentorshipHours}h</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
