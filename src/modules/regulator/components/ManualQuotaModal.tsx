import { useState } from 'react'

interface ManualQuotaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { shipReg: string; year: number; newQuota: number; reason: string }) => void
  initialShipReg?: string
}

export function ManualQuotaModal({
  isOpen,
  onClose,
  onSave,
  initialShipReg = ''
}: ManualQuotaModalProps) {
  const [shipReg, setShipReg] = useState(initialShipReg)
  const [year, setYear] = useState(2026)
  const [newQuota, setNewQuota] = useState(15000)
  const [reason, setReason] = useState('Penyesuaian kuota berdasarkan rekomendasi optimasi NSGA-III')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ shipReg, year, newQuota, reason })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-[#0F1F3D]/50 backdrop-blur-xs flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-[20px] p-7 sm:p-8 max-w-[480px] w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold m-0 text-[#0F1F3D]">
            Penyesuaian Manual Kuota
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer text-[#5B6B86] hover:text-[#0F1F3D]"
          >
            ×
          </button>
        </div>

        <p className="text-[13px] text-[#5B6B86] mt-0 mb-5 leading-relaxed">
          Hak regulator: Menyesuaikan batas kuota kapal penangkap ikan dengan validasi blockchain terverifikasi.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-[#0F1F3D] mb-1.5">
              Nomor Registrasi Kapal
            </label>
            <input
              type="text"
              required
              value={shipReg}
              onChange={(e) => setShipReg(e.target.value)}
              placeholder="Contoh: REG-0087"
              className="w-full h-10.5 border border-[#DCE6F5] rounded-[10px] px-3 text-sm focus:outline-none focus:border-[#1A56DB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-[#0F1F3D] mb-1.5">
                Tahun Kuota
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full h-10.5 border border-[#DCE6F5] rounded-[10px] px-3 text-sm focus:outline-none focus:border-[#1A56DB]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#0F1F3D] mb-1.5">
                Kuota Baru (kg)
              </label>
              <input
                type="number"
                required
                value={newQuota}
                onChange={(e) => setNewQuota(Number(e.target.value))}
                className="w-full h-10.5 border border-[#DCE6F5] rounded-[10px] px-3 text-sm focus:outline-none focus:border-[#1A56DB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#0F1F3D] mb-1.5">
              Alasan Penyesuaian
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#DCE6F5] rounded-[10px] p-2.5 text-[13px] focus:outline-none focus:border-[#1A56DB] resize-none"
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-[10px] border border-[#DCE6F5] bg-white text-[#5B6B86] hover:bg-[#F6F9FE] font-semibold text-sm cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-[10px] border-none bg-[#1A56DB] hover:bg-[#123FA8] text-white font-semibold text-sm cursor-pointer shadow-xs"
            >
              Simpan Kuota
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
