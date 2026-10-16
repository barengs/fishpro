import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FormField, inputCls } from "./FormField";
import { emptyShipForm, type ShipFormData } from "./shipFormTypes";
import { ownersService, type Owner } from "../services/owners";
import { captainsService, type Captain } from "../services/captains";

const steps = [
  { num: 1, title: "Identitas" },
  { num: 2, title: "Spesifikasi" },
  { num: 3, title: "Cek" },
];

interface ShipFormWizardProps {
  onSubmit: (data: ShipFormData) => void;
  fixedOwnerId?: number;
}

export function ShipFormWizard({
  onSubmit,
  fixedOwnerId,
}: ShipFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<ShipFormData>({
    ...emptyShipForm,
    owner: fixedOwnerId ? String(fixedOwnerId) : "",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);

  useEffect(() => {
    // Load available owners and captains in background for easy selection
    Promise.all([
      ownersService.getAll().catch(() => []),
      captainsService.getAll().catch(() => []),
    ]).then(([ownersData, captainsData]) => {
      setOwners(ownersData);
      setCaptains(captainsData);
    });
  }, []);

  const handleNext = () => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!form.name.trim()) {
        setErrorMsg("Nama kapal masih kosong.");
        return;
      }
      if (!form.registration_number.trim()) {
        setErrorMsg("Nomor registrasi masih kosong.");
        return;
      }
    }
    setCurrentStep((p) => Math.min(3, p + 1));
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep((p) => Math.max(1, p - 1));
  };

  const handleSubmit = () => {
    onSubmit({ ...form });
    setForm(emptyShipForm);
    setCurrentStep(1);
    setErrorMsg(null);
  };

  const selectedOwnerName =
    owners.find((o) => String(o.id) === String(form.owner))?.full_name ||
    form.owner ||
    "—";
  const selectedCaptainName =
    captains.find((c) => String(c.id) === String(form.captain))?.full_name ||
    form.captain ||
    "—";

  return (
    <div>
      {/* Stepper */}
      <div className="mb-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-4 h-0.5 bg-fco-border z-0" />
          <div
            className="absolute left-6 top-4 h-0.5 bg-fco-blue z-0 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 88}%`,
            }}
          />
          {steps.map((s) => {
            const isPassed = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className="flex flex-col items-center gap-1.5 relative px-1"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCurrent
                      ? "bg-fco-blue text-white ring-4 ring-fco-blue/15"
                      : isPassed
                        ? "bg-fco-blue text-white"
                        : "surface-card border-2 border-fco-border text-soft"
                  }`}
                >
                  {isPassed ? "✓" : s.num}
                </div>
                <span
                  className={`text-xs font-semibold ${isCurrent ? "text-fco-blue" : isPassed ? "text-strong" : "text-fco-placeholder"}`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20"
        >
          {errorMsg}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* STEP 1: IDENTITAS */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-3.5">
              <FormField label="Nama kapal" htmlFor="wz-name" required>
                <input
                  id="wz-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: KM Samudra Jaya"
                  className={inputCls}
                />
              </FormField>
              <FormField
                label="Nomor registrasi"
                htmlFor="wz-reg"
                required
                hint="Unik, format: REG-XXXX"
              >
                <input
                  id="wz-reg"
                  value={form.registration_number}
                  onChange={(e) =>
                    setForm({ ...form, registration_number: e.target.value })
                  }
                  placeholder="Contoh: REG-0412"
                  className={inputCls}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Pemilik (Owner)" htmlFor="wz-owner">
                  {owners.length > 0 && !fixedOwnerId ? (
                    <select
                      id="wz-owner"
                      value={form.owner || ""}
                      onChange={(e) =>
                        setForm({ ...form, owner: e.target.value })
                      }
                      className={inputCls}
                    >
                      <option value="">— Pilih Pemilik —</option>
                      {owners.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.full_name} (
                          {o.owner_type === "company" ? "PT" : "Pribadi"})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="wz-owner"
                      value={form.owner || ""}
                      disabled={Boolean(fixedOwnerId)}
                      onChange={(e) =>
                        setForm({ ...form, owner: e.target.value })
                      }
                      placeholder="ID atau Nama Pemilik"
                      className={inputCls}
                    />
                  )}
                </FormField>

                <FormField label="Nahkoda (Captain)" htmlFor="wz-captain">
                  {captains.length > 0 ? (
                    <select
                      id="wz-captain"
                      value={form.captain || ""}
                      onChange={(e) =>
                        setForm({ ...form, captain: e.target.value })
                      }
                      className={inputCls}
                    >
                      <option value="">— Pilih Nahkoda (Boleh Kosong) —</option>
                      {captains.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} ({c.license_number})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="wz-captain"
                      value={form.captain || ""}
                      onChange={(e) =>
                        setForm({ ...form, captain: e.target.value })
                      }
                      placeholder="Nama nahkoda"
                      className={inputCls}
                    />
                  )}
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 2: SPESIFIKASI */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Panjang (m)" htmlFor="wz-length">
                  <input
                    id="wz-length"
                    type="number"
                    step="0.01"
                    value={form.length}
                    onChange={(e) =>
                      setForm({ ...form, length: e.target.value })
                    }
                    placeholder="18.0"
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Lebar (m)" htmlFor="wz-width">
                  <input
                    id="wz-width"
                    type="number"
                    step="0.01"
                    value={form.width}
                    onChange={(e) =>
                      setForm({ ...form, width: e.target.value })
                    }
                    placeholder="5.2"
                    className={inputCls}
                  />
                </FormField>
                <FormField
                  label="GT"
                  htmlFor="wz-gt"
                  hint="Menentukan tarif PNBP"
                >
                  <input
                    id="wz-gt"
                    type="number"
                    step="0.01"
                    value={form.gross_tonnage}
                    onChange={(e) =>
                      setForm({ ...form, gross_tonnage: e.target.value })
                    }
                    placeholder="42.5"
                    className={inputCls}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Tahun dibuat" htmlFor="wz-year">
                  <input
                    id="wz-year"
                    type="number"
                    value={form.year_built}
                    onChange={(e) =>
                      setForm({ ...form, year_built: e.target.value })
                    }
                    placeholder="2018"
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Pelabuhan asal" htmlFor="wz-port">
                  <input
                    id="wz-port"
                    value={form.home_port}
                    onChange={(e) =>
                      setForm({ ...form, home_port: e.target.value })
                    }
                    placeholder="Benoa / Muara Baru"
                    className={inputCls}
                  />
                </FormField>
              </div>
              <FormField label="Status kapal" htmlFor="wz-status">
                <select
                  id="wz-status"
                  value={form.active ? "active" : "inactive"}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.value === "active" })
                  }
                  className={inputCls}
                >
                  <option value="active">
                    Aktif — beroperasi & bisa melapor
                  </option>
                  <option value="inactive">
                    Nonaktif — dok / izin mati / dijual
                  </option>
                </select>
              </FormField>
            </div>
          )}

          {/* STEP 3: CEK */}
          {currentStep === 3 && (
            <div>
              <h3 className="m-0 mb-1 text-lg font-extrabold text-strong">
                Cek ringkasan kapal
              </h3>
              <p className="m-0 mb-4 text-sm text-soft">
                Pastikan nama dan nomor registrasi sudah benar.
              </p>
              <dl className="m-0 p-4 rounded-xl surface-inset border text-sm flex flex-col gap-2.5">
                <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
                  <dt className="text-soft">Kapal</dt>
                  <dd className="m-0 font-bold text-strong text-right">
                    {form.name} · {form.registration_number}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
                  <dt className="text-soft">Pemilik</dt>
                  <dd className="m-0 text-strong text-right">
                    {selectedOwnerName}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
                  <dt className="text-soft">Nahkoda</dt>
                  <dd className="m-0 text-strong text-right">
                    {selectedCaptainName}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <dt className="text-soft">Dimensi / GT / Status</dt>
                  <dd className="m-0 text-strong text-right tabular-nums">
                    {form.length || "—"} × {form.width || "—"} m ·{" "}
                    {form.gross_tonnage || "—"} GT ·{" "}
                    {form.active ? "Aktif" : "Nonaktif"}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2.5 mt-5">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 h-11 rounded-xl text-sm border border-fco-border surface-card text-strong font-semibold cursor-pointer transition-colors"
          >
            Kembali
          </button>
        )}
        {currentStep < 3 ? (
          <motion.button
            type="button"
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors"
          >
            Lanjut
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={handleSubmit}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors"
          >
            Simpan kapal
          </motion.button>
        )}
      </div>
    </div>
  );
}
