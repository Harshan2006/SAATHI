import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, Hourglass, Plus, Wrench, Loader2, Bell, MapPin } from "lucide-react";
import StatCard from "../components/shared/StatCard";
import ComplaintCard from "../components/shared/ComplaintCard";
import StatusBadge from "../components/shared/StatusBadge";
import NotificationPanel from "../components/notifications/NotificationPanel";
import EmptyState from "../components/shared/EmptyState";
import { useAuth } from "../components/shared/Auth";
import { api } from "../lib/api";
import type { Complaint } from "../types";

export default function Dashboard() {
  const { currentUser, refreshUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [nearby, setNearby] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        await refreshUser(); // Get latest user stats
        const [probs, notifs] = await Promise.all([
          api.getProblems(true), // My complaints
          api.getNotifications()
        ]);
        setComplaints(probs);
        setNotifications(notifs);

        // Ranchi center as default
        const lat = 23.3441, lng = 85.3096;
        const nearbyData = await api.getNearbyProblems(lat, lng);
        setNearby(nearbyData);
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const stats = currentUser?.stats || { submitted: 0, resolved: 0, inProgress: 0 };
  const recentComplaints = complaints.slice(0, 3);
  const recentNotifications = notifications.slice(0, 3);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

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
        <StatCard label="Submitted" value={stats.submitted} icon={ClipboardList} accent="teal" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Wrench} accent="blue" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accent="green" />
        <StatCard label="Unread" value={notifications.filter(n => !n.read).length} icon={Bell} accent="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-900">My recent complaints</h3>
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
            {recentNotifications.length > 0 ? (
              recentNotifications.map((n) => (
                <NotificationPanel key={n.id} notification={{
                  id: n.id, type: n.type, message: n.message, timestamp: n.created_at, read: n.read,
                  complaintId: n.complaint_id ? `JH-SAATHI-${n.complaint_id}` : undefined
                }} />
              ))
            ) : (
              <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
            )}
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
          {nearby.slice(0, 3).map((p) => (
            <Link key={p.id} to={`/citizen/complaints/${p.id}`} className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm hover:border-teal-500/50">
              <p className="text-xs text-ink-400">{p.category}</p>
              <p className="mt-1 truncate text-sm font-semibold text-ink-900">{p.title}</p>
              <p className="mt-1 text-xs text-ink-500">Jharkhand</p>
              <div className="mt-3 flex items-center justify-between">
                <StatusBadge status={p.status} />
                <span className="text-xs font-medium text-ink-500">{p.supportCount} supporting</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
