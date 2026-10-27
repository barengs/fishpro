import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import { ToastProvider } from "./components/toast";
import {
  PublicRoute,
  ProtectedRoute,
  BackButtonGuard,
} from "./components/auth";

// Lazy-loaded auth pages
const OnboardingPage = lazy(() =>
  import("./pages/auth/OnboardingPage").then((m) => ({
    default: m.OnboardingPage,
  })),
);
const LoginPage = lazy(() =>
  import("./pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("./pages/auth/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("./pages/auth/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  })),
);

// Lazy-loaded Admin pages
const AdminLayout = lazy(() =>
  import("./pages/admin/components/AdminSidebar").then((m) => ({
    default: m.AdminLayout,
  })),
);
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);
const ShipsPage = lazy(() =>
  import("./pages/admin/ShipsPage").then((m) => ({ default: m.ShipsPage })),
);
const UsersPage = lazy(() =>
  import("./pages/admin/UsersPage").then((m) => ({ default: m.UsersPage })),
);
const OwnersTab = lazy(() =>
  import("./pages/admin/OwnersTab").then((m) => ({ default: m.OwnersTab })),
);
const CaptainsTab = lazy(() =>
  import("./pages/admin/CaptainsTab").then((m) => ({
    default: m.CaptainsTab,
  })),
);
const CatchesPage = lazy(() =>
  import("./pages/admin/CatchesPage").then((m) => ({
    default: m.CatchesPage,
  })),
);
const SpeciesPage = lazy(() =>
  import("./pages/admin/SpeciesPage").then((m) => ({
    default: m.SpeciesPage,
  })),
);
const AreasPage = lazy(() =>
  import("./pages/admin/AreasPage").then((m) => ({ default: m.AreasPage })),
);
const QuotaPnbpPage = lazy(() =>
  import("./pages/admin/QuotaPnbpPage").then((m) => ({
    default: m.QuotaPnbpPage,
  })),
);
const BlockchainPage = lazy(() =>
  import("./pages/admin/BlockchainPage").then((m) => ({
    default: m.BlockchainPage,
  })),
);
const RolesMenusPage = lazy(() =>
  import("./pages/admin/RolesMenusPage").then((m) => ({
    default: m.RolesMenusPage,
  })),
);
const IotDevicesPage = lazy(() =>
  import("./pages/admin/IotDevicesPage").then((m) => ({
    default: m.IotDevicesPage,
  })),
);

// Lazy-loaded Regulator pages
const RegulatorLayout = lazy(() =>
  import("./pages/regulator/components/RegulatorSidebar").then((m) => ({
    default: m.RegulatorLayout,
  })),
);
const RegulatorDashboard = lazy(() =>
  import("./pages/regulator/RegulatorDashboard").then((m) => ({
    default: m.RegulatorDashboard,
  })),
);
const QuotaAuditPage = lazy(() =>
  import("./pages/regulator/QuotaAuditPage").then((m) => ({
    default: m.QuotaAuditPage,
  })),
);
const PredictQuotaPage = lazy(() =>
  import("./pages/regulator/PredictQuotaPage").then((m) => ({
    default: m.PredictQuotaPage,
  })),
);
const IotScalesPage = lazy(() =>
  import("./pages/regulator/IotScalesPage").then((m) => ({
    default: m.IotScalesPage,
  })),
);
const VerifyBlockchainPage = lazy(() =>
  import("./pages/regulator/VerifyBlockchainPage").then((m) => ({
    default: m.VerifyBlockchainPage,
  })),
);

// Lazy-loaded Owner pages
const OwnerLayout = lazy(() =>
  import("./pages/owner/components/OwnerSidebar").then((m) => ({
    default: m.OwnerLayout,
  })),
);
const OwnerDashboard = lazy(() =>
  import("./pages/owner/OwnerDashboard").then((m) => ({
    default: m.OwnerDashboard,
  })),
);
const FleetPage = lazy(() =>
  import("./pages/owner/FleetPage").then((m) => ({ default: m.FleetPage })),
);
const CaptainsPage = lazy(() =>
  import("./pages/owner/CaptainsPage").then((m) => ({
    default: m.CaptainsPage,
  })),
);

// Lazy-loaded Captain pages
const CaptainLayout = lazy(() =>
  import("./pages/captain/components/CaptainSidebar").then((m) => ({
    default: m.CaptainLayout,
  })),
);
const CaptainDashboard = lazy(() =>
  import("./pages/captain/CaptainDashboard").then((m) => ({
    default: m.CaptainDashboard,
  })),
);
const MyCatchesPage = lazy(() =>
  import("./pages/captain/MyCatchesPage").then((m) => ({
    default: m.MyCatchesPage,
  })),
);
const MyShipPage = lazy(() =>
  import("./pages/captain/MyShipPage").then((m) => ({
    default: m.MyShipPage,
  })),
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center surface-page">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-fco-blue/20 border-t-fco-blue animate-spin" />
        <span className="text-xs font-semibold text-soft">
          Memuat halaman...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <BackButtonGuard />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Root redirect */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Navigate to="/onboard" replace />
                  </PublicRoute>
                }
              />

              {/* Standalone auth & public landing pages */}
              <Route path="/onboard" element={<OnboardingPage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
                  </PublicRoute>
                }
              />

              {/* Protected: Admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="ships" element={<ShipsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="owners" element={<OwnersTab />} />
                <Route path="captains" element={<CaptainsTab />} />
                <Route path="catches" element={<CatchesPage />} />
                <Route path="species" element={<SpeciesPage />} />
                <Route path="areas" element={<AreasPage />} />
                <Route path="quota" element={<QuotaPnbpPage />} />
                <Route path="blockchain" element={<BlockchainPage />} />
                <Route path="iot-devices" element={<IotDevicesPage />} />
                <Route path="roles" element={<RolesMenusPage />} />
              </Route>

              {/* Protected: Regulator */}
              <Route
                path="/regulator"
                element={
                  <ProtectedRoute allowedRoles={["regulator", "admin"]}>
                    <RegulatorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<RegulatorDashboard />} />
                <Route path="audit" element={<QuotaAuditPage />} />
                <Route path="predict-quota" element={<PredictQuotaPage />} />
                <Route path="scales" element={<IotScalesPage />} />
                <Route
                  path="manual-quota"
                  element={<Navigate to="/regulator/audit" replace />}
                />
                <Route path="verify" element={<VerifyBlockchainPage />} />
              </Route>

              {/* Protected: Owner */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRoles={["owner", "admin"]}>
                    <OwnerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<OwnerDashboard />} />
                <Route path="fleet" element={<FleetPage />} />
                <Route path="captains" element={<CaptainsPage />} />
              </Route>

              {/* Protected: Captain */}
              <Route
                path="/captain"
                element={
                  <ProtectedRoute allowedRoles={["captain", "admin"]}>
                    <CaptainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CaptainDashboard />} />
                <Route path="catches" element={<MyCatchesPage />} />
                <Route path="ship" element={<MyShipPage />} />
              </Route>

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
