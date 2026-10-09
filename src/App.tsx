import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import { OnboardingPage } from "./pages/auth/OnboardingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { AdminLayout } from "./pages/admin/components/AdminSidebar";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ShipsPage } from "./pages/admin/ShipsPage";
import { OwnersTab } from "./pages/admin/OwnersTab";
import { CaptainsTab } from "./pages/admin/CaptainsTab";
import { CatchesPage } from "./pages/admin/CatchesPage";
import { SpeciesPage } from "./pages/admin/SpeciesPage";
import { AreasPage } from "./pages/admin/AreasPage";
import { QuotaPnbpPage } from "./pages/admin/QuotaPnbpPage";
import { BlockchainPage } from "./pages/admin/BlockchainPage";
import { RolesMenusPage } from "./pages/admin/RolesMenusPage";
import { RegulatorLayout } from "./pages/regulator/components/RegulatorSidebar";
import { RegulatorDashboard } from "./pages/regulator/RegulatorDashboard";
import { QuotaAuditPage } from "./pages/regulator/QuotaAuditPage";
import { VerifyBlockchainPage } from "./pages/regulator/VerifyBlockchainPage";
import { OwnerLayout } from "./pages/owner/components/OwnerSidebar";
import { OwnerDashboard } from "./pages/owner/OwnerDashboard";
import { FleetPage } from "./pages/owner/FleetPage";
import { CaptainsPage } from "./pages/owner/CaptainsPage";
import { CaptainLayout } from "./pages/captain/components/CaptainNavbar";
import { CaptainDashboard } from "./pages/captain/CaptainDashboard";
import { MyCatchesPage } from "./pages/captain/MyCatchesPage";
import { MyShipPage } from "./pages/captain/MyShipPage";

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboard" replace />} />

        {/* Standalone auth pages */}
        <Route path="/onboard" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin: Ship, Owner, Captain, FishCatch+Detail, Species+Price, Area, Quota+Tariff, Blockchain, Role/Menu */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="ships" element={<ShipsPage />} />
          <Route path="owners" element={<OwnersTab />} />
          <Route path="captains" element={<CaptainsTab />} />
          <Route path="catches" element={<CatchesPage />} />
          <Route path="species" element={<SpeciesPage />} />
          <Route path="areas" element={<AreasPage />} />
          <Route path="quota" element={<QuotaPnbpPage />} />
          <Route path="blockchain" element={<BlockchainPage />} />
          <Route path="roles" element={<RolesMenusPage />} />
        </Route>

        {/* Regulator: audit quota + verifikasi blockchain */}
        <Route path="/regulator" element={<RegulatorLayout />}>
          <Route index element={<RegulatorDashboard />} />
          <Route path="audit" element={<QuotaAuditPage />} />
          <Route path="verify" element={<VerifyBlockchainPage />} />
        </Route>

        {/* Owner: armada + nahkoda */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboard />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="captains" element={<CaptainsPage />} />
        </Route>

        {/* Captain: riwayat + kapal */}
        <Route path="/captain" element={<CaptainLayout />}>
          <Route index element={<CaptainDashboard />} />
          <Route path="catches" element={<MyCatchesPage />} />
          <Route path="ship" element={<MyShipPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/onboard" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}
