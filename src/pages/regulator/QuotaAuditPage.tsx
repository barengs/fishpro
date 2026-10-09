import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { StatusChip } from '../../components/StatusChip'
import { ProgressBar } from '../../components/ProgressBar'
import { FormField, inputCls } from '../../components/FormField'

// Regulator = CustomUser role=regulator; fokus: audit Quota (ship FK, year, quota, remaining_quota),
// verifikasi FishCatchTransaction, override manual quota, pantau Tariff & kepatuhan WPP.
interface AuditRow { id: number; ship: string; reg: string; year: string; quota: string; remaining: string; pct: string; wpp: string }

export function QuotaAuditPage() {
  const [rows] = useState<AuditRow[]>([
    { id: 1, ship: 'KM Bahari Satu', reg: 'REG-0087', year: '2026', quota: '15.000 kg', remaining: '2.100 kg', pct: '14%', wpp: 'WPP 712' },
    { id: 2, ship: 'KM Cahaya Timur', reg: 'REG-0319', year: '2026', quota: '10.000 kg', remaining: '900 kg', pct: '9%', wpp: 'WPP 711' },
    { id: 3, ship: 'KM Samudra Jaya', reg: 'REG-0412', year: '2026', quota: '12.000 kg', remaining: '8.400 kg', pct: '70%', wpp: 'WPP 573' }
  ])
  const [f, setF] = useState({ registration_number: '', year: '2026', new_quota: '', reason: '' })
  const [toast, setToast] = useState<string | null>(null)

  const cols: Column<AuditRow>[] = [
    { key: 'ship', header: 'Kapal / Reg', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.ship}</div><div className="text-xs text-fco-muted tabular-nums">{r.reg} · {r.year}</div></div>) },
    { key: 'quota', header: 'Kuota (kg)', flex: 2, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.quota}</span> },
    { key: 'rem', header: 'Sisa', flex: 3, render: (r) => <ProgressBar width={r.pct} showText /> },
    { key: 'wpp', header: 'WPP', flex: 1, render: (r) => <span className="text-sm">{r.wpp}</span> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: (r) => Number.parseInt(r.pct) < 15 ? <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" /> : <StatusChip label="Aman" /> }
  ]

  return (
    <div>
      <PageHeader title="Audit Kuota" desc="Verifikasi quota (ship, year, quota, remaining_quota) + kepatuhan WPP per kapal. Override manual tercatat dengan alasan." showSearch searchPlaceholder="Cari registrasi kapal" />
      {toast && <div className="p-3.5 px-4.5 rounded-xl bg-fco-blue-light text-fco-blue text-sm font-semibold mb-5 border border-fco-blue-border">✓ {toast}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="lg:col-span-2 bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-1 text-base font-bold">Override kuota manual</h2>
          <p className="m-0 mb-4 text-sm text-fco-muted">Hak regulator: ship + year + quota baru + alasan.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (!f.registration_number || !f.new_quota) return; setToast(`Kuota ${f.registration_number} tahun ${f.year} → ${Number(f.new_quota).toLocaleString('id-ID')} kg`); setTimeout(() => setToast(null), 4000) }} className="flex flex-col gap-4">
            <FormField label="Nomor registrasi kapal" htmlFor="ov-reg"><input id="ov-reg" required value={f.registration_number} onChange={(e) => setF({ ...f, registration_number: e.target.value })} placeholder="REG-0087" className={inputCls} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tahun" htmlFor="ov-year"><input id="ov-year" type="number" required value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Kuota baru (kg)" htmlFor="ov-q"><input id="ov-q" type="number" step="0.01" required value={f.new_quota} onChange={(e) => setF({ ...f, new_quota: e.target.value })} className={inputCls} /></FormField>
            </div>
            <FormField label="Alasan penyesuaian" htmlFor="ov-r"><textarea id="ov-r" rows={3} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} className="w-full border border-fco-border rounded-xl p-3 text-fco-md focus:outline-none focus:border-fco-blue" /></FormField>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan override</button>
          </form>
        </section>
      </div>
    </div>
  )
}
