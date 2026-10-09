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
    <section className="bg-white border border-fco-border rounded-fco-lg p-7 shadow-xl shadow-fco-blue/5">
      <h2 className="mt-0 mb-1 text-lg font-extrabold tracking-tight text-fco-dark">Lapor tangkapan</h2>
      <p className="mt-0 mb-5 text-sm text-fco-muted">Isi setelah selesai menangkap. Laporan langsung tercatat.</p>

      {submitted && (
        <div className="p-3 px-4 rounded-xl bg-fco-blue-light text-fco-blue text-sm font-semibold mb-4 border border-fco-blue-border">
          ✓ Laporan berhasil disimpan & dicatat ke blockchain!
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="tanggal" className="block text-fco-sm font-semibold text-fco-dark mb-2">Tanggal penangkapan</label>
          <input
            id="tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full h-11 border border-fco-border rounded-fco px-3 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue"
          />
        </div>

        <div>
          <label htmlFor="jenis" className="block text-fco-sm font-semibold text-fco-dark mb-2">Jenis penangkapan</label>
          <select
            id="jenis"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="w-full h-11 border border-fco-border rounded-fco px-3 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue"
          >
            <option value="pelagic">Pelagis</option>
            <option value="demersal">Demersal</option>
            <option value="reef">Terumbu Karang</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="lat" className="block text-fco-sm font-semibold text-fco-dark mb-2">Latitude</label>
            <input
              id="lat"
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-8.740000"
              className="w-full h-11 border border-fco-border rounded-fco px-3 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue"
            />
          </div>
          <div>
            <label htmlFor="lng" className="block text-fco-sm font-semibold text-fco-dark mb-2">Longitude</label>
            <input
              id="lng"
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="115.200000"
              className="w-full h-11 border border-fco-border rounded-fco px-3 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue"
            />
          </div>
        </div>

        <a
          href="#lokasi"
          onClick={handleGetCurrentLocation}
          className="inline-flex items-center gap-2 self-start text-fco-sm font-semibold text-fco-blue hover:text-fco-blue-hover"
        >
          <svg className="w-4 h-4 stroke-fco-blue" viewBox="0 0 24 24" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Gunakan lokasi saat ini
        </a>

        <div>
          <label htmlFor="wpp" className="block text-fco-sm font-semibold text-fco-dark mb-2">Wilayah penangkapan (WPP)</label>
          <select
            id="wpp"
            value={wpp}
            onChange={(e) => setWpp(e.target.value)}
            className="w-full h-11 border border-fco-border rounded-fco px-3 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue"
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
            <label htmlFor="spesies" className="block text-fco-sm font-semibold text-fco-dark mb-2">Spesies ikan</label>
            <select
              id="spesies"
              value={spesies}
              onChange={(e) => setSpesies(e.target.value)}
              className="w-full h-11 border border-fco-border rounded-fco px-3 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue"
            >
              <option value="Tongkol">Tongkol</option>
              <option value="Cakalang">Cakalang</option>
              <option value="Tuna sirip kuning">Tuna sirip kuning</option>
              <option value="Tenggiri">Tenggiri</option>
              <option value="Kembung">Kembung</option>
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="jumlah" className="block text-fco-sm font-semibold text-fco-dark mb-2">Jumlah (kg)</label>
            <input
              id="jumlah"
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="0"
              className="w-full h-11 border border-fco-border rounded-fco px-3 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue"
            />
          </div>
        </div>

        <a href="#tambah" className="inline-flex items-center gap-2 self-start text-fco-sm font-semibold text-fco-blue hover:text-fco-blue-hover">
          <svg className="w-4 h-4 stroke-fco-blue" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah spesies lain
        </a>

        <button
          type="submit"
          className="w-full h-12.5 mt-1 border-none rounded-xl bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors shadow-xs"
        >
          Kirim laporan
        </button>
      </form>
    </section>
  )
}
