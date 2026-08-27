import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { ToastProvider } from "./components/shared/Toast";
import { AuthProvider, useAuth } from "./components/shared/Auth";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ReportProblem from "./pages/ReportProblem";
import MyComplaints from "./pages/MyComplaints";
import ComplaintDetail from "./pages/ComplaintDetail";
import NearbyProblems from "./pages/NearbyProblems";
import Notifications from "./pages/Notifications";
import MyFeedback from "./pages/MyFeedback";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/citizen/dashboard" replace />} />
          
          <Route path="/citizen" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="report" element={<ReportProblem />} />
              <Route path="complaints" element={<MyComplaints />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
              <Route path="nearby" element={<NearbyProblems />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="feedback" element={<MyFeedback />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/citizen/dashboard" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
