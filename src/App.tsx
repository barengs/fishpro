import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingPage } from "./pages/auth/OnboardingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { RegulatorDashboard } from "./pages/regulator/RegulatorDashboard";
import { OwnerDashboard } from "./pages/owner/OwnerDashboard";
import { CaptainDashboard } from "./pages/captain/CaptainDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to onboard */}
        <Route path="/" element={<Navigate to="/onboard" replace />} />

        {/* Standalone auth pages (no split-screen) */}
        <Route path="/onboard" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Role-based Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/regulator" element={<RegulatorDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/captain" element={<CaptainDashboard />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/onboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
