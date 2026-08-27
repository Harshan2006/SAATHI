import { useEffect, useState } from "react";
import { Star, MessageSquareHeart, Loader2 } from "lucide-react";
import FeedbackForm from "../components/feedback/FeedbackForm";
import EmptyState from "../components/shared/EmptyState";
import Modal from "../components/shared/Modal";
import { formatDate, cn } from "../lib/utils";
import { useToast } from "../components/shared/Toast";
import { api } from "../lib/api";
import type { Complaint } from "../types";

export default function MyFeedback() {
  const [feedbackEntries, setFeedbackEntries] = useState<any[]>([]);
  const [pendingComplaints, setPendingComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [resolvedProbs, myFeedback] = await Promise.all([
        api.getProblems(true), // My complaints
        api.getFeedback()
      ]);
      
      const resolved = resolvedProbs.filter(c => c.status === "Resolved");
      const submittedFeedbackIds = new Set(myFeedback.map(f => f.problem_id));
      
      setPendingComplaints(resolved.filter(c => !submittedFeedbackIds.has(parseInt(c.id.split('-').pop() || "0"))));
      setFeedbackEntries(myFeedback);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeComplaint = pendingComplaints.find((c) => c.id === activeComplaintId);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">My feedback</h2>
        <p className="text-sm text-ink-500">Share how well a resolved complaint worked out for you.</p>
      </div>

      {pendingComplaints.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-ink-900">Awaiting your feedback</h3>
          {pendingComplaints.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-3 rounded-card border border-amber-600/30 bg-amber-100/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono text-xs text-ink-400">{c.id}</p>
                <p className="text-sm font-medium text-ink-900">{c.title}</p>
              </div>
              <button
                onClick={() => setActiveComplaintId(c.id)}
                className="rounded bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
              >
                Give feedback
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold text-ink-900">Submitted feedback</h3>
        {feedbackEntries.length > 0 ? (
          feedbackEntries.map((f) => (
            <div key={f.id} className="rounded-card border border-ink-100 bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-ink-400">JH-SAATHI-{f.problem_id}</p>
                  <p className="text-sm font-medium text-ink-900">{f.problem_title}</p>
                </div>
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-medium",
                    f.resolution_status === "Completely"
                      ? "bg-green-100 text-green-600"
                      : f.resolution_status === "Partially"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {f.resolution_status}
                </span>
              </div>
              <div className="mt-2 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn("h-4 w-4", n <= f.rating ? "fill-amber-600 text-amber-600" : "text-ink-200")}
                  />
                ))}
              </div>
              {f.comment && <p className="mt-2 text-sm text-ink-600">{f.comment}</p>}
              <p className="mt-2 text-xs text-ink-400">Submitted on {formatDate(f.created_at)}</p>
            </div>
          ))
        ) : (
          <EmptyState
            icon={MessageSquareHeart}
            title="No feedback submitted yet"
            description="Once a complaint is resolved, you can share how it went here."
          />
        )}
      </div>

      <Modal
        open={!!activeComplaint}
        onClose={() => setActiveComplaintId(null)}
        title={activeComplaint ? `Feedback · ${activeComplaint.id}` : "Feedback"}
      >
        {activeComplaint && (
          <FeedbackForm
            onSubmit={async (data) => {
              try {
                const numericId = activeComplaint.id.split('-').pop();
                await api.submitFeedback({
                  problem_id: parseInt(numericId || "0"),
                  rating: data.rating,
                  comment: data.comment,
                  resolution_status: data.resolution
                });
                setActiveComplaintId(null);
                showToast("Thanks for sharing your feedback.", "success");
                loadData(); // Reload lists
              } catch (err) {
                showToast("Failed to submit feedback", "warning");
              }
            }}
          />
        )}
      </Modal>
    </div>
  );
}
