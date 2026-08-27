import { Link } from "react-router-dom";
import {
  HandCoins,
  GraduationCap,
  FolderLock,
  Sparkles,
  ArrowRight,
  MapPin,
  Building,
  CheckCircle,
  Building2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  industryProjects,
  activeCollaborations,
  fundingRecords,
  mentorshipSessions,
  pilotDeployments,
} from "../../data/industryMockData";
import { getIndustryProfile, calculateProjectMatch } from "../../store/industryStore";

export default function IndustryDashboard() {
  const profile = getIndustryProfile();

  const activeCollabsCount = activeCollaborations.length;
  const projectsSupportedCount = fundingRecords.length + activeCollaborations.length; 
  const totalFundingCommitted = fundingRecords.reduce((sum, r) => sum + r.committed, 0);
  const totalStudentsMentored = mentorshipSessions
    .filter((s) => s.status === "Completed" || s.status === "Scheduled")
    .reduce((sum, s) => sum + s.studentsCount, 0);
  const solutionsDeployed = pilotDeployments.filter((p) => p.stage === "Deployment" || p.stage === "Completed").length;


  // Dynamically calculate matching scores for available projects
  const recommendations = [...industryProjects]
    .map((proj) => {
      const match = calculateProjectMatch(profile, proj);
      return {
        ...proj,
        matchScore: match.matchScore,
        matchReasons: match.matchReasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-teal-50 border border-teal-150">
            <Building2 className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink-900">
              {profile.company.companyName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500 mt-1.5 font-medium">
              <span>{profile.company.companyType}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {profile.company.city}, {profile.company.state}</span>
            </div>
          </div>
        </div>

        {/* Profile completion & Verification */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider block">Profile Completeness</span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-ink-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${profile.completeness}%` }} />
              </div>
              <span className="font-bold text-ink-800">{profile.completeness}%</span>
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-ink-150 sm:pl-4">
            <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider block">Verification Status</span>
            <span className={cn(
              "font-bold px-2 py-0.5 rounded text-[10px] uppercase inline-block border",
              profile.verification.status === "Verified"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            )}>
              {profile.verification.status}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Active Collaborations", value: activeCollabsCount, icon: FolderLock, color: "text-blue-600" },
          { label: "Projects Supported", value: projectsSupportedCount, icon: Building, color: "text-teal-600" },
          { label: "Funding Committed", value: `₹${(totalFundingCommitted / 100000).toFixed(1)}L`, icon: HandCoins, color: "text-green-600" },
          { label: "Students Mentored", value: totalStudentsMentored, icon: GraduationCap, color: "text-amber-600" },
          { label: "Solutions Deployed", value: solutionsDeployed, icon: CheckCircle, color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Snapshot and AI Matching Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Company Snapshot */}
        <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
          <div className="border-b border-ink-100 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider">Company Profile Snapshot</h3>
            <Link to="/industry/profile" className="text-xs font-bold text-teal-600 hover:underline">
              View Profile
            </Link>
          </div>

          <div className="space-y-3.5 text-xs text-ink-700">
            <p className="leading-relaxed text-ink-600 italic">"{profile.company.description}"</p>
            
            <div className="space-y-1">
              <span className="font-bold text-ink-800 uppercase text-[10px]">Capabilities:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.expertise.technologies.slice(0, 5).map((cap) => (
                  <span key={cap} className="bg-ink-100 px-1.5 py-0.5 rounded text-[10px] font-medium">{cap}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-bold text-ink-800 uppercase text-[10px] block">Preferred Stages:</span>
                <p className="font-semibold text-ink-900 mt-0.5">{profile.preferences.projectStages.join(", ") || "None"}</p>
              </div>
              <div>
                <span className="font-bold text-ink-800 uppercase text-[10px] block">Preferred Sectors:</span>
                <p className="font-semibold text-ink-900 mt-0.5">{profile.preferences.sectors.join(", ") || "None"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Matching Info */}
        <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
          <div className="border-b border-ink-100 pb-3">
            <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">AI Matching Profile</h3>
          </div>

          <p className="text-xs text-ink-500 leading-relaxed">
            Projects are recommended based on your organization's expertise, technologies, support capabilities, sectors and collaboration preferences.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs border-t border-ink-100 pt-3">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider block">Technologies Matched</span>
              <p className="font-semibold text-ink-900 truncate">{profile.expertise.technologies.slice(0, 3).join(", ")}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider block">Domains</span>
              <p className="font-semibold text-ink-900 truncate">{profile.expertise.domains.slice(0, 2).join(", ") || "None"}</p>
            </div>
            <div className="space-y-1 border-t border-ink-100 pt-2.5">
              <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider block">Preferred Stages</span>
              <p className="font-semibold text-ink-900 truncate">{profile.preferences.projectStages.join(", ")}</p>
            </div>
            <div className="space-y-1 border-t border-ink-100 pt-2.5">
              <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider block">Support offered</span>
              <p className="font-semibold text-ink-900 truncate">{profile.support.capabilities.slice(0, 2).join(", ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-teal-600" /> Dynamic AI Recommendations
          </h3>
          <Link to="/industry/recommendations" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-0.5">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {recommendations.map((proj) => (
            <div
              key={proj.id}
              className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm hover:border-ink-200 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-ink-900 text-sm sm:text-base">{proj.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500 mt-1">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {proj.location.district}</span>
                    <span>•</span>
                    <span>{proj.universityName || "Unaccepted"}</span>
                    <span>•</span>
                    <span className="font-medium text-ink-700 bg-ink-100 px-1.5 py-0.5 rounded text-[10px]">
                      {proj.projectStage}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700 border border-teal-100">
                    {proj.matchScore}% Match
                  </span>
                </div>
              </div>

              <div className="bg-surface-alt rounded p-3 text-xs border border-ink-100 text-ink-600">
                <span className="font-semibold text-ink-800">Why it matches:</span> {proj.matchReasons[0]}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-3">
                <div className="text-xs text-ink-500">
                  Required support: <span className="font-semibold text-ink-700">{proj.requiredSupport.slice(0, 2).join(", ")}</span>
                </div>
                <Link
                  to={`/industry/projects/${proj.id}`}
                  className="rounded bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 transition"
                >
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
