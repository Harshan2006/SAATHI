import { useState } from "react";
import { Star, MessageSquareHeart } from "lucide-react";
import { complaints, feedbackEntries as initialFeedback } from "../data/mockData";
import FeedbackForm from "../components/feedback/FeedbackForm";
import EmptyState from "../components/shared/EmptyState";
import Modal from "../components/shared/Modal";
import { formatDate, cn } from "../lib/utils";
import { useToast } from "../components/shared/Toast";

export default function MyFeedback() {
  const [feedbackEntries, setFeedbackEntries] = useState(initialFeedback);
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const { showToast } = useToast();

  const pendingFeedback = complaints.filter(
    (c) => c.status === "Resolved" && !feedbackEntries.some((f) => f.complaintId === c.id)
  );

  const activeComplaint = complaints.find((c) => c.id === activeComplaintId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">My feedback</h2>
        <p className="text-sm text-ink-500">Share how well a resolved complaint worked out for you.</p>
      </div>

      {pendingFeedback.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-ink-900">Awaiting your feedback</h3>
          {pendingFeedback.map((c) => (
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
                  <p className="font-mono text-xs text-ink-400">{f.complaintId}</p>
                  <p className="text-sm font-medium text-ink-900">{f.complaintTitle}</p>
                </div>
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-medium",
                    f.resolution === "Completely"
                      ? "bg-green-100 text-green-600"
                      : f.resolution === "Partially"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {f.resolution}
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
              <p className="mt-2 text-xs text-ink-400">Submitted on {formatDate(f.submittedAt)}</p>
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
            onSubmit={(data) => {
              setFeedbackEntries((prev) => [
                {
                  id: `f-${Date.now()}`,
                  complaintId: activeComplaint.id,
                  complaintTitle: activeComplaint.title,
                  resolution: data.resolution,
                  rating: data.rating,
                  comment: data.comment,
                  submittedAt: new Date().toISOString(),
                },
                ...prev,
              ]);
              setActiveComplaintId(null);
              showToast("Thanks for sharing your feedback.", "success");
            }}
          />
        )}
      </Modal>
    </div>
  );
}
