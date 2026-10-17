import { useState } from "react";

interface ManualQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    shipReg: string;
    year: number;
    newQuota: number;
    reason: string;
  }) => void;
  initialShipReg?: string;
}

export function ManualQuotaModal({
  isOpen,
  onClose,
  onSave,
  initialShipReg = "",
}: ManualQuotaModalProps) {
  const [shipReg, setShipReg] = useState(initialShipReg);
  const [year, setYear] = useState(2026);
  const [newQuota, setNewQuota] = useState(15000);
  const [reason, setReason] = useState(
    "Penyesuaian kuota berdasarkan rekomendasi optimasi NSGA-III",
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ shipReg, year, newQuota, reason });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-fco-dark/50 backdrop-blur-xs flex items-center justify-center z-50 p-5">
      <div className="surface-card rounded-xl p-7 sm:p-8 max-w-120 w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold m-0 text-strong">
            Penyesuaian Manual Kuota
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer text-soft hover:text-strong"
          >
            ×
          </button>
        </div>

        <p className="text-fco-sm text-soft mt-0 mb-5 leading-relaxed">
          Hak regulator: Menyesuaikan batas kuota kapal penangkap ikan dengan
          validasi blockchain terverifikasi.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-fco-sm font-semibold text-strong mb-1.5">
              Nomor Registrasi Kapal
              <span
                className="text-red-500 ml-1 font-bold"
                aria-label="mandatory"
                title="Mandatory"
              >
                *
              </span>
            </label>
            <input
              type="text"
              required
              value={shipReg}
              onChange={(e) => setShipReg(e.target.value)}
              placeholder="Contoh: REG-0087"
              className="w-full h-10.5 border border-fco-border rounded-fco px-3 text-sm focus:outline-hidden focus:border-fco-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-fco-sm font-semibold text-strong mb-1.5">
                Tahun Kuota
                <span
                  className="text-red-500 ml-1 font-bold"
                  aria-label="mandatory"
                  title="Mandatory"
                >
                  *
                </span>
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full h-10.5 border border-fco-border rounded-fco px-3 text-sm focus:outline-hidden focus:border-fco-blue"
              />
            </div>
            <div>
              <label className="block text-fco-sm font-semibold text-strong mb-1.5">
                Kuota Baru (kg)
                <span
                  className="text-red-500 ml-1 font-bold"
                  aria-label="mandatory"
                  title="Mandatory"
                >
                  *
                </span>
              </label>
              <input
                type="number"
                required
                value={newQuota}
                onChange={(e) => setNewQuota(Number(e.target.value))}
                className="w-full h-10.5 border border-fco-border rounded-fco px-3 text-sm focus:outline-hidden focus:border-fco-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-fco-sm font-semibold text-strong mb-1.5">
              Alasan Penyesuaian
              <span className="text-soft font-normal text-xs ml-1.5">
                (optional)
              </span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-fco-border rounded-fco p-2.5 text-fco-sm focus:outline-hidden focus:border-fco-blue resize-none"
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-fco border border-fco-border bg-white text-soft hover:surface-page font-semibold text-sm cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-fco border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold text-sm cursor-pointer shadow-xs"
            >
              Simpan Kuota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
