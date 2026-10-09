interface SpecItem {
  label: string
  value: string
}

interface ShipSpecsCardProps {
  specs?: SpecItem[]
}

const defaultSpecs: SpecItem[] = [
  { label: 'Gross tonnage', value: '42,5 GT' },
  { label: 'Panjang', value: '18,0 m' },
  { label: 'Lebar', value: '5,2 m' },
  { label: 'Tahun dibuat', value: '2015' }
]

export function ShipSpecsCard({ specs = defaultSpecs }: ShipSpecsCardProps) {
  return (
    <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
      <h2 className="mt-0 mb-4 text-base font-bold text-fco-dark">Detail kapal</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {specs.map((s) => (
          <div key={s.label}>
            <div className="text-xs font-semibold text-fco-muted mb-1">{s.label}</div>
            <div className="text-lg font-bold tabular-nums text-fco-dark">{s.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
