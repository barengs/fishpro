import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { OnboardingPage } from './modules/auth/OnboardingPage'
import { AuthPage } from './modules/auth/AuthPage'
import { AdminDashboard } from './modules/admin/AdminDashboard'
import { RegulatorDashboard } from './modules/regulator/RegulatorDashboard'
import { OwnerDashboard } from './modules/owner/OwnerDashboard'
import { CaptainDashboard } from './modules/captain/CaptainDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to onboard */}
        <Route path="/" element={<Navigate to="/onboard" replace />} />

        {/* Authentication & Onboarding Routes */}
        <Route path="/onboard" element={<OnboardingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/reset-password" element={<AuthPage mode="reset-password" />} />

        {/* Role-based Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/regulator" element={<RegulatorDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/captain" element={<CaptainDashboard />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/onboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
