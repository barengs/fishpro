import { BarChart3 } from 'lucide-react'

const tips = [
  { title: 'Kuota KM Bahari Satu menipis', text: 'Dengan laju tangkapan sekarang, kuota diperkirakan habis dalam beberapa minggu.' },
  { title: 'Tunjuk nahkoda untuk KM Tirta Mas', text: 'Kapal belum bisa mengirim laporan tangkapan tanpa nahkoda.' },
  { title: 'Ajukan penyesuaian kuota', text: 'Armada Anda rata-rata menggunakan lebih dari separuh kuota tahunan.' }
]

export function AiAdviceCard() {
  return (
    <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
      <h2 className="mt-0 mb-4 text-base font-bold text-fco-dark">Rekomendasi AI</h2>
      <div className="flex flex-col gap-4">
        {tips.map((t) => (
          <div key={t.title} className="flex gap-3">
            <div className="w-8 h-8 rounded-fco bg-fco-blue-light flex items-center justify-center shrink-0">
              <BarChart3 size={16} className="text-fco-blue" strokeWidth={2} aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold mb-0.5 text-fco-dark">{t.title}</div>
              <div className="text-fco-sm leading-relaxed text-fco-muted">{t.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
