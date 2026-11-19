import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import './App.css'
import { ComplaintProvider } from "./context/ComplaintContext";

// Common Pages
import Welcome from "./pages/Welcome";
import LoginPageWithOTP from "./pages/LoginPageWithOTP";

// Student Pages
import RaiseComplaint from "./pages/student/RaiseComplaint";

// Warden Pages
import WardenDashboard from "./pages/warden/WardenDashboard";
import PendingComplaints from "./pages/warden/PendingComplaints";
import ResolvedComplaints from "./pages/warden/ResolvedComplaints";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UnresolvedComplaints from "./pages/admin/UnresolvedComplaints";

function AppRoutes() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const userEmail = localStorage.getItem("userEmail");

  return (
    <ComplaintProvider key={userEmail}>
      <Routes>
        {/* ✅ Welcome Page with working Login button */}
        <Route path="/" element={<Welcome onLoginClick={goToLogin} />} />

        {/* ✅ Login Page */}
        <Route path="/login" element={<LoginPageWithOTP />} />

        {/* ✅ Student */}
        <Route path="/student/raise-complaint" element={<RaiseComplaint />} />

        {/* ✅ Warden */}
        <Route path="/warden/dashboard" element={<WardenDashboard />} />
        <Route path="/warden/pending" element={<PendingComplaints />} />
        <Route path="/warden/resolved" element={<ResolvedComplaints />} />


        {/* ✅ Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/unresolved" element={<UnresolvedComplaints />} />

        {/* ✅ Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ComplaintProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
