import { useState } from "react";
import { Mail, MapPin, Phone, ShieldCheck, CalendarDays, LogOut } from "lucide-react";
import { useAuth } from "../components/shared/Auth";
import { formatDate, cn } from "../lib/utils";
import { useToast } from "../components/shared/Toast";

export default function Profile() {
  const { showToast } = useToast();
  const { currentUser, logout } = useAuth();
  const [smsEnabled, setSmsEnabled] = useState(currentUser?.preferences.smsEnabled ?? true);
  const [inAppEnabled, setInAppEnabled] = useState(currentUser?.preferences.inAppEnabled ?? true);
  const initials = (currentUser?.name || "Citizen").split(" ").map((n) => n[0]).join("");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xl font-semibold text-white">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink-900">{currentUser?.name}</h2>
            <p className="flex items-center gap-1.5 text-sm text-ink-500">
              <ShieldCheck className="h-4 w-4 text-teal-600" /> Verified citizen account
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-ink-100 pt-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-ink-700">
            <Phone className="h-4 w-4 text-ink-400" /> {currentUser?.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-700">
            <Mail className="h-4 w-4 text-ink-400" /> {currentUser?.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-700">
            <MapPin className="h-4 w-4 text-ink-400" /> {currentUser?.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-700">
            <CalendarDays className="h-4 w-4 text-ink-400" /> Joined {currentUser?.joinedDate ? formatDate(currentUser.joinedDate) : ""}
          </div>
        </div>
      </div>

      <div className="rounded-card border border-ink-100 bg-surface p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Complaint statistics</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Submitted", value: currentUser?.stats.submitted ?? 0 },
            { label: "In progress", value: currentUser?.stats.inProgress ?? 0 },
            { label: "Resolved", value: currentUser?.stats.resolved ?? 0 },
            { label: "Support given", value: currentUser?.stats.supportGiven ?? 0 },
          ].map((s) => (
            <div key={s.label} className="rounded border border-ink-100 bg-surface-alt p-3 text-center">
              <p className="text-xl font-semibold text-ink-900">{s.value}</p>
              <p className="text-xs text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-ink-100 bg-surface p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Notification preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-ink-700">SMS notifications</span>
            <button
              onClick={() => setSmsEnabled((v) => !v)}
              className={cn("relative h-6 w-11 rounded-full transition", smsEnabled ? "bg-teal-600" : "bg-ink-200")}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
                  smsEnabled ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-ink-700">In-app notifications</span>
            <button
              onClick={() => setInAppEnabled((v) => !v)}
              className={cn("relative h-6 w-11 rounded-full transition", inAppEnabled ? "bg-teal-600" : "bg-ink-200")}
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
        <button
          onClick={() => showToast("Profile preferences saved.", "success")}
          className="mt-4 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Save changes
        </button>
      </div>

      <div className="rounded-card border border-red-200/50 bg-red-50/10 p-5">
        <h3 className="mb-1 text-sm font-semibold text-red-900">Account actions</h3>
        <p className="text-xs text-ink-500 mb-4">Sign out of your account on this device.</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded border border-red-200 bg-surface px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
