import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { FormField, inputCls } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'
import { ProgressBar } from '../../components/ProgressBar'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'

// Quota: ship (FK), year, quota (kg), remaining_quota (kg), is_active — unique (ship, year)
// Tariff: name (unique), gt_threshold, rate_small, rate_large, is_active, effective_date
interface QuotaRow { id: number; ship: string; year: string; quota: string; remaining: string; pct: string }

export function QuotaPnbpPage() {
  const [tab, setTab] = useState<'quota' | 'tariff'>('quota')
  const [rows] = useState<QuotaRow[]>([
    { id: 1, ship: 'KM Bahari Satu', year: '2026', quota: '15.000 kg', remaining: '2.100 kg', pct: '14%' },
    { id: 2, ship: 'KM Cahaya Timur', year: '2026', quota: '10.000 kg', remaining: '900 kg', pct: '9%' },
    { id: 3, ship: 'KM Samudra Jaya', year: '2026', quota: '12.000 kg', remaining: '8.400 kg', pct: '70%' }
  ])
  const [t, setT] = useState({ name: 'Tarif Nasional 2026', gt_threshold: '60', rate_small: '0.05', rate_large: '0.10', is_active: true })
  const [q, setQ] = useState({ ship: '', year: '2026', quota: '' })
  const quotaModal = useCrudModal()
  const tariffModal = useCrudModal()

  const cols: Column<QuotaRow>[] = [
    { key: 'ship', header: 'Kapal / Tahun', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.ship}</div><div className="text-xs text-soft tabular-nums">{r.year}</div></div>) },
    { key: 'quota', header: 'Kuota', flex: 2, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.quota}</span> },
    { key: 'rem', header: 'Sisa', flex: 3, render: (r) => <ProgressBar width={r.pct} showText /> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: (r) => Number.parseInt(r.pct) < 15 ? <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" /> : <StatusChip label="Aman" /> }
  ]

  return (
    <div>
      <PageToolbar
        title={tab === 'quota' ? 'Kuota Kapal' : 'Tarif PNBP'}
        desc="Quota per kapal-tahun (unik) + Tariff nasional (gt_threshold, rate_small/large)."
        searchPlaceholder="Cari kapal"
        tabs={[{ key: 'quota', label: 'Kuota Kapal' }, { key: 'tariff', label: 'Tarif PNBP' }]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as typeof tab)}
        addLabel={tab === 'quota' ? 'Tambah kuota' : 'Ubah tarif'}
        onAdd={tab === 'quota' ? quotaModal.openModal : tariffModal.openModal}
      />
      {tab === 'quota' ? (
        <section className="surface-card border rounded-2xl p-6 shadow-xs">
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
      ) : (
        <section className="surface-card border rounded-2xl p-6 shadow-xs max-w-220">
          <h2 className="m-0 mb-1 text-base font-bold">Tarif PNBP aktif</h2>
          <p className="m-0 mb-4 text-sm text-soft">GT ≤ {t.gt_threshold} → {t.rate_small} · GT &gt; {t.gt_threshold} → {t.rate_large}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><div className="text-soft text-xs mb-1">Nama</div><div className="font-semibold">{t.name}</div></div>
            <div><div className="text-soft text-xs mb-1">Batas GT</div><div className="font-semibold tabular-nums">{t.gt_threshold}</div></div>
            <div><div className="text-soft text-xs mb-1">Tarif kecil</div><div className="font-semibold tabular-nums">{t.rate_small}</div></div>
            <div><div className="text-soft text-xs mb-1">Tarif besar</div><div className="font-semibold tabular-nums">{t.rate_large}</div></div>
          </div>
        </section>
      )}
      <CrudModal open={quotaModal.open} title="Tambah kuota" subtitle="Quota unik per kapal-tahun (ship, year, quota kg)." onClose={quotaModal.closeModal} onSubmit={(e) => { e.preventDefault(); quotaModal.closeModal() }} submitLabel="Simpan kuota">
        <FormField label="Kapal (ship)" htmlFor="q-ship"><input id="q-ship" required value={q.ship} onChange={(e) => setQ({ ...q, ship: e.target.value })} className={inputCls} /></FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tahun" htmlFor="q-year"><input id="q-year" type="number" required value={q.year} onChange={(e) => setQ({ ...q, year: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Kuota (kg)" htmlFor="q-q"><input id="q-q" type="number" step="0.01" required value={q.quota} onChange={(e) => setQ({ ...q, quota: e.target.value })} className={inputCls} /></FormField>
        </div>
      </CrudModal>
      <CrudModal open={tariffModal.open} title="Ubah tarif PNBP" subtitle="Rumus BE: GT ≤ batas → rate_small, GT > batas → rate_large." onClose={tariffModal.closeModal} onSubmit={(e) => { e.preventDefault(); tariffModal.closeModal() }} submitLabel="Simpan tarif">
        <FormField label="Nama tarif (unik)" htmlFor="tf-name"><input id="tf-name" value={t.name} onChange={(e) => setT({ ...t, name: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Batas GT" htmlFor="tf-gt"><input id="tf-gt" type="number" step="0.01" value={t.gt_threshold} onChange={(e) => setT({ ...t, gt_threshold: e.target.value })} className={inputCls} /></FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tarif GT kecil" htmlFor="tf-s"><input id="tf-s" type="number" step="0.0001" value={t.rate_small} onChange={(e) => setT({ ...t, rate_small: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Tarif GT besar" htmlFor="tf-l"><input id="tf-l" type="number" step="0.0001" value={t.rate_large} onChange={(e) => setT({ ...t, rate_large: e.target.value })} className={inputCls} /></FormField>
        </div>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer"><input type="checkbox" checked={t.is_active} onChange={(e) => setT({ ...t, is_active: e.target.checked })} className="rounded" /> Tarif aktif</label>
      </CrudModal>
    </div>
  )
}
