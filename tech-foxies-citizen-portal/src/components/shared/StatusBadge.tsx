import type { ComplaintStatus } from "../../types";
import { cn } from "../../lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Submitted: "bg-gray-100 text-ink-600",
  "Under Review": "bg-amber-100 text-amber-600",
  Accepted: "bg-blue-100 text-blue-600",
  "Government Validation": "bg-blue-100 text-blue-600",
  "University Assigned": "bg-teal-100 text-teal-700",
  "In Progress": "bg-blue-100 text-blue-600",
  "Field Testing": "bg-teal-100 text-teal-700",
  Resolved: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
};

export default function StatusBadge({ status }: { status: ComplaintStatus | string }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-ink-600";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        style
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
