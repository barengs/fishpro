import { ProgressBar } from '../../../components/ProgressBar'
import { StatusChip } from '../../../components/StatusChip'

const ok = { chip: 'Aktif', chipBg: '#E8F0FE', chipColor: '#1A56DB' }
const warn = { chip: 'Kuota menipis', chipBg: '#FFF1E0', chipColor: '#B54708' }
const watch = { chip: 'Perlu dipantau', chipBg: '#E8F0FE', chipColor: '#1A56DB' }
const idle = { chip: 'Tanpa nahkoda', chipBg: '#EEF1F6', chipColor: '#4A5872' }

const fleet = [
  { name: 'KM Samudra Jaya', reg: 'REG-0412', captain: 'Budi Hartono', captainColor: '#0F1F3D', width: '70%', ...ok },
  { name: 'KM Bahari Satu', reg: 'REG-0087', captain: 'Agus Salim', captainColor: '#0F1F3D', width: '14%', ...warn },
  { name: 'KM Mutiara Laut', reg: 'REG-0233', captain: 'Dewa Putu', captainColor: '#0F1F3D', width: '22%', ...watch },
  { name: 'KM Laut Biru', reg: 'REG-0301', captain: 'Rahmat Ali', captainColor: '#0F1F3D', width: '58%', ...ok },
  { name: 'KM Tirta Mas', reg: 'REG-0450', captain: 'Belum ditunjuk', captainColor: '#5B6B86', width: '81%', ...idle }
]

export function FleetTable() {
  return (
    <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0 text-base font-bold text-fco-dark">Armada kapal</h2>
        <a href="#captain" className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover">
          Kelola nahkoda
        </a>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-130">
          <div className="flex items-center py-2.5 text-xs font-semibold text-fco-muted">
            <div className="basis-3/10">Kapal</div>
            <div className="basis-2/10">Nahkoda</div>
            <div className="basis-3/10">Sisa kuota</div>
            <div className="basis-2/10 text-right">Status</div>
          </div>

          {fleet.map((s) => (
            <div key={s.reg} className="flex items-center py-4 border-t border-fco-border-subtle">
              <div className="basis-3/10">
                <div className="text-sm font-semibold text-fco-dark">{s.name}</div>
                <div className="text-xs text-fco-muted tabular-nums">{s.reg}</div>
              </div>
              <div className="basis-2/10 text-sm" style={{ color: s.captainColor }}>
                {s.captain}
              </div>
              <div className="basis-3/10 pr-6">
                <ProgressBar width={s.width} showText />
              </div>
              <div className="basis-2/10 text-right">
                <StatusChip label={s.chip} bg={s.chipBg} color={s.chipColor} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
