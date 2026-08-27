import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Film, ImageIcon, MapPin, Sparkles, Users, Loader2, GraduationCap, Building2 } from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";
import StatusTimeline from "../components/tracking/StatusTimeline";
import EmptyState from "../components/shared/EmptyState";
import { formatDate } from "../lib/utils";
import { api, type Match, type UniversityMatch } from "../lib/api";
import type { Complaint } from "../types";

const FILE_ICONS = { image: ImageIcon, video: Film, document: FileText };

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [universities, setUniversities] = useState<UniversityMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [complaintData, facultyMatches, uniMatches] = await Promise.all([
          api.getProblem(id),
          api.getMatches(id),
          api.getUniversityMatches(id)
        ]);
        setComplaint(complaintData);
        setMatches(facultyMatches);
        setUniversities(uniMatches);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="space-y-4">
        <Link to="/citizen/complaints" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
          <ArrowLeft className="h-4 w-4" /> Back to complaints
        </Link>
        <EmptyState icon={FileText} title="Complaint not found" description={`No complaint matches ID ${id}.`} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Link to="/citizen/complaints" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4" /> Back to complaints
      </Link>

      <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-ink-400">{complaint.id}</p>
            <h2 className="mt-1 text-lg font-semibold text-ink-900">{complaint.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        <p className="mt-3 text-sm text-ink-600 whitespace-pre-wrap">{complaint.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-medium text-ink-400">Category</p>
            <p className="text-sm font-medium text-ink-800">{complaint.category}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-ink-400">Location</p>
            <p className="flex items-center gap-1 text-sm font-medium text-ink-800">
              <MapPin className="h-3.5 w-3.5 text-ink-400" /> {complaint.location.district}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-ink-400">Reported on</p>
            <p className="text-sm font-medium text-ink-800">{formatDate(complaint.createdAt)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-ink-400">Community support</p>
            <p className="flex items-center gap-1 text-sm font-medium text-ink-800">
              <Users className="h-3.5 w-3.5 text-ink-400" /> {complaint.supportCount}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <StatusTimeline steps={complaint.timeline} />

          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-teal-600" />
                <h3 className="text-base font-semibold text-ink-900">Recommended Experts</h3>
             </div>
             {matches.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {matches.map(m => (
                        <div key={m.id} className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-ink-900">{m.name}</p>
                                    <p className="text-xs text-ink-500">{m.designation}, {m.department}</p>
                                    <p className="mt-1 text-sm text-teal-700 font-medium">{m.university_name}</p>
                                </div>
                                <div className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700 border border-teal-100">
                                    {Math.max(0, Math.round(m.similarity * 100))}% Match
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-ink-600">Expertise: {m.expertise}</p>
                        </div>
                    ))}
                </div>
             ) : (
                <div className="rounded-card border border-dashed border-ink-200 p-8 text-center bg-surface-alt">
                    <p className="text-sm text-ink-500">Matching in progress. Our AI is finding the best experts for this challenge.</p>
                </div>
             )}
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                <h3 className="text-base font-semibold text-ink-900">Recommended Universities</h3>
             </div>
             {universities.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {universities.map((u, index) => (
                        <div key={u.id} className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-ink-900">{u.name}</p>
                                    <p className="text-xs text-ink-500">{u.location}</p>
                                </div>
                                <div className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 border border-blue-100">
                                    {index === 0 ? "Top recommendation" : `${Math.round(u.similarity * 100)}% match`}
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-ink-600 line-clamp-2">{u.description}</p>
                        </div>
                    ))}
                </div>
             ) : (
                <div className="rounded-card border border-dashed border-ink-200 bg-surface-alt p-8 text-center">
                    <p className="text-sm font-medium text-ink-700">No university recommendations yet</p>
                    <p className="mt-1 text-xs text-ink-500">Recommendations will appear after matching faculty expertise to this complaint.</p>
                </div>
             )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-card border border-ink-100 bg-surface p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <h3 className="text-sm font-semibold text-ink-900">AI analysis</h3>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Subcategory</dt>
                <dd className="font-medium text-ink-800">{complaint.aiAnalysis.subcategory}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Est. affected</dt>
                <dd className="font-medium text-ink-800">
                  ~{complaint.aiAnalysis.affectedPopulationEstimate.toLocaleString("en-IN")}
                </dd>
              </div>
            </dl>
            {complaint.aiAnalysis.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                {complaint.aiAnalysis.keywords.map((k) => (
                    <span key={k} className="rounded bg-surface-sunken px-2 py-0.5 text-xs text-ink-600">
                    {k}
                    </span>
                ))}
                </div>
            )}
            {complaint.aiAnalysis.keywords.length === 0 && (
                <p className="mt-2 text-xs text-ink-400 italic">Processing analysis...</p>
            )}
          </div>

          <div className="rounded-card border border-ink-100 bg-surface p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Evidence gallery</h3>
            {complaint.evidence.length > 0 ? (
              <div className="space-y-2">
                {complaint.evidence.map((f) => {
                  const Icon = FILE_ICONS[f.type] || FileText;
                  return (
                    <div key={f.id} className="flex items-center gap-2.5 rounded border border-ink-100 p-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-surface-sunken">
                        <Icon className="h-4 w-4 text-ink-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-ink-700">{f.name}</p>
                        <p className="text-[11px] text-ink-400">{f.sizeLabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-ink-400">No evidence attached.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
