import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  MapPinned,
  Bell,
  MessageSquareHeart,
  UserRound,
  ChevronsLeft,
  ChevronsRight,
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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  unreadCount: number;
}

export default function Sidebar({ collapsed, onToggle, unreadCount }: SidebarProps) {
  const { logout } = useAuth();
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-ink-100 bg-ink-900 transition-all duration-200 lg:flex",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-teal-600">
          <Landmark className="h-4.5 w-4.5 text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Tech Foxies</p>
            <p className="truncate text-[11px] text-ink-300">Citizen Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-teal-600/15 text-teal-300"
                  : "text-ink-300 hover:bg-white/5 hover:text-white"
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            {!collapsed && <span className="truncate">{item.label}</span>}
            {item.label === "Notifications" && unreadCount > 0 && (
              <span
                className={cn(
                  "flex items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white",
                  collapsed ? "absolute right-1.5 top-1.5 h-4 w-4" : "ml-auto h-4.5 min-w-[18px] px-1"
                )}
              >
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-2 border-t border-white/10">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition text-ink-300 hover:bg-red-600/15 hover:text-red-400"
          title={collapsed ? "Log Out" : undefined}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="truncate">Log Out</span>}
        </button>
      </div>

      <button
        onClick={onToggle}
        className="flex items-center gap-2 border-t border-white/10 px-4 py-3.5 text-xs font-medium text-ink-300 hover:bg-white/5 hover:text-white"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!collapsed && "Collapse"}
      </button>
    </aside>
  );
}
