import { PageHeader } from '../../components/PageHeader'

// Ship milik captain: name, registration_number, length, width, gross_tonnage,
// year_built, home_port, active + Quota tahun berjalan (year, quota, remaining_quota).
const specs = [
  { label: 'Nama kapal', value: 'KM Samudra Jaya' },
  { label: 'Nomor registrasi', value: 'REG-0412' },
  { label: 'Panjang (m)', value: '18,00' },
  { label: 'Lebar (m)', value: '5,20' },
  { label: 'Gross tonnage', value: '42,50' },
  { label: 'Tahun dibuat', value: '2015' },
  { label: 'Pelabuhan asal', value: 'Benoa' },
  { label: 'Status', value: 'Aktif' },
  { label: 'Kuota 2026', value: '12.000 kg' },
  { label: 'Sisa kuota', value: '8.400 kg (70%)' }
]

export function MyShipPage() {
  return (
    <div className="max-w-220 mx-auto">
      <PageHeader title="Kapal Saya" desc="Detail Ship + Quota tahun berjalan. Read-only untuk nahkoda; perubahan via pemilik / admin." />
      <section className="bg-white border border-fco-border rounded-2xl p-8 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {specs.map((s) => (
            <div key={s.label} className="pb-4 border-b border-fco-border-subtle">
              <div className="text-sm text-fco-muted mb-1">{s.label}</div>
              <div className="text-fco-md font-semibold tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
