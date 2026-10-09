import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { FormField, inputCls } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'
import { ProgressBar } from '../../components/ProgressBar'

// Quota: ship (FK), year, quota (kg), remaining_quota (kg), is_active — unique (ship, year)
// Tariff: name (unique), gt_threshold, rate_small, rate_large, is_active, effective_date
interface QuotaRow { id: number; ship: string; year: string; quota: string; remaining: string; pct: string }

export function QuotaPnbpPage() {
  const [rows] = useState<QuotaRow[]>([
    { id: 1, ship: 'KM Bahari Satu', year: '2026', quota: '15.000 kg', remaining: '2.100 kg', pct: '14%' },
    { id: 2, ship: 'KM Cahaya Timur', year: '2026', quota: '10.000 kg', remaining: '900 kg', pct: '9%' },
    { id: 3, ship: 'KM Samudra Jaya', year: '2026', quota: '12.000 kg', remaining: '8.400 kg', pct: '70%' }
  ])
  const [t, setT] = useState({ name: 'Tarif Nasional 2026', gt_threshold: '60', rate_small: '0.05', rate_large: '0.10', is_active: true })

  const cols: Column<QuotaRow>[] = [
    { key: 'ship', header: 'Kapal / Tahun', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.ship}</div><div className="text-xs text-fco-muted tabular-nums">{r.year}</div></div>) },
    { key: 'quota', header: 'Kuota', flex: 2, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.quota}</span> },
    { key: 'rem', header: 'Sisa', flex: 3, render: (r) => <ProgressBar width={r.pct} showText /> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: (r) => Number.parseInt(r.pct) < 15 ? <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" /> : <StatusChip label="Aman" /> }
  ]

  return (
    <div>
      <PageHeader title="Kuota & PNBP" desc="Quota per kapal-tahun (unik) + konfigurasi Tariff nasional (gt_threshold, rate_small/large) untuk perhitungan PNBP otomatis." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="lg:col-span-2 bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Kuota kapal 2026</h2>
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-1 text-base font-bold">Tarif PNBP aktif</h2>
          <p className="m-0 mb-4 text-sm text-fco-muted">Rumus BE: GT ≤ batas → rate_small, GT &gt; batas → rate_large.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <FormField label="Nama tarif (unik)" htmlFor="tf-name"><input id="tf-name" value={t.name} onChange={(e) => setT({ ...t, name: e.target.value })} className={inputCls} /></FormField>
            <FormField label="Batas GT" htmlFor="tf-gt"><input id="tf-gt" type="number" step="0.01" value={t.gt_threshold} onChange={(e) => setT({ ...t, gt_threshold: e.target.value })} className={inputCls} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tarif GT kecil" htmlFor="tf-s"><input id="tf-s" type="number" step="0.0001" value={t.rate_small} onChange={(e) => setT({ ...t, rate_small: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Tarif GT besar" htmlFor="tf-l"><input id="tf-l" type="number" step="0.0001" value={t.rate_large} onChange={(e) => setT({ ...t, rate_large: e.target.value })} className={inputCls} /></FormField>
            </div>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer"><input type="checkbox" checked={t.is_active} onChange={(e) => setT({ ...t, is_active: e.target.checked })} className="rounded" /> Tarif aktif</label>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan tarif</button>
          </form>
        </section>
      </div>
    </div>
  )
}
