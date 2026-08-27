import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, Building, CheckCircle, Info, HandCoins, GraduationCap } from "lucide-react";
import { cn } from "../../lib/utils";
import { industryProjects } from "../../data/industryMockData";
import { getIndustryProfile, calculateProjectMatch } from "../../store/industryStore";

export default function AIRecommendations() {
  const profile = getIndustryProfile();
  const [filter, setFilter] = useState<"best" | "impact" | "funding" | "mentorship" | "deployment">("best");

  const filteredRecommendations = useMemo(() => {
    // Dynamic match score inject
    let list = industryProjects.map((p) => {
      const match = calculateProjectMatch(profile, p);
      return {
        ...p,
        matchScore: match.matchScore,
        matchReasons: match.matchReasons,
      };
    });

    if (filter === "best") {
      list.sort((a, b) => b.matchScore - a.matchScore);
    } else if (filter === "impact") {
      list.sort((a, b) => b.affectedPopulation - a.affectedPopulation);
    } else if (filter === "funding") {
      list = list.filter((p) => p.requiredSupport.includes("Funding"));
    } else if (filter === "mentorship") {
      list = list.filter((p) => p.requiredSupport.includes("Mentorship") || p.requiredSupport.includes("Technical Mentorship"));
    } else if (filter === "deployment") {
      list = list.filter((p) => p.projectStage === "Pilot" || p.projectStage === "Testing" || p.projectStage === "Deployment");
    }

    return list;
  }, [filter, profile]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-teal-600 animate-pulse" /> Recommended for Your Company
        </h2>
        <p className="text-sm text-ink-500 mt-1">
          Recommendations are based on your company's technologies, sectors, capabilities and collaboration preferences.
        </p>
      </div>

      {/* Recommended Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-ink-100 pb-3">
        {[
          { id: "best", label: "Best Match (Highest Score)", icon: Sparkles },
          { id: "impact", label: "Highest Impact (Beneficiaries)", icon: TrendingUpIcon },
          { id: "funding", label: "Funding Opportunities", icon: HandCoins },
          { id: "mentorship", label: "Mentorship Opportunities", icon: GraduationCap },
          { id: "deployment", label: "Deployment Ready", icon: CheckCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
              filter === tab.id
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-ink-200 bg-surface text-ink-600 hover:bg-surface-sunken"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Explanatory Banner */}
      <div className="rounded-card border border-teal-100 bg-teal-50/30 p-4 text-xs text-teal-800 flex gap-2.5 items-start">
        <Info className="h-4.5 w-4.5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Matching Engine Insights:</span> We have compared your capabilities
          in <span className="font-semibold">{profile.expertise.technologies.slice(0, 4).join(", ")}</span> against active university requirements in Jharkhand. Matching points represent compatibility in sector, required expertise, and location preferences.
        </div>
      </div>

      {/* Recommendations Feed */}
      <div className="space-y-4">
        {filteredRecommendations.map((project) => (
          <div
            key={project.id}
            className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4 hover:border-ink-200 transition"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-ink-400 uppercase">
                  <span>{project.id}</span>
                  <span>•</span>
                  <span>{project.category}</span>
                </div>
                <h3 className="font-semibold text-ink-900 text-base sm:text-lg mt-1">{project.title}</h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500 mt-1">
                  <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {project.location.district}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Building className="h-3 w-3" /> {project.universityName}</span>
                  <span>•</span>
                  <span className="font-medium text-ink-700 bg-ink-100 px-1.5 py-0.5 rounded text-[10px]">{project.projectStage}</span>
                </div>
              </div>

              <div className="shrink-0">
                <div className="flex items-center gap-1 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded text-sm font-bold text-teal-700 w-fit">
                  <Sparkles className="h-4 w-4" />
                  <span>{project.matchScore}% Match Score</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-ink-600 leading-relaxed border-t border-ink-100 pt-3">
              {project.description}
            </p>

            {/* Why It Matches Section */}
            <div className="bg-surface-alt rounded p-4 border border-ink-100 space-y-2">
              <h4 className="text-xs font-bold text-ink-800 uppercase tracking-wider">Matching Reasoning:</h4>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {project.matchReasons.map((reason, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs text-ink-600">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-ink-100 pt-4">
              <div className="text-xs text-ink-500">
                Expected Beneficiaries: <span className="font-semibold text-ink-700">{project.affectedPopulation.toLocaleString()} people</span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/projects/${project.id}`}
                  className="rounded bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition"
                >
                  View Details & Proposal
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick fallback icon component for simplicity
function TrendingUpIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
