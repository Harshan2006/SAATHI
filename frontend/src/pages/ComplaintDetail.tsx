import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Film, ImageIcon, MapPin, Sparkles, Users, Loader2 } from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import PriorityBadge from "../components/shared/PriorityBadge";
import StatusTimeline from "../components/tracking/StatusTimeline";
import EmptyState from "../components/shared/EmptyState";
import { formatDate } from "../lib/utils";
import { api } from "../lib/api";
import type { Complaint } from "../types";

const FILE_ICONS = { image: ImageIcon, video: Film, document: FileText };

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComplaint() {
      if (!id) return;
      try {
        const data = await api.getProblem(id);
        setComplaint(data);
      } catch (error) {
        console.error("Failed to fetch complaint detail:", error);
      } finally {
        setLoading(false);
      }
    }
    loadComplaint();
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
    <div className="space-y-6">
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

        <p className="mt-3 text-sm text-ink-600">{complaint.description}</p>

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
        <div className="lg:col-span-2">
          <StatusTimeline steps={complaint.timeline} />
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
            <div className="mt-3 flex flex-wrap gap-1.5">
              {complaint.aiAnalysis.keywords.map((k) => (
                <span key={k} className="rounded bg-surface-sunken px-2 py-0.5 text-xs text-ink-600">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ink-100 bg-surface p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Evidence gallery</h3>
            {complaint.evidence.length > 0 ? (
              <div className="space-y-2">
                {complaint.evidence.map((f) => {
                  const Icon = FILE_ICONS[f.type];
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
