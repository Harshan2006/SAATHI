import type { Priority } from "../../types";
import { cn } from "../../lib/utils";

const PRIORITY_STYLES: Record<Priority, string> = {
  Low: "border-ink-200 text-ink-500",
  Medium: "border-amber-600/40 text-amber-600",
  High: "border-red-600/40 text-red-600",
  Critical: "border-red-600 text-red-600 bg-red-100",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        PRIORITY_STYLES[priority]
      )}
    >
      {priority}
    </span>
  );
}
