import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Anchor, ShieldCheck, Ship } from 'lucide-react'

type Role = 'owner' | 'captain' | 'regulator'

const roleCards: { key: Role; title: string; desc: string; Icon: typeof Ship; card: string; iconBox: string }[] = [
  { key: 'owner', title: 'Pemilik Kapal', desc: 'Armada, kuota & PNBP', Icon: Ship, card: 'bg-fco-blue hover:bg-fco-blue-hover', iconBox: 'bg-white/20' },
  { key: 'captain', title: 'Nahkoda', desc: 'Lapor tangkapan', Icon: Anchor, card: 'bg-emerald-600 hover:bg-emerald-700', iconBox: 'bg-white/20' },
  { key: 'regulator', title: 'Pengawas', desc: 'Audit & verifikasi', Icon: ShieldCheck, card: 'bg-amber-500 hover:bg-amber-600', iconBox: 'bg-white/20' }
]

const roleLabel: Record<Role, string> = {
  owner: 'Pemilik Kapal',
  captain: 'Nahkoda',
  regulator: 'Pengawas'
}

const inputCls = 'w-full h-11 border-[1.5px] border-fco-border rounded-xl px-3.5 text-sm field-input focus:outline-none focus:border-fco-blue'
const labelCls = 'block text-sm font-semibold text-strong mb-1.5'

export function RegisterStepWizard() {
  const navigate = useNavigate()
  const [role, setRole] = useState<Role | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const [ownerType, setOwnerType] = useState<'individual' | 'company'>('company')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [licenseNumber, setLicenseNumber] = useState('')
  const [experienceYears, setExperienceYears] = useState('5')
  const [shipReg, setShipReg] = useState('')
  const [shipName, setShipName] = useState('')
  const [homePort, setHomePort] = useState('Pelabuhan Benoa')
  const [wpp, setWpp] = useState('WPP 573')
  const [department, setDepartment] = useState('Direktorat Pengawasan Sumber Daya Kelautan')
  const [nip, setNip] = useState('')

  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const steps = [
    { num: 1, title: 'Data diri' },
    { num: 2, title: 'Akun' },
    { num: 3, title: 'Detail' },
    { num: 4, title: 'Cek' }
  ]

  const pickRole = (r: Role) => {
    setRole(r)
    setCurrentStep(1)
    setErrorMsg(null)
  }

  const changeRole = () => {
    setRole(null)
    setCurrentStep(1)
    setErrorMsg(null)
  }

  const handleNext = () => {
    setErrorMsg(null)
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMsg('Nama masih kosong.')
        return
      }
      if (role === 'owner' && ownerType === 'company' && !companyName.trim()) {
        setErrorMsg('Nama perusahaan masih kosong.')
        return
      }
    } else if (currentStep === 2) {
      if (!username.trim() || !email.trim() || !phone.trim() || !password) {
        setErrorMsg('Lengkapi username, WA, email, dan sandi.')
        return
      }
      if (password.length < 8) {
        setErrorMsg('Sandi minimal 8 karakter.')
        return
      }
      if (password !== passwordConfirm) {
        setErrorMsg('Sandi tidak sama, coba lagi.')
        return
      }
    } else if (currentStep === 3) {
      if (role === 'captain' && !licenseNumber.trim()) {
        setErrorMsg('No. lisensi wajib diisi.')
        return
      }
      if (role === 'owner' && !shipReg.trim()) {
        setErrorMsg('No. registrasi kapal wajib diisi.')
        return
      }
      if (role === 'regulator' && !nip.trim()) {
        setErrorMsg('NIP / ID pengawas wajib diisi.')
        return
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1))
  }

  const handlePrev = () => {
    setErrorMsg(null)
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleSubmit = () => {
    if (!agreeTerms) {
      setErrorMsg('Centang persetujuan dulu untuk lanjut.')
      return
    }
    if (role === 'captain') navigate('/captain')
    else if (role === 'owner') navigate('/owner')
    else navigate('/regulator')
  }

  // ── Gate: 3 tombol besar, form muncul dengan animasi ──
  if (!role) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-220 mx-auto">
          {roleCards.map(({ key, title, desc, Icon, card, iconBox }, i) => (
            <motion.button
              key={key}
              type="button"
              onClick={() => pickRole(key)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`flex sm:flex-col items-center justify-center sm:text-center gap-4 sm:gap-0 p-5 sm:py-6 sm:px-4 rounded-2xl text-white text-center w-full cursor-pointer border-none shadow-lg transition-colors ${card}`}
            >
              <motion.span
                className={`w-14 h-14 sm:w-12 sm:h-12 rounded-2xl ${iconBox} text-white flex items-center justify-center shrink-0 sm:mb-3`}
                whileHover={{ rotate: -6, scale: 1.08 }}
              >
                <Icon size={26} aria-hidden="true" />
              </motion.span>
              <span className="flex-1 min-w-0">
                <span className="block text-base sm:text-lg font-extrabold">{title}</span>
                <span className="block text-sm text-white/85 mt-0.5">{desc}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role + currentStep}
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -32 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-full w-full"
      >
      {/* Peran terpilih + stepper */}
      <div className="flex items-center gap-2.5 mb-6 p-3 rounded-xl surface-inset border">
        {(() => {
          const found = roleCards.find((c) => c.key === role)
          const Icon = found?.Icon ?? Ship
          return <Icon size={18} className="text-fco-blue shrink-0" aria-hidden="true" />
        })()}
        <span className="text-sm font-bold text-strong">{roleLabel[role]}</span>
        <button type="button" onClick={changeRole} className="ml-auto text-sm font-semibold text-fco-blue hover:text-fco-blue-hover bg-transparent border-none cursor-pointer p-0">
          Ganti
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between relative mb-2">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-fco-border z-0" />
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-fco-blue z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 88}%` }}
          />
          {steps.map((s) => {
            const isPassed = currentStep > s.num
            const isCurrent = currentStep === s.num
            return (
              <div key={s.num} className="flex flex-col items-center gap-1.5 z-10 px-1">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    isCurrent
                      ? 'bg-fco-blue text-white ring-2 ring-fco-blue/15'
                      : isPassed
                      ? 'bg-fco-blue text-white'
                      : 'surface-card border-2 border-fco-border text-soft'
                  }`}
                >
                  {isPassed ? '✓' : s.num}
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${isCurrent ? 'text-fco-blue' : isPassed ? 'text-strong' : 'text-fco-placeholder'}`}>
                  {s.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        {errorMsg && (
          <div role="alert" className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: DATA DIRI (sesuai peran) */}
        {currentStep === 1 && (
          <div>
            <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">Siapa Anda?</h3>
            <p className="m-0 mb-5 text-sm text-soft">Identitas sesuai dokumen resmi.</p>
            <div className="flex flex-col gap-4">
              {role === 'owner' && (
                <div>
                  <span className={labelCls}>Daftar sebagai</span>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'individual', label: 'Pribadi' },
                      { key: 'company', label: 'Perusahaan' }
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setOwnerType(t.key as typeof ownerType)}
                        aria-pressed={ownerType === t.key}
                        className={`h-12 rounded-xl text-sm sm:text-fco-md font-semibold cursor-pointer border transition-colors ${
                          ownerType === t.key
                            ? 'border-fco-blue bg-fco-blue-light dark:bg-fco-blue/15 text-fco-blue'
                            : 'border-fco-border surface-card text-strong'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="rg-name" className={labelCls}>
                  {role === 'owner' && ownerType === 'company' ? 'Nama penanggung jawab' : 'Nama lengkap'}
                </label>
                <input id="rg-name" type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama sesuai KTP" className={inputCls} />
              </div>
              {role === 'owner' && ownerType === 'company' && (
                <div>
                  <label htmlFor="rg-company" className={labelCls}>Nama perusahaan</label>
                  <input id="rg-company" type="text" autoComplete="organization" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="PT ..." className={inputCls} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: AKUN (sama semua peran) */}
        {currentStep === 2 && (
          <div>
            <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">Buat akun masuk</h3>
            <p className="m-0 mb-5 text-sm text-soft">Dipakai setiap kali masuk.</p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="rg-user" className={labelCls}>Username</label>
                  <input id="rg-user" type="text" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="tanpa spasi" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="rg-phone" className={labelCls}>WA</label>
                  <input id="rg-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08..." className={inputCls} />
                </div>
              </div>
              <div>
                <label htmlFor="rg-email" className={labelCls}>Email</label>
                <input id="rg-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="rg-pass" className={labelCls}>Kata sandi</label>
                  <input id="rg-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 karakter" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="rg-pass2" className={labelCls}>Ulangi sandi</label>
                  <input id="rg-pass2" type="password" autoComplete="new-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="Sama seperti di kiri" className={inputCls} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DETAIL PERAN */}
        {currentStep === 3 && (
          <div>
            <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">
              {role === 'owner' ? 'Data kapal' : role === 'captain' ? 'Data pelaut' : 'Data pengawas'}
            </h3>
            <p className="m-0 mb-5 text-sm text-soft">
              {role === 'owner' ? 'Kapal yang Anda daftarkan.' : role === 'captain' ? 'Lisensi dan kapal yang Anda awak.' : 'Satker dan identitas dinas.'}
            </p>
            {role === 'captain' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rg-lic" className={labelCls}>No. lisensi</label>
                    <input id="rg-lic" type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="SKN-..." className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="rg-exp" className={labelCls}>Pengalaman (tahun)</label>
                    <input id="rg-exp" type="number" min="0" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="rg-ship" className={labelCls}>No. kapal yang diawaki</label>
                  <input id="rg-ship" type="text" value={shipReg} onChange={(e) => setShipReg(e.target.value)} placeholder="REG-... (boleh kosong)" className={inputCls} />
                </div>
              </div>
            )}
            {role === 'owner' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rg-shipname" className={labelCls}>Nama kapal</label>
                    <input id="rg-shipname" type="text" value={shipName} onChange={(e) => setShipName(e.target.value)} placeholder="KM ..." className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="rg-shipreg" className={labelCls}>No. kapal (SIPI)</label>
                    <input id="rg-shipreg" type="text" value={shipReg} onChange={(e) => setShipReg(e.target.value)} placeholder="REG-..." className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rg-port" className={labelCls}>Pelabuhan</label>
                    <input id="rg-port" type="text" value={homePort} onChange={(e) => setHomePort(e.target.value)} placeholder="Benoa" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="rg-wpp" className={labelCls}>WPP</label>
                    <select id="rg-wpp" value={wpp} onChange={(e) => setWpp(e.target.value)} className={inputCls}>
                      <option value="WPP 573">573 — Hindia Selatan Jawa</option>
                      <option value="WPP 711">711 — Karimata & Natuna</option>
                      <option value="WPP 712">712 — Laut Jawa</option>
                      <option value="WPP 713">713 — Makassar & Flores</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {role === 'regulator' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="rg-dept" className={labelCls}>Satuan kerja</label>
                  <input id="rg-dept" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="rg-nip" className={labelCls}>NIP / ID pengawas</label>
                  <input id="rg-nip" type="text" value={nip} onChange={(e) => setNip(e.target.value)} placeholder="18 digit NIP" className={inputCls} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: CEK */}
        {currentStep === 4 && (
          <div>
            <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">Cek sekali lagi</h3>
            <p className="m-0 mb-5 text-sm text-soft">Pastikan tidak ada salah ketik.</p>
            <dl className="m-0 mb-5 p-4 sm:p-5 rounded-2xl surface-inset border text-sm flex flex-col gap-2.5">
              <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
                <dt className="text-soft">Peran</dt>
                <dd className="m-0 font-bold text-fco-blue">{roleLabel[role]}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
                <dt className="text-soft">Nama</dt>
                <dd className="m-0 font-semibold text-strong text-right">{fullName}{companyName ? ` · ${companyName}` : ''}</dd>
              </div>
              <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
                <dt className="text-soft">Kontak</dt>
                <dd className="m-0 text-strong text-right">{email} · {phone}</dd>
              </div>
              {(shipReg || licenseNumber || nip) && (
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-soft">{role === 'captain' ? 'Lisensi' : role === 'owner' ? 'Kapal' : 'NIP'}</dt>
                  <dd className="m-0 font-semibold text-strong text-right">
                    {role === 'captain' ? licenseNumber : role === 'owner' ? `${shipReg}${shipName ? ` (${shipName})` : ''}` : nip}
                  </dd>
                </div>
              )}
            </dl>
            <label className="flex items-start gap-2.5 text-sm text-soft cursor-pointer mb-5">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 rounded accent-[#1A56DB]" />
              <span>Data sudah benar. Laporan yang saya kirim tercatat permanen dan tidak bisa diubah.</span>
            </label>
          </div>
        )}

        <div className="flex gap-2.5 mt-5">
          {currentStep > 1 && (
            <button type="button" onClick={handlePrev} className="flex-1 h-11 rounded-xl text-sm border border-fco-border surface-card text-strong font-semibold cursor-pointer transition-colors">
              Kembali
            </button>
          )}
          {currentStep < 4 ? (
            <motion.button
              type="button"
              onClick={handleNext}
              whileTap={{ scale: 0.97 }}
              className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors"
            >
              Lanjut
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit}
              whileTap={{ scale: 0.97 }}
              className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors"
            >
              Buat akun
            </motion.button>
          )}
        </div>
      </div>
      </motion.div>
    </AnimatePresence>
  )
}
