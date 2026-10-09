import { useState } from 'react'
import { RoleSwitcher, type ActiveView } from './components/RoleSwitcher'
import { OnboardingPage } from './modules/auth/OnboardingPage'
import { AuthPage } from './modules/auth/AuthPage'
import { AdminDashboard } from './modules/admin/AdminDashboard'
import { RegulatorDashboard } from './modules/regulator/RegulatorDashboard'
import { PemilikDashboard } from './modules/pemilik/PemilikDashboard'
import { NahkodaDashboard } from './modules/nahkoda/NahkodaDashboard'

export default function App() {
  const [view, setView] = useState<ActiveView>('onboard')

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F6F9FE]">
      <RoleSwitcher currentView={view} onSelectView={setView} />

      {/* Auth Flows */}
      {view === 'onboard' && (
        <OnboardingPage
          onFinish={() => setView('login')}
          onLogin={() => setView('login')}
          onRegister={() => setView('register')}
        />
      )}

      {view === 'login' && (
        <AuthPage
          initialMode="login"
          onLoginSuccess={(role) => setView(role as ActiveView)}
          onGoToOnboarding={() => setView('onboard')}
        />
      )}

      {view === 'register' && (
        <AuthPage
          initialMode="register"
          onLoginSuccess={(role) => setView(role as ActiveView)}
          onGoToOnboarding={() => setView('onboard')}
        />
      )}

      {view === 'reset-password' && (
        <AuthPage
          initialMode="reset-password"
          onLoginSuccess={(role) => setView(role as ActiveView)}
          onGoToOnboarding={() => setView('onboard')}
        />
      )}

      {/* Role Dashboards */}
      {view === 'admin' && <AdminDashboard />}
      {view === 'regulator' && <RegulatorDashboard />}
      {view === 'pemilik' && <PemilikDashboard />}
      {view === 'nahkoda' && <NahkodaDashboard />}
    </div>
  )
}
