import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { ToastProvider } from "./components/shared/Toast";
import { AuthProvider, useAuth } from "./components/shared/Auth";

// Industry Pages
import IndustryLayout from "./components/layout/IndustryLayout";
import IndustryDashboard from "./pages/industry/IndustryDashboard";
import DiscoverProjects from "./pages/industry/DiscoverProjects";
import ProjectDetails from "./pages/industry/ProjectDetails";
import AIRecommendations from "./pages/industry/AIRecommendations";
import AvailableChallenges from "./pages/industry/AvailableChallenges";
import AcceptedProjects from "./pages/industry/AcceptedProjects";
import CollaborationWorkspace from "./pages/industry/CollaborationWorkspace";
import FundingDashboard from "./pages/industry/FundingDashboard";
import MentorshipDashboard from "./pages/industry/MentorshipDashboard";
import PilotDeployment from "./pages/industry/PilotDeployment";
import ImpactAnalytics from "./pages/industry/ImpactAnalytics";
import IndustryNotifications from "./pages/industry/IndustryNotifications";
import CompanyProfilePage from "./pages/industry/CompanyProfilePage";
import Login from "./pages/Login";
import RegisterFlow from "./pages/industry/RegisterFlow";

function ProtectedRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/industry/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/industry/login" element={<Login />} />
          <Route path="/industry/register" element={<RegisterFlow />} />
          
          <Route path="/" element={<Navigate to="/industry/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/industry/login" replace />} />
          <Route path="/register" element={<Navigate to="/industry/register" replace />} />
          
          {/* Industry Portal routes under layout */}
          <Route path="/industry" element={<ProtectedRoute />}>
            <Route element={<IndustryLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<IndustryDashboard />} />
              <Route path="projects" element={<DiscoverProjects />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="challenges" element={<AvailableChallenges />} />
              <Route path="available-challenges" element={<AvailableChallenges />} />
              <Route path="recommendations" element={<AIRecommendations />} />
              <Route path="collaborations" element={<AcceptedProjects />} />
              <Route path="accepted-projects" element={<AcceptedProjects />} />
              <Route path="collaborations/:id" element={<CollaborationWorkspace />} />
              <Route path="funding" element={<FundingDashboard />} />
              <Route path="mentorship" element={<MentorshipDashboard />} />
              <Route path="deployment" element={<PilotDeployment />} />
              <Route path="impact" element={<ImpactAnalytics />} />
              <Route path="notifications" element={<IndustryNotifications />} />
              <Route path="profile" element={<CompanyProfilePage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/industry/dashboard" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
