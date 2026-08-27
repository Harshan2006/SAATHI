import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Plus, Search } from "lucide-react";
import { useAuth } from "../shared/Auth";

interface TopbarProps {
  onMenuClick: () => void;
  unreadCount: number;
  pageTitle: string;
}

export default function Topbar({ onMenuClick, unreadCount, pageTitle }: TopbarProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const initials = (currentUser?.name || "Citizen")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-ink-100 bg-surface px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded p-2 text-ink-600 hover:bg-surface-sunken lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="truncate text-base font-semibold text-ink-900 lg:text-lg">{pageTitle}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search complaint ID..."
            className="w-56 rounded border border-ink-200 bg-surface-alt py-1.5 pl-8 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-teal-500 focus:bg-surface focus:outline-none"
          />
        </div>

        <button
          onClick={() => navigate("/citizen/report")}
          className="hidden items-center gap-1.5 rounded bg-teal-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-teal-700 sm:flex"
        >
          <Plus className="h-4 w-4" /> Report a Problem
        </button>

        <Link
          to="/citizen/notifications"
          className="relative rounded p-2 text-ink-600 hover:bg-surface-sunken"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        <Link
          to="/citizen/profile"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-800 text-xs font-semibold text-white"
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
