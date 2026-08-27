import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { MobileDrawer, MobileBottomNav } from "./MobileNav";
import { notifications } from "../../data/mockData";

const PAGE_TITLES: Record<string, string> = {
  "/citizen/dashboard": "Dashboard",
  "/citizen/report": "Report a Problem",
  "/citizen/complaints": "My Complaints",
  "/citizen/nearby": "Nearby Problems",
  "/citizen/notifications": "Notifications",
  "/citizen/feedback": "My Feedback",
  "/citizen/profile": "Profile",
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const pageTitle =
    PAGE_TITLES[location.pathname] ??
    (location.pathname.startsWith("/citizen/complaints/") ? "Complaint Details" : "Tech Foxies");

  return (
    <div className="flex h-screen overflow-hidden bg-surface-alt">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} unreadCount={unreadCount} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setDrawerOpen(true)} unreadCount={unreadCount} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
