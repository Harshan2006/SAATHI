import { useEffect, useState } from "react";
import { Bell, Loader2, Check } from "lucide-react";
import { useAuth } from "../components/shared/Auth";
import NotificationPanel from "../components/notifications/NotificationPanel";
import SMSNotificationCard from "../components/notifications/SMSNotificationCard";
import EmptyState from "../components/shared/EmptyState";
import { cn } from "../lib/utils";
import { api } from "../lib/api";
import { useToast } from "../components/shared/Toast";

export default function Notifications() {
  const [tab, setTab] = useState<"app" | "sms">("app");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      showToast("Failed to mark notification as read", "warning");
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    try {
      await Promise.all(unread.map(n => api.markNotificationRead(n.id)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast("All notifications marked as read", "success");
    } catch (err) {
      showToast("Failed to mark all as read", "warning");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink-900">Notifications</h2>
          <p className="text-sm text-ink-500">
            Stay updated through in-app alerts regarding your reported issues.
          </p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
          >
            <Check className="h-3.5 w-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="rounded-card border border-ink-100 bg-surface p-4">
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Notification preferences</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          <label className="flex items-center justify-between gap-3 sm:justify-start">
            <span className="text-sm text-ink-700">SMS notifications</span>
            <button
              onClick={() => setSmsEnabled((v) => !v)}
              className={cn(
                "relative h-6 w-11 rounded-full transition",
                smsEnabled ? "bg-teal-600" : "bg-ink-200"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                  smsEnabled ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 sm:justify-start">
            <span className="text-sm text-ink-700">In-app notifications</span>
            <button
              onClick={() => setInAppEnabled((v) => !v)}
              className={cn(
                "relative h-6 w-11 rounded-full transition",
                inAppEnabled ? "bg-teal-600" : "bg-ink-200"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                  inAppEnabled ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="flex gap-2 rounded-card border border-ink-200 bg-surface-alt p-1 w-fit">
        <button
          onClick={() => setTab("app")}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-medium transition",
            tab === "app" ? "bg-surface text-ink-900 shadow-sm" : "text-ink-500"
          )}
        >
          In-app
        </button>
        <button
          onClick={() => setTab("sms")}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-medium transition",
            tab === "sms" ? "bg-surface text-ink-900 shadow-sm" : "text-ink-500"
          )}
        >
          SMS log
        </button>
      </div>

      {tab === "app" ? (
        notifications.length > 0 ? (
          <div className="space-y-2.5">
            {notifications.map((n) => (
              <NotificationPanel 
                key={n.id} 
                notification={{
                  id: n.id,
                  type: n.type,
                  message: n.message,
                  timestamp: n.created_at,
                  read: n.read,
                  complaintId: n.complaint_id ? `JH-SAATHI-${n.complaint_id}` : undefined
                }} 
              />
            ))}
          </div>
        ) : (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
        )
      ) : (
        <div className="space-y-2.5">
          <EmptyState icon={Bell} title="SMS feature coming soon" description="SMS logs will appear here once integration is live." />
        </div>
      )}
    </div>
  );
}
