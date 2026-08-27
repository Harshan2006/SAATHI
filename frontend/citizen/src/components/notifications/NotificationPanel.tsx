import { Link } from "react-router-dom";
import {
  CheckCircle2,
  GraduationCap,
  Hammer,
  PartyPopper,
  Sparkles,
  Star,
  Bell,
} from "lucide-react";
import type { AppNotification, NotificationType } from "../../types";
import { timeAgo } from "../../lib/utils";
import { cn } from "../../lib/utils";

const TYPE_META: Record<string, { icon: any; accent: string }> = {
  "Complaint Accepted": { icon: CheckCircle2, accent: "bg-blue-100 text-blue-600" },
  "University/Expert Assigned": { icon: GraduationCap, accent: "bg-teal-100 text-teal-700" },
  "Complaint In Progress": { icon: Hammer, accent: "bg-amber-100 text-amber-600" },
  "Solution Ready": { icon: Sparkles, accent: "bg-teal-100 text-teal-700" },
  "Complaint Completed": { icon: PartyPopper, accent: "bg-green-100 text-green-600" },
  "Feedback Requested": { icon: Star, accent: "bg-amber-100 text-amber-600" },
  "Submission": { icon: Bell, accent: "bg-teal-50 text-teal-600" },
  "Analysis": { icon: Sparkles, accent: "bg-purple-100 text-purple-600" },
  "Match": { icon: GraduationCap, accent: "bg-indigo-100 text-indigo-600" },
};

export default function NotificationPanel({ notification }: { notification: any }) {
  const meta = TYPE_META[notification.type] || { icon: Bell, accent: "bg-gray-100 text-gray-600" };
  const Icon = meta.icon;

  const internalId = notification.complaintId || "";
  // Ensure we have a valid link
  const link = internalId ? `/citizen/complaints/${internalId}` : "/citizen/notifications";

  return (
    <Link
      to={link}
      className={cn(
        "flex gap-3 rounded-card border border-ink-100 bg-surface p-4 transition hover:border-teal-500/40 hover:shadow-sm",
        !notification.read && "bg-teal-50/40"
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", meta.accent)}>
        <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-ink-900">{notification.type}</p>
          {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-600" />}
        </div>
        <p className="mt-0.5 text-sm text-ink-600">{notification.message}</p>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-400">
          {internalId && <span className="font-mono">{internalId}</span>}
          {internalId && <span>·</span>}
          <span>{timeAgo(notification.timestamp)}</span>
        </div>
      </div>
    </Link>
  );
}
