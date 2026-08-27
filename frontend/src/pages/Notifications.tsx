import { useState } from "react";
import { Bell } from "lucide-react";
import { notifications as initialNotifications } from "../data/mockData";
import { useAuth } from "../components/shared/Auth";
import NotificationPanel from "../components/notifications/NotificationPanel";
import SMSNotificationCard from "../components/notifications/SMSNotificationCard";
import EmptyState from "../components/shared/EmptyState";
import { cn } from "../lib/utils";

export default function Notifications() {
  const [tab, setTab] = useState<"app" | "sms">("app");
  const [notifications] = useState(initialNotifications);
  const { currentUser } = useAuth();
  const [smsEnabled, setSmsEnabled] = useState(currentUser?.preferences.smsEnabled ?? true);
  const [inAppEnabled, setInAppEnabled] = useState(currentUser?.preferences.inAppEnabled ?? true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">Notifications</h2>
        <p className="text-sm text-ink-500">
          Stay updated through in-app alerts and SMS, sent directly to your registered mobile number.
        </p>
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
              <NotificationPanel key={n.id} notification={n} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
        )
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <SMSNotificationCard key={n.id} message={n.smsMessage} timestamp={n.timestamp} />
          ))}
        </div>
      )}
    </div>
  );
}
