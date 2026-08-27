import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, Hourglass, Plus, Wrench } from "lucide-react";
import StatCard from "../components/shared/StatCard";
import ComplaintCard from "../components/shared/ComplaintCard";
import StatusBadge from "../components/shared/StatusBadge";
import NotificationPanel from "../components/notifications/NotificationPanel";
import EmptyState from "../components/shared/EmptyState";
import { complaints, nearbyProblems, notifications } from "../data/mockData";
import { useAuth } from "../components/shared/Auth";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const submitted = complaints.length;
  const underReview = complaints.filter((c) => c.status === "Under Review" || c.status === "Accepted").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress" || c.status === "University Assigned" || c.status === "Field Testing"
  ).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const recentNotifications = notifications.slice(0, 3);
  const topNearby = nearbyProblems.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-ink-900">
            Welcome back, {currentUser?.name ? currentUser.name.split(" ")[0] : "Citizen"}
          </h2>
          <p className="text-sm text-ink-500">Here's what's happening with your reports and neighbourhood.</p>
        </div>
        <Link
          to="/citizen/report"
          className="flex items-center justify-center gap-2 rounded bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Report a Problem
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Submitted" value={submitted} icon={ClipboardList} accent="teal" />
        <StatCard label="Under Review" value={underReview} icon={Hourglass} accent="amber" />
        <StatCard label="In Progress" value={inProgress} icon={Wrench} accent="blue" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} accent="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-900">Recent complaints</h3>
            <Link to="/citizen/complaints" className="text-xs font-medium text-teal-600 hover:underline">
              View all
            </Link>
          </div>
          {recentComplaints.length > 0 ? (
            <div className="space-y-2.5">
              {recentComplaints.map((c) => (
                <ComplaintCard key={c.id} complaint={c} />
              ))}
            </div>
          ) : (
            <EmptyState icon={ClipboardList} title="No complaints yet" description="Report your first civic issue to get started." />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-900">Recent notifications</h3>
            <Link to="/citizen/notifications" className="text-xs font-medium text-teal-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2.5">
            {recentNotifications.map((n) => (
              <NotificationPanel key={n.id} notification={n} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-900">Nearby problems</h3>
          <Link to="/citizen/nearby" className="text-xs font-medium text-teal-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {topNearby.map((p) => (
            <div key={p.id} className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm">
              <p className="text-xs text-ink-400">{p.category}</p>
              <p className="mt-1 truncate text-sm font-semibold text-ink-900">{p.title}</p>
              <p className="mt-1 text-xs text-ink-500">{p.location}</p>
              <div className="mt-3 flex items-center justify-between">
                <StatusBadge status={p.status} />
                <span className="text-xs font-medium text-ink-500">{p.supportCount} supporting</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
