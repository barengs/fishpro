import { useState } from 'react'

interface RegisterFormProps {
  onSuccess?: (role: string) => void
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [role, setRole] = useState<'owner' | 'captain' | 'admin'>('owner')
  const [ownerType, setOwnerType] = useState<'individual' | 'company'>('individual')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [shipReg, setShipReg] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess?.(role === 'captain' ? 'nahkoda' : role === 'owner' ? 'pemilik' : 'admin')
  }

  return (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-fco-dark mb-1.5 tracking-tight">
          Daftar akun FCO
        </h2>
        <p className="text-sm text-fco-muted m-0">
          Pilih peran Anda untuk memulai pendaftaran sistem.
        </p>
      </div>

      {/* Role Picker */}
      <div className="flex gap-2 p-1 bg-fco-blue-light rounded-xl mb-5">
        {[
          { key: 'owner', label: 'Pemilik Kapal' },
          { key: 'captain', label: 'Nahkoda' },
          { key: 'admin', label: 'Admin KKP' }
        ].map((item) => {
          const isSelected = role === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setRole(item.key as typeof role)}
              className={`flex-1 h-9.5 rounded-lg text-[13px] font-semibold cursor-pointer border-none transition-all ${
                isSelected ? 'bg-fco-blue text-white shadow-xs' : 'bg-transparent text-fco-muted hover:text-fco-dark'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {role === 'owner' && (
        <div className="mb-4.5">
          <label className="block text-[13px] font-semibold text-fco-dark mb-2">
            Tipe Pemilik
          </label>
          <div className="flex gap-2.5">
            {[
              { key: 'individual', label: 'Perorangan' },
              { key: 'company', label: 'Perusahaan' }
            ].map((type) => {
              const isSelected = ownerType === type.key
              return (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setOwnerType(type.key as typeof ownerType)}
                  className={`flex-1 h-10 rounded-[10px] text-[13px] font-semibold cursor-pointer transition-colors border ${
                    isSelected
                      ? 'border-fco-blue bg-fco-blue-light text-fco-blue'
                      : 'border-fco-border bg-white text-fco-dark hover:bg-fco-bg'
                  }`}
                >
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label htmlFor="reg-fullname" className="block text-[13px] font-semibold text-fco-dark mb-1.5">
            Nama lengkap
          </label>
          <input
            id="reg-fullname"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama sesuai identitas"
            className="w-full h-11 border border-fco-border rounded-[10px] px-3 text-sm bg-white focus:outline-none focus:border-fco-blue"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="reg-username" className="block text-[13px] font-semibold text-fco-dark mb-1.5">
              Nama pengguna
            </label>
            <input
              id="reg-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: budi.h"
              className="w-full h-11 border border-fco-border rounded-[10px] px-3 text-sm bg-white focus:outline-none focus:border-fco-blue"
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-[13px] font-semibold text-fco-dark mb-1.5">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full h-11 border border-fco-border rounded-[10px] px-3 text-sm bg-white focus:outline-none focus:border-fco-blue"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="reg-phone" className="block text-[13px] font-semibold text-fco-dark mb-1.5">
              Nomor telepon
            </label>
            <input
              id="reg-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full h-11 border border-fco-border rounded-[10px] px-3 text-sm bg-white focus:outline-none focus:border-fco-blue"
            />
          </div>
          {role !== 'admin' && (
            <div>
              <label htmlFor="reg-ship" className="block text-[13px] font-semibold text-fco-dark mb-1.5">
                No. Registrasi Kapal
              </label>
              <input
                id="reg-ship"
                type="text"
                value={shipReg}
                onChange={(e) => setShipReg(e.target.value)}
                placeholder="REG-0412"
                className="w-full h-11 border border-fco-border rounded-[10px] px-3 text-sm bg-white focus:outline-none focus:border-fco-blue"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="reg-pass" className="block text-[13px] font-semibold text-fco-dark mb-1.5">
            Kata sandi
          </label>
          <input
            id="reg-pass"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            className="w-full h-11 border border-fco-border rounded-[10px] px-3 text-sm bg-white focus:outline-none focus:border-fco-blue"
          />
        </div>

        <button
          type="submit"
          className="h-12 rounded-[10px] border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-[15px] font-semibold cursor-pointer mt-2 transition-colors shadow-xs"
        >
          Daftar Akun
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-fco-muted">
        Sudah memiliki akun?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="bg-transparent border-none text-fco-blue hover:text-fco-blue-hover font-semibold cursor-pointer p-0"
        >
          Masuk di sini
        </button>
      </div>
    </div>
  )
}
