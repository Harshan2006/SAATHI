import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  ClipboardList,
  FolderLock,
  HandCoins,
  GraduationCap,
  PlaneTakeoff,
  TrendingUp,
  Bell,
  Building2,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  Search,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { industryNotifications } from "../../data/industryMockData";
import { getIndustryProfile } from "../../store/industryStore";
import { useAuth } from "../shared/Auth";

const NAV_ITEMS = [
  { to: "/industry/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/industry/projects", label: "Discover Projects", icon: Compass },
  { to: "/industry/recommendations", label: "AI Recommendations", icon: Sparkles },
  { to: "/industry/challenges", label: "Available Challenges", icon: ClipboardList },
  { to: "/industry/collaborations", label: "Collaborations", icon: FolderLock },
  { to: "/industry/funding", label: "Funding", icon: HandCoins },
  { to: "/industry/mentorship", label: "Mentorship", icon: GraduationCap },
  { to: "/industry/deployment", label: "Pilot & Deployment", icon: PlaneTakeoff },
  { to: "/industry/impact", label: "Impact Analytics", icon: TrendingUp },
  { to: "/industry/notifications", label: "Notifications", icon: Bell },
  { to: "/industry/profile", label: "Company Profile", icon: Building2 },
];

export default function IndustryLayout() {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const unreadCount = industryNotifications.filter((n) => !n.read).length;

  const pageTitle =
    NAV_ITEMS.find((item) => item.to === location.pathname)?.label ??
    (location.pathname.startsWith("/industry/collaborations/")
      ? "Collaboration Workspace"
      : location.pathname.startsWith("/industry/projects/")
      ? "Project Details"
      : "Industry Portal");

  const profile = getIndustryProfile();
  const initials = (profile.company.companyName || "AB")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-alt font-sans">
      {/* Collapsible desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-ink-200 bg-ink-900 transition-all duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-[256px]"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-teal-600">
            <Building2 className="h-4.5 w-4.5 text-white" strokeWidth={2} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Saathi B2B</p>
              <p className="truncate text-[11px] text-ink-300">Industry Portal</p>
            </div>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-teal-600/15 text-teal-300"
                    : "text-ink-300 hover:bg-white/5 hover:text-white"
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.75} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {item.label === "Notifications" && unreadCount > 0 && (
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full bg-teal-600 text-[10px] font-semibold text-white",
                    collapsed ? "absolute right-1.5 top-1.5 h-3.5 w-3.5" : "ml-auto h-4.5 min-w-[18px] px-1"
                  )}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Log Out */}
        <div className="px-3 py-2 border-t border-white/10">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm font-medium transition text-ink-300 hover:bg-red-600/15 hover:text-red-400"
            title={collapsed ? "Log Out" : undefined}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0 text-red-500" strokeWidth={1.75} />
            {!collapsed && <span className="truncate">Log Out</span>}
          </button>
        </div>

        {/* Sidebar Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-xs font-medium text-ink-300 hover:bg-white/5 hover:text-white"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && "Collapse Navigation"}
        </button>
      </aside>

      {/* Mobile Drawer Menu */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setDrawerOpen(false)} />
          <div className="relative z-10 flex h-full w-72 max-w-[80%] flex-col bg-ink-900">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-600">
                  <Building2 className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Saathi B2B</p>
                  <p className="text-[11px] text-ink-300">Industry Portal</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded p-1.5 text-ink-300 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Nav links */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium",
                      isActive ? "bg-teal-600/15 text-teal-300" : "text-ink-300 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <item.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {/* Log Out in Mobile Drawer */}
            <div className="px-3 py-4 border-t border-white/10">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm font-medium text-ink-300 hover:bg-red-600/15 hover:text-red-400"
              >
                <LogOut className="h-4.5 w-4.5 text-red-500" strokeWidth={1.75} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-ink-100 bg-surface px-4 sm:px-6">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded p-2 text-ink-600 hover:bg-surface-sunken lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page Title */}
          <h1 className="truncate text-base font-semibold text-ink-900 lg:text-lg">{pageTitle}</h1>

          {/* Quick Search */}
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search projects, technologies..."
                className="w-64 rounded border border-ink-200 bg-surface-alt py-1.5 pl-8 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-teal-500 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Notifications Shortcut */}
            <Link
              to="/industry/notifications"
              className="relative rounded p-2 text-ink-600 hover:bg-surface-sunken"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Avatar Shortcut */}
            <Link
              to="/industry/profile"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-800 text-xs font-semibold text-white border border-ink-200"
              title="ABC Technologies Profile"
            >
              {initials}
            </Link>
          </div>
        </header>

        {/* Dynamic page outlet wrapper */}
        <main className="flex-1 overflow-y-auto bg-surface-alt pb-10">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
