import { useState } from 'react'

interface CatchReportFormProps {
  onSuccess?: () => void
}

export function CatchReportForm({ onSuccess }: CatchReportFormProps) {
  const [tanggal, setTanggal] = useState('2026-10-09')
  const [jenis, setJenis] = useState('pelagic')
  const [latitude, setLatitude] = useState('-8.740000')
  const [longitude, setLongitude] = useState('115.200000')
  const [wpp, setWpp] = useState('WPP 573')
  const [spesies, setSpesies] = useState('Tongkol')
  const [jumlah, setJumlah] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleGetCurrentLocation = (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6))
          setLongitude(pos.coords.longitude.toFixed(6))
        },
        () => {
          setLatitude('-8.740000')
          setLongitude('115.200000')
        }
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    onSuccess?.()
    setTimeout(() => {
      setSubmitted(false)
      setJumlah('')
    }, 3000)
  }

  return (
    <section className="bg-white border border-[#DCE6F5] rounded-[20px] p-7 shadow-xl shadow-[#1A56DB]/5">
      <h2 className="mt-0 mb-1 text-lg font-extrabold tracking-tight text-[#0F1F3D]">Lapor tangkapan</h2>
      <p className="mt-0 mb-5 text-sm text-[#5B6B86]">Isi setelah selesai menangkap. Laporan langsung tercatat.</p>

      {submitted && (
        <div className="p-3 px-4 rounded-xl bg-[#E8F0FE] text-[#1A56DB] text-sm font-semibold mb-4 border border-[#BCD3F8]">
          ✓ Laporan berhasil disimpan & dicatat ke blockchain!
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="tanggal" className="block text-[13px] font-semibold text-[#0F1F3D] mb-2">Tanggal penangkapan</label>
          <input
            id="tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB]"
          />
        </div>

        <div>
          <label htmlFor="jenis" className="block text-[13px] font-semibold text-[#0F1F3D] mb-2">Jenis penangkapan</label>
          <select
            id="jenis"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB]"
          >
            <option value="pelagic">Pelagis</option>
            <option value="demersal">Demersal</option>
            <option value="reef">Terumbu Karang</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="lat" className="block text-[13px] font-semibold text-[#0F1F3D] mb-2">Latitude</label>
            <input
              id="lat"
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-8.740000"
              className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB]"
            />
          </div>
          <div>
            <label htmlFor="lng" className="block text-[13px] font-semibold text-[#0F1F3D] mb-2">Longitude</label>
            <input
              id="lng"
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="115.200000"
              className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB]"
            />
          </div>
        </div>

        <a
          href="#lokasi"
          onClick={handleGetCurrentLocation}
          className="inline-flex items-center gap-2 self-start text-[13px] font-semibold text-[#1A56DB] hover:text-[#123FA8]"
        >
          <svg className="w-4 h-4 stroke-[#1A56DB]" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Gunakan lokasi saat ini
        </a>

        <div>
          <label htmlFor="wpp" className="block text-[13px] font-semibold text-[#0F1F3D] mb-2">Wilayah penangkapan (WPP)</label>
          <select
            id="wpp"
            value={wpp}
            onChange={(e) => setWpp(e.target.value)}
            className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB]"
          >
            <option value="WPP 571">WPP 571 - Selat Malaka</option>
            <option value="WPP 572">WPP 572 - Samudera Hindia Barat Sumatera</option>
            <option value="WPP 573">WPP 573 - Samudera Hindia Selatan Jawa</option>
            <option value="WPP 711">WPP 711 - Selat Karimata, Laut Natuna</option>
            <option value="WPP 712">WPP 712 - Laut Jawa</option>
            <option value="WPP 713">WPP 713 - Selat Makassar, Laut Flores</option>
          </select>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3">
            <label htmlFor="spesies" className="block text-[13px] font-semibold text-[#0F1F3D] mb-2">Spesies ikan</label>
            <select
              id="spesies"
              value={spesies}
              onChange={(e) => setSpesies(e.target.value)}
              className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB]"
            >
              <option value="Tongkol">Tongkol</option>
              <option value="Cakalang">Cakalang</option>
              <option value="Tuna sirip kuning">Tuna sirip kuning</option>
              <option value="Tenggiri">Tenggiri</option>
              <option value="Kembung">Kembung</option>
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="jumlah" className="block text-[13px] font-semibold text-[#0F1F3D] mb-2">Jumlah (kg)</label>
            <input
              id="jumlah"
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="0"
              className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB]"
            />
          </div>
        </div>

        <a href="#tambah" className="inline-flex items-center gap-2 self-start text-[13px] font-semibold text-[#1A56DB] hover:text-[#123FA8]">
          <svg className="w-4 h-4 stroke-[#1A56DB]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah spesies lain
        </a>

        <button
          type="submit"
          className="w-full h-12.5 mt-1 border-none rounded-xl bg-[#1A56DB] hover:bg-[#123FA8] text-white text-[15px] font-semibold cursor-pointer transition-colors shadow-xs"
        >
          Kirim laporan
        </button>
      </form>
    </section>
  )
}
