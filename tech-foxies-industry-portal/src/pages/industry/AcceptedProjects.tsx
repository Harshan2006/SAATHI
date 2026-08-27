import { Link } from "react-router-dom";
import { Landmark, Sparkles, MapPin, ArrowRight, UserCheck } from "lucide-react";
import { industryProjects } from "../../data/industryMockData";

export default function AcceptedProjects() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Accepted / Active Projects</h2>
        <p className="text-sm text-ink-500 mt-1">
          Societal challenges that have been accepted by universities and formulated into active student-led projects.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {industryProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4 hover:border-ink-200 transition"
          >
            {/* Top row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-ink-400 uppercase">
                  <span>{project.id}</span>
                  <span>•</span>
                  <span>{project.category}</span>
                </div>
                <h3 className="font-semibold text-ink-900 text-base sm:text-lg mt-1">{project.title}</h3>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-500 mt-1.5">
                  <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {project.location.district}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Landmark className="h-3 w-3" /> {project.universityName}</span>
                </div>
              </div>

              <div className="shrink-0">
                <div className="flex items-center gap-1 bg-teal-50 border border-teal-100 px-3 py-1 rounded text-xs font-bold text-teal-700 w-fit">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{project.matchScore}% Match</span>
                </div>
              </div>
            </div>

            {/* University Details Panel */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 bg-surface-alt p-3.5 rounded border border-ink-100 text-xs">
              <div className="space-y-0.5">
                <span className="text-ink-400 font-semibold block uppercase text-[10px]">Research Department</span>
                <p className="font-medium text-ink-800">{project.department}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-ink-400 font-semibold block uppercase text-[10px]">Faculty Mentor</span>
                <p className="font-medium text-ink-800 flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  {project.facultyMentor.name}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-ink-400 font-semibold block uppercase text-[10px]">Student Team Size</span>
                <p className="font-medium text-ink-800">{project.studentTeam.length} members active</p>
              </div>
            </div>

            {/* Stage and Progress bar */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-ink-100 pt-3">
              <div>
                <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                  <span>Development Stage: <span className="font-bold text-ink-700">{project.projectStage}</span></span>
                  <span className="font-bold text-ink-950">{project.progress}%</span>
                </div>
                <div className="w-full bg-ink-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500 sm:justify-end sm:items-end sm:pb-0.5">
                <span>Required Support:</span>
                {project.requiredSupport.map((sup, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-teal-50 text-teal-700 px-2 py-0.5 font-semibold text-[10px]"
                  >
                    {sup}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-ink-100 pt-4">
              <div className="text-xs text-ink-500">
                Community Impact: <span className="font-semibold text-ink-750">Est. {project.affectedPopulation.toLocaleString()} beneficiaries</span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/projects/${project.id}`}
                  className="rounded bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition flex items-center gap-1"
                >
                  View Full Project <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
