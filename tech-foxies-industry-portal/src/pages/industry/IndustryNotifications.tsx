import { useState } from "react";
import { Bell, Sparkles, MessageSquare, FolderCheck, HandCoins, Mail } from "lucide-react";
import { industryNotifications } from "../../data/industryMockData";
import { useToast } from "../../components/shared/Toast";
import { cn } from "../../lib/utils";

export default function IndustryNotifications() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(industryNotifications);
  
  // Email settings states
  const [emailSettings, setEmailSettings] = useState({
    recommendations: true,
    collaborations: true,
    milestones: true,
    funding: false,
    deployment: true,
  });

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read.", "success");
  };

  const toggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const saveEmailSettings = () => {
    showToast("Email notification preferences saved.", "success");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "New Recommendation":
        return <Sparkles className="h-4.5 w-4.5 text-teal-600" />;
      case "Message Received":
        return <MessageSquare className="h-4.5 w-4.5 text-blue-600" />;
      case "Document Uploaded":
        return <FolderCheck className="h-4.5 w-4.5 text-ink-600" />;
      case "Funding Milestone":
        return <HandCoins className="h-4.5 w-4.5 text-green-600" />;
      default:
        return <Bell className="h-4.5 w-4.5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Notifications & Settings</h2>
          <p className="text-sm text-ink-500 mt-1">
            Stay updated with project matching feeds, university messages and milestone clearances.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="rounded border border-ink-200 bg-surface px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-surface-sunken transition self-start sm:self-auto cursor-pointer"
        >
          Mark All Read
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* In-app Notification list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider">In-App Alert Feed</h3>

          <div className="space-y-4">
            {["Today", "Yesterday", "Earlier"].map((label) => {
              const items = notifications.filter((n) => n.timeLabel === label);
              if (items.length === 0) return null;

              return (
                <div key={label} className="space-y-2">
                  <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider block px-1">{label}</span>
                  <div className="space-y-2">
                    {items.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => toggleRead(n.id)}
                        className={cn(
                          "flex items-start gap-3 rounded border bg-surface p-4 shadow-sm transition cursor-pointer hover:border-ink-200",
                          n.read ? "border-ink-100 opacity-75" : "border-teal-500/30 ring-1 ring-teal-500/10"
                        )}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt border border-ink-100">
                          {getIcon(n.type)}
                        </div>

                        <div className="flex-1 space-y-0.5 text-xs">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-bold text-ink-900">{n.title}</span>
                            <span className="text-[10px] text-ink-400 font-mono">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-ink-600 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email configurations panel */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Communication preferences</h3>

          <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-ink-100 pb-3">
              <Mail className="h-4.5 w-4.5 text-teal-600" />
              <span className="font-bold text-ink-900 text-xs sm:text-sm">Email digest settings</span>
            </div>

            <div className="space-y-3.5 text-xs text-ink-700">
              {[
                { id: "recommendations", label: "Important project matches" },
                { id: "collaborations", label: "Collaboration requests" },
                { id: "milestones", label: "Milestone status updates" },
                { id: "funding", label: "Funding tranche clearances" },
                { id: "deployment", label: "Deployment schedule alerts" },
              ].map((setting) => (
                <label key={setting.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(emailSettings as any)[setting.id]}
                    onChange={() =>
                      setEmailSettings({
                        ...emailSettings,
                        [setting.id]: !(emailSettings as any)[setting.id],
                      })
                    }
                    className="accent-teal-600 rounded border-ink-200"
                  />
                  <span>{setting.label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={saveEmailSettings}
              className="w-full rounded bg-teal-600 py-2 text-xs font-bold text-white hover:bg-teal-700 transition cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
