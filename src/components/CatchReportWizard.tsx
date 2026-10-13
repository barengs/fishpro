import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FormField, inputCls } from './FormField'
import { emptyCatchForm, type CatchReportFormData } from './catchReportTypes'

const steps = [
  { num: 1, title: 'Waktu & Lokasi' },
  { num: 2, title: 'Hasil' },
  { num: 3, title: 'Cek' }
]

const typeLabel: Record<string, string> = {
  pelagic: 'Pelagis',
  demersal: 'Demersal',
  reef: 'Terumbu Karang'
}

interface CatchReportWizardProps {
  onSubmit: (data: CatchReportFormData) => void
  onCancel: () => void
}

export function CatchReportWizard({ onSubmit, onCancel }: CatchReportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<CatchReportFormData>(emptyCatchForm)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleNext = () => {
    setErrorMsg(null)
    if (currentStep === 1) {
      if (!form.catch_date) {
        setErrorMsg('Tanggal masih kosong.')
        return
      }
      if (!form.location_latitude.trim() || !form.location_longitude.trim()) {
        setErrorMsg('Koordinat masih kosong.')
        return
      }
    } else if (currentStep === 2) {
      if (!form.fish_species.trim()) {
        setErrorMsg('Spesies masih kosong.')
        return
      }
      if (!form.quantity.trim() || Number(form.quantity) <= 0) {
        setErrorMsg('Jumlah harus lebih dari 0.')
        return
      }
    }
    setCurrentStep((p) => Math.min(3, p + 1))
  }

  const handlePrev = () => {
    setErrorMsg(null)
    setCurrentStep((p) => Math.max(1, p - 1))
  }

  const handleSubmit = () => {
    onSubmit({ ...form })
    setForm(emptyCatchForm)
    setCurrentStep(1)
    setErrorMsg(null)
  }

  return (
    <div>
      {/* Stepper */}
      <div className="mb-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-4 h-0.5 bg-fco-border z-0" />
          <div
            className="absolute left-6 top-4 h-0.5 bg-fco-blue z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 88}%` }}
          />
          {steps.map((s) => {
            const isPassed = currentStep > s.num
            const isCurrent = currentStep === s.num
            return (
              <div key={s.num} className="flex flex-col items-center gap-1.5 relative px-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCurrent
                      ? 'bg-fco-blue text-white ring-4 ring-fco-blue/15'
                      : isPassed
                      ? 'bg-fco-blue text-white'
                      : 'surface-card border-2 border-fco-border text-soft'
                  }`}
                >
                  {isPassed ? '✓' : s.num}
                </div>
                <span className={`text-xs font-semibold ${isCurrent ? 'text-fco-blue' : isPassed ? 'text-strong' : 'text-fco-placeholder'}`}>
                  {s.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          {errorMsg}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* STEP 1: WAKTU & LOKASI */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Tanggal" htmlFor="cr-date" required>
                  <input id="cr-date" type="date" value={form.catch_date} onChange={(e) => setForm({ ...form, catch_date: e.target.value })} className={inputCls} />
                </FormField>
                <FormField label="Jenis" htmlFor="cr-type" required>
                  <select id="cr-type" value={form.catch_type} onChange={(e) => setForm({ ...form, catch_type: e.target.value })} className={inputCls}>
                    <option value="pelagic">Pelagis</option>
                    <option value="demersal">Demersal</option>
                    <option value="reef">Terumbu Karang</option>
                  </select>
                </FormField>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Latitude" htmlFor="cr-lat" required>
                  <input id="cr-lat" value={form.location_latitude} onChange={(e) => setForm({ ...form, location_latitude: e.target.value })} className={inputCls} />
                </FormField>
                <FormField label="Longitude" htmlFor="cr-lng" required>
                  <input id="cr-lng" value={form.location_longitude} onChange={(e) => setForm({ ...form, location_longitude: e.target.value })} className={inputCls} />
                </FormField>
              </div>
              <FormField label="Catatan lokasi" htmlFor="cr-desc">
                <input id="cr-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Opsional" className={inputCls} />
              </FormField>
            </div>
          )}

          {/* STEP 2: HASIL */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Spesies" htmlFor="cr-sp" required>
                  <input id="cr-sp" value={form.fish_species} onChange={(e) => setForm({ ...form, fish_species: e.target.value })} placeholder="Tongkol" className={inputCls} />
                </FormField>
                <FormField label="WPP" htmlFor="cr-wpp">
                  <input id="cr-wpp" value={form.wpp} onChange={(e) => setForm({ ...form, wpp: e.target.value })} placeholder="WPP 573" className={inputCls} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Jumlah" htmlFor="cr-q" required>
                  <input id="cr-q" type="number" step="0.01" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className={inputCls} />
                </FormField>
                <FormField label="Satuan" htmlFor="cr-u">
                  <select id="cr-u" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={inputCls}>
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                  </select>
                </FormField>
              </div>
              <FormField label="Nilai (Rp)" htmlFor="cr-v" hint="Opsional — PNBP dihitung otomatis.">
                <input id="cr-v" type="number" step="0.01" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputCls} />
              </FormField>
            </div>
          )}

          {/* STEP 3: CEK */}
          {currentStep === 3 && (
            <div>
              <h3 className="m-0 mb-1 text-lg font-extrabold text-strong">Cek sekali lagi</h3>
              <p className="m-0 mb-4 text-sm text-soft">Laporan tercatat permanen setelah dikirim.</p>
              <dl className="m-0 p-4 rounded-2xl surface-inset border text-sm flex flex-col gap-2.5">
                <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
                  <dt className="text-soft">Tanggal / Jenis</dt>
                  <dd className="m-0 font-semibold text-strong text-right tabular-nums">{form.catch_date} · {typeLabel[form.catch_type]}</dd>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
                  <dt className="text-soft">Lokasi / WPP</dt>
                  <dd className="m-0 text-strong text-right tabular-nums">{form.location_latitude}, {form.location_longitude} · {form.wpp || '—'}</dd>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-soft">Hasil</dt>
                  <dd className="m-0 font-bold text-strong text-right tabular-nums">{form.fish_species} · {form.quantity} {form.unit}</dd>
                </div>
              </dl>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tombol seimbang: Batal selalu ada, Kembali kondisional, aksi primer flex-1 */}
      <div className="flex gap-2.5 mt-5">
        <button type="button" onClick={onCancel} className="flex-1 h-11 rounded-xl text-sm border border-fco-border bg-transparent text-soft hover:text-strong font-semibold cursor-pointer transition-colors">
          Batal
        </button>
        {currentStep > 1 && (
          <button type="button" onClick={handlePrev} className="flex-1 h-11 rounded-xl text-sm border border-fco-border surface-card text-strong font-semibold cursor-pointer transition-colors">
            Kembali
          </button>
        )}
        {currentStep < 3 ? (
          <motion.button type="button" onClick={handleNext} whileTap={{ scale: 0.97 }} className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors">
            Lanjut
          </motion.button>
        ) : (
          <motion.button type="button" onClick={handleSubmit} whileTap={{ scale: 0.97 }} className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors">
            Kirim laporan
          </motion.button>
        )}
      </div>
    </div>
  )
}
