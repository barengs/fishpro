import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FormField, inputCls } from "./FormField";
import { SelectField } from "./ui";
import { emptyShipForm, type ShipFormData } from "./shipFormTypes";
import { ownersService, type Owner } from "../services/owners";
import { captainsService, type Captain } from "../services/captains";
import { shipFormSchema } from "../utils/schemas";
import type { Ship } from "../services/ships";

const steps = [
  { num: 1, title: "Identitas" },
  { num: 2, title: "Spesifikasi" },
  { num: 3, title: "Cek" },
];

interface ShipFormWizardProps {
  onSubmit: (data: ShipFormData) => void;
  fixedOwnerId?: number;
  initialData?: Ship | null;
  submitLabel?: string;
}

export function ShipFormWizard({
  onSubmit,
  fixedOwnerId,
  initialData,
  submitLabel,
}: ShipFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<ShipFormData>(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        registration_number: initialData.registration_number || "",
        owner: initialData.owner
          ? String(initialData.owner)
          : fixedOwnerId
            ? String(fixedOwnerId)
            : "",
        captain: initialData.captain ? String(initialData.captain) : "",
        length:
          initialData.length !== null && initialData.length !== undefined
            ? String(initialData.length)
            : "",
        width:
          initialData.width !== null && initialData.width !== undefined
            ? String(initialData.width)
            : "",
        gross_tonnage:
          initialData.gross_tonnage !== null &&
          initialData.gross_tonnage !== undefined
            ? String(initialData.gross_tonnage)
            : "",
        engine_power: "",
        vessel_type: "purse_seine",
        fuel_type: "diesel",
        year_built:
          initialData.year_built !== null &&
          initialData.year_built !== undefined
            ? String(initialData.year_built)
            : "",
        home_port: initialData.home_port || "",
        active: initialData.active ?? true,
      };
    }
    return {
      ...emptyShipForm,
      owner: fixedOwnerId ? String(fixedOwnerId) : "",
    };
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
      const step1Schema = shipFormSchema.pick({
        name: true,
        registration_number: true,
      });
      const parsed = step1Schema.safeParse(form);
      if (!parsed.success) {
        setErrorMsg(
          parsed.error.issues[0]?.message || "Identitas kapal belum valid.",
        );
        return;
      }
    } else if (currentStep === 2) {
      const step2Schema = shipFormSchema.pick({
        gross_tonnage: true,
      });
      const parsed = step2Schema.safeParse(form);
      if (!parsed.success) {
        setErrorMsg(
          parsed.error.issues[0]?.message || "Spesifikasi kapal belum valid.",
        );
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
      <div className="relative mb-6 pt-1">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const isPassed = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={s.num}
                className="flex-1 relative flex flex-col items-center"
              >
                {/* Connecting track between steps */}
                {!isLast && (
                  <div className="absolute top-4 -translate-y-1/2 left-1/2 w-full h-0.5 bg-fco-border dark:bg-fco-border-dark z-0">
                    <div
                      className="h-full bg-fco-blue transition-all duration-300"
                      style={{ width: currentStep > s.num ? "100%" : "0%" }}
                    />
                  </div>
                )}

                {/* Step Circle */}
                <div
                  className={`relative z-1 w-8 h-8 rounded-full grid place-items-center font-bold text-xs sm:text-sm transition-all ${
                    isCurrent
                      ? "border-2 border-fco-blue bg-fco-blue text-white ring-4 ring-fco-blue/15"
                      : isPassed
                        ? "border-2 border-fco-blue bg-fco-blue text-white"
                        : "border-2 border-fco-border dark:border-fco-border-dark surface-card text-soft"
                  }`}
                >
                  <span className="leading-none tabular-nums select-none flex items-center justify-center text-center">
                    {isPassed ? "✓" : s.num}
                  </span>
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2 text-xs font-semibold tracking-tight text-center ${
                    isCurrent
                      ? "text-fco-blue font-bold"
                      : isPassed
                        ? "text-strong"
                        : "text-soft"
                  }`}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {owners.length > 0 && !fixedOwnerId ? (
                  <SelectField
                    label="Pemilik (Owner)"
                    id="wz-owner"
                    searchable
                    searchPlaceholder="Cari nama pemilik..."
                    value={form.owner || ""}
                    onChange={(e) =>
                      setForm({ ...form, owner: e.target.value })
                    }
                    options={[
                      { value: "", label: "— Pilih Pemilik —" },
                      ...owners.map((o) => ({
                        value: o.id,
                        label: `${o.full_name} (${o.owner_type === "company" ? "PT" : "Pribadi"})`,
                      })),
                    ]}
                  />
                ) : (
                  <FormField label="Pemilik (Owner)" htmlFor="wz-owner">
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
                  </FormField>
                )}

                {captains.length > 0 ? (
                  <SelectField
                    label="Nahkoda (Captain)"
                    id="wz-captain"
                    searchable
                    searchPlaceholder="Cari nama atau nomor lisensi..."
                    value={form.captain || ""}
                    onChange={(e) =>
                      setForm({ ...form, captain: e.target.value })
                    }
                    options={[
                      { value: "", label: "— Tanpa Nahkoda —" },
                      ...captains.map((c) => ({
                        value: c.id,
                        label: `${c.full_name} (${c.license_number})`,
                      })),
                    ]}
                  />
                ) : (
                  <FormField label="Nahkoda (Captain)" htmlFor="wz-captain">
                    <input
                      id="wz-captain"
                      value={form.captain || ""}
                      onChange={(e) =>
                        setForm({ ...form, captain: e.target.value })
                      }
                      placeholder="ID atau Nama Nahkoda"
                      className={inputCls}
                    />
                  </FormField>
                )}
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
              <SelectField
                label="Status kapal"
                id="wz-status"
                value={form.active ? "active" : "inactive"}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.value === "active" })
                }
                options={[
                  {
                    value: "active",
                    label: "Aktif — beroperasi & bisa melapor",
                  },
                  {
                    value: "inactive",
                    label: "Nonaktif — dok / izin mati / dijual",
                  },
                ]}
              />
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
            {submitLabel || (initialData ? "Perbarui Kapal" : "Simpan Kapal")}
          </motion.button>
        )}
      </div>
    </div>
  );
}
