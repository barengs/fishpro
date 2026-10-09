import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function RegisterStepWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  // Form State
  const [role, setRole] = useState<'owner' | 'captain' | 'regulator'>('owner')
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

  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const steps = [
    { num: 1, title: 'Peran' },
    { num: 2, title: 'Kredensial' },
    { num: 3, title: 'Operasional' },
    { num: 4, title: 'Verifikasi' }
  ]

  const handleNext = () => {
    setErrorMsg(null)
    if (currentStep === 1) {
      if (!fullName) {
        setErrorMsg('Harap lengkapi nama lengkap sesuai identitas resmi')
        return
      }
    } else if (currentStep === 2) {
      if (!username || !email || !phone || !password) {
        setErrorMsg('Semua data kontak dan kredensial wajib diisi')
        return
      }
      if (password !== passwordConfirm) {
        setErrorMsg('Konfirmasi kata sandi tidak cocok')
        return
      }
    } else if (currentStep === 3) {
      if (role === 'captain' && !licenseNumber) {
        setErrorMsg('Nomor lisensi nahkoda wajib diisi')
        return
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1))
  }

  const handlePrev = () => {
    setErrorMsg(null)
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      setErrorMsg('Harap setujui syarat & ketentuan sebelum mengirimkan pendaftaran')
      return
    }
    if (role === 'captain') navigate('/captain')
    else if (role === 'owner') navigate('/owner')
    else navigate('/regulator')
  }

  return (
    <div className="max-w-full w-full">
      {/* Step Tracker Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative mb-2">
          {/* Background connect line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-fco-border z-0" />
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-fco-blue z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 88}%` }}
          />

          {steps.map((s) => {
            const isPassed = currentStep > s.num
            const isCurrent = currentStep === s.num
            return (
              <div key={s.num} className="flex flex-col items-center gap-1.5 z-10 bg-white dark:bg-fco-card-dark px-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCurrent
                      ? 'bg-fco-blue text-white ring-4 ring-fco-blue/15'
                      : isPassed
                      ? 'bg-fco-blue text-white'
                      : 'surface-card border-2 text-soft'
                  }`}
                >
                  {isPassed ? '✓' : s.num}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    isCurrent ? 'text-fco-blue' : isPassed ? 'text-strong' : 'text-fco-placeholder'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        {errorMsg && (
          <div className="p-3 px-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold mb-5 border border-red-200">
            ⚠ {errorMsg}
          </div>
        )}

        {/* STEP 1: PERAN & IDENTITAS */}
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-200">
            <h3 className="text-2xl font-extrabold text-strong mb-1">Pilih Peran & Identitas</h3>
            <p className="text-sm text-soft mb-5">Tentukan jenis akun Anda di ekosistem perikanan FCO.</p>

            <div className="flex gap-2 p-1 bg-fco-blue-light rounded-xl mb-5">
              {[
                { key: 'owner', label: 'Pemilik Kapal' },
                { key: 'captain', label: 'Nahkoda' },
                { key: 'regulator', label: 'Regulator / KKP' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setRole(item.key as typeof role)}
                  className={`flex-1 h-12 rounded-xl text-sm sm:text-fco-md font-semibold cursor-pointer border-none transition-all ${
                    role === item.key
                      ? 'bg-fco-blue text-white shadow-xs'
                      : 'bg-transparent text-soft hover:text-strong'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {role === 'owner' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-strong mb-2">Tipe Pemilik</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'individual', label: 'Perorangan' },
                    { key: 'company', label: 'Badan Usaha / PT' }
                  ].map((type) => (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => setOwnerType(type.key as typeof ownerType)}
                      className={`h-12 rounded-xl text-sm sm:text-fco-md font-semibold cursor-pointer border transition-colors ${
                        ownerType === type.key
                          ? 'border-fco-blue bg-fco-blue-light text-fco-blue'
                          : 'border-fco-border bg-white text-strong hover:surface-page'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-sm font-semibold text-strong mb-1.5">
                  {role === 'owner' && ownerType === 'company' ? 'Nama Penanggung Jawab' : 'Nama Lengkap'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama sesuai KTP / Dokumen Resmi"
                  className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                />
              </div>

              {role === 'owner' && ownerType === 'company' && (
                <div>
                  <label className="block text-sm font-semibold text-strong mb-1.5">Nama Perusahaan / PT</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: PT Laut Nusantara Bahari"
                    className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: KREDENSIAL & KONTAK */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-200">
            <h3 className="text-2xl font-extrabold text-strong mb-1">Informasi Akun & Akses</h3>
            <p className="text-sm text-soft mb-5">Digunakan untuk login dan verifikasi multi-faktor.</p>

            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-strong mb-1.5">Nama Pengguna (Username)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: budi_hartono"
                    className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-strong mb-1.5">Nomor Telepon / WA</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-strong mb-1.5">Email Aktif</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@perikanan.id"
                  className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-strong mb-1.5">Kata Sandi</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-strong mb-1.5">Ulangi Sandi</label>
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Konfirmasi sandi"
                    className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: OPERASIONAL & KAPAL */}
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-200">
            <h3 className="text-2xl font-extrabold text-strong mb-1">Informasi Operasional</h3>
            <p className="text-sm text-soft mb-5">Tautkan nomor izin kapal atau sertifikasi pelaut Anda.</p>

            {role === 'captain' && (
              <div className="flex flex-col gap-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-strong mb-1.5">Nomor Lisensi Nahkoda</label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="SKN-9821-2024"
                      className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-strong mb-1.5">Pengalaman (Tahun)</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-strong mb-1.5">Tautkan No. Registrasi Kapal</label>
                  <input
                    type="text"
                    value={shipReg}
                    onChange={(e) => setShipReg(e.target.value)}
                    placeholder="Contoh: REG-0412"
                    className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                  />
                  <span className="text-fco-xs text-soft mt-1 block">Bisa dihubungkan ke kapal yang sudah terdaftar di KKP.</span>
                </div>
              </div>
            )}

            {role === 'owner' && (
              <div className="flex flex-col gap-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-strong mb-1.5">Nama Kapal Utama</label>
                    <input
                      type="text"
                      value={shipName}
                      onChange={(e) => setShipName(e.target.value)}
                      placeholder="Contoh: KM Samudra Jaya"
                      className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-strong mb-1.5">No. Registrasi (SIPI)</label>
                    <input
                      type="text"
                      value={shipReg}
                      onChange={(e) => setShipReg(e.target.value)}
                      placeholder="Contoh: REG-0412"
                      className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-strong mb-1.5">Pelabuhan Pangkalan</label>
                    <input
                      type="text"
                      value={homePort}
                      onChange={(e) => setHomePort(e.target.value)}
                      placeholder="Benoa / Muara Baru"
                      className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-strong mb-1.5">Wilayah Tangkapan (WPP)</label>
                    <select
                      value={wpp}
                      onChange={(e) => setWpp(e.target.value)}
                      className="w-full h-13 border rounded-fco px-3 text-sm field-input focus:outline-none focus:border-fco-blue"
                    >
                      <option value="WPP 573">WPP 573 - Samudera Hindia Selatan</option>
                      <option value="WPP 711">WPP 711 - Selat Karimata & Laut Natuna</option>
                      <option value="WPP 712">WPP 712 - Laut Jawa</option>
                      <option value="WPP 713">WPP 713 - Selat Makassar & Flores</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {role === 'regulator' && (
              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-sm font-semibold text-strong mb-1.5">Divisi / Satuan Kerja</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-strong mb-1.5">NIP / ID Pengawas KKP</label>
                  <input
                    type="text"
                    placeholder="1987xxxxxxxxxxxxxx"
                    className="w-full h-13 border border-fco-border rounded-fco px-3 text-sm focus:outline-none focus:border-fco-blue"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: VERIFIKASI & RINGKASAN */}
        {currentStep === 4 && (
          <div className="animate-in fade-in duration-200">
            <h3 className="text-2xl font-extrabold text-strong mb-1">Konfirmasi & Pendaftaran</h3>
            <p className="text-sm text-soft mb-5">Tinjau ringkasan data sebelum akun Anda diterbitkan.</p>

            <div className="p-6 rounded-2xl surface-inset border mb-5 text-sm flex flex-col gap-2.5">
              <div className="flex justify-between py-1 border-b border-fco-border">
                <span className="text-soft">Peran Akun:</span>
                <span className="font-bold text-fco-blue uppercase">
                  {role === 'owner' ? 'Pemilik Kapal' : role === 'captain' ? 'Nahkoda' : 'Regulator KKP'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-fco-border">
                <span className="text-soft">Nama Lengkap:</span>
                <span className="font-semibold text-strong">{fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-fco-border">
                <span className="text-soft">Email & Telepon:</span>
                <span className="text-strong">{email} · {phone}</span>
              </div>
              {shipReg && (
                <div className="flex justify-between py-1 border-b border-fco-border">
                  <span className="text-soft">Kapal Terhubung:</span>
                  <span className="font-semibold text-strong">{shipReg} {shipName && `(${shipName})`}</span>
                </div>
              )}
              {licenseNumber && (
                <div className="flex justify-between py-1 border-b border-fco-border">
                  <span className="text-soft">No. Lisensi:</span>
                  <span className="font-semibold text-strong">{licenseNumber}</span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2.5 text-sm text-soft cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-fco-blue"
              />
              <span>
                Saya menyatakan data di atas benar dan menyetujui bahwa laporan penangkapan ikan akan dicatat secara immutable ke jaringan blockchain terdesentralisasi KKP.
              </span>
            </label>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="h-13 px-6 rounded-xl text-fco-md border border-fco-border bg-white hover:surface-page text-strong font-semibold cursor-pointer transition-colors"
            >
              Kembali
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 h-13 rounded-xl text-fco-md border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Lanjut ke Langkah {currentStep + 1}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-13 rounded-xl text-fco-md border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Selesaikan Pendaftaran
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
