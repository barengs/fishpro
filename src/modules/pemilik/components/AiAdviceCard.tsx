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
            <div className="w-8 h-8 rounded-[10px] bg-fco-blue-light flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 stroke-fco-blue" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold mb-0.5 text-fco-dark">{t.title}</div>
              <div className="text-[13px] leading-relaxed text-fco-muted">{t.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
