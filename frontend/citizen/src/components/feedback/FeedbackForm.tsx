import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

type Resolution = "Completely" | "Partially" | "Not resolved";

interface FeedbackFormProps {
  onSubmit: (data: { resolution: Resolution; rating: number; comment: string }) => void;
}

const OPTIONS: Resolution[] = ["Completely", "Partially", "Not resolved"];

export default function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const canSubmit = resolution !== null && rating > 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">Did the solution resolve your problem?</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setResolution(opt)}
              className={cn(
                "rounded border px-3 py-2.5 text-sm font-medium transition",
                resolution === opt
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-ink-200 bg-surface text-ink-700 hover:bg-surface-sunken"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">Rate your overall experience</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(n)}
              aria-label={`${n} star`}
            >
              <Star
                className={cn(
                  "h-7 w-7 transition",
                  (hoverRating || rating) >= n ? "fill-amber-600 text-amber-600" : "text-ink-200"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink-800">Comments (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Tell us more about how this was resolved..."
          className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <button
        disabled={!canSubmit}
        onClick={() => resolution && onSubmit({ resolution, rating, comment })}
        className="w-full rounded bg-teal-600 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-6"
      >
        Submit feedback
      </button>
    </div>
  );
}
