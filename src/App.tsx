import { useState } from 'react'
import { RoleSwitcher, type ActiveView } from './components/RoleSwitcher'
import { AdminDashboard } from './modules/admin/AdminDashboard'
import { RegulatorDashboard } from './modules/regulator/RegulatorDashboard'
import { PemilikDashboard } from './modules/pemilik/PemilikDashboard'
import { NahkodaDashboard } from './modules/nahkoda/NahkodaDashboard'
import { AuthPage } from './modules/auth/AuthPage'

export default function App() {
  const [view, setView] = useState<ActiveView>('admin')

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F6F9FE]">
      <RoleSwitcher currentView={view} onSelectView={setView} />

      {view === 'admin' && <AdminDashboard />}
      {view === 'regulator' && <RegulatorDashboard />}
      {view === 'pemilik' && <PemilikDashboard />}
      {view === 'nahkoda' && <NahkodaDashboard />}
      {view === 'auth' && <AuthPage onLoginSuccess={(role) => setView(role as ActiveView)} />}
    </div>
  )
}
