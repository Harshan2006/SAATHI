import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  MapPinned,
  Bell,
  MessageSquareHeart,
  UserRound,
  X,
  Landmark,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../shared/Auth";

const NAV_ITEMS = [
  { to: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/citizen/report", label: "Report Problem", icon: FilePlus2 },
  { to: "/citizen/complaints", label: "My Complaints", icon: ClipboardList },
  { to: "/citizen/nearby", label: "Nearby Problems", icon: MapPinned },
  { to: "/citizen/notifications", label: "Notifications", icon: Bell },
  { to: "/citizen/feedback", label: "My Feedback", icon: MessageSquareHeart },
  { to: "/citizen/profile", label: "Profile", icon: UserRound },
];

const BOTTOM_ITEMS = NAV_ITEMS.slice(0, 4);

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout } = useAuth();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} />
      <div className="relative z-10 flex h-full w-72 max-w-[80%] flex-col bg-ink-900">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-600">
              <Landmark className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Tech Foxies</p>
              <p className="text-[11px] text-ink-300">Citizen Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-ink-300 hover:bg-white/10" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium",
                  isActive ? "bg-teal-600/15 text-teal-300" : "text-ink-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-red-650/15 hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Log Out
          </button>
        </nav>
      </div>
    </div>
  );
}

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-100 bg-surface lg:hidden">
      {BOTTOM_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
              isActive ? "text-teal-600" : "text-ink-400"
            )
          }
        >
          <item.icon className="h-5 w-5" strokeWidth={1.75} />
          {item.label === "Report Problem" ? "Report" : item.label}
        </NavLink>
      ))}
    </nav>
  );
}
