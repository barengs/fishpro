import { useEffect, useState } from "react";
import { FormField, inputCls } from "../../FormField";
import { SelectField } from "../../ui";
import { type CatchReportFormData } from "../../catchReportTypes";

interface StepCatchLocationProps {
  form: CatchReportFormData;
  setForm: React.Dispatch<React.SetStateAction<CatchReportFormData>>;
  shipSelector?: React.ReactNode;
  isLocating: boolean;
  onGetLocation: () => void;
}

export function StepCatchLocation({
  form,
  setForm,
  shipSelector,
  isLocating,
  onGetLocation,
}: StepCatchLocationProps) {
  const [dots, setDots] = useState(".");

  // Progressive dot animation cycling "." -> ".." -> "..."
  useEffect(() => {
    if (!isLocating) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 400);

    return () => {
      clearInterval(interval);
      setDots(".");
    };
  }, [isLocating]);

  return (
    <div className="flex flex-col gap-3.5">
      {shipSelector && <div>{shipSelector}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Tanggal" htmlFor="cr-date" required>
          <input
            id="cr-date"
            type="date"
            value={form.catch_date}
            onChange={(e) => setForm({ ...form, catch_date: e.target.value })}
            className={inputCls}
          />
        </FormField>
        <SelectField
          label="Jenis Tangkapan"
          id="cr-type"
          required
          value={form.catch_type}
          onChange={(e) => setForm({ ...form, catch_type: e.target.value })}
          options={[
            { value: "pelagic", label: "Pelagis" },
            { value: "demersal", label: "Demersal" },
            { value: "reef", label: "Terumbu Karang" },
          ]}
        />
      </div>

      {/* Koordinat & Lokasi GPS */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-soft uppercase tracking-wider block">
          Koordinat Penangkapan
        </label>

        {/* Tombol GPS Tanpa Ikon Pesawat + Animasi Dots Progresif */}
        <button
          type="button"
          onClick={onGetLocation}
          disabled={isLocating}
          className="w-full h-11 px-4 rounded-xs border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100/90 dark:hover:bg-blue-900/50 text-fco-blue dark:text-blue-300 font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-[0.99] disabled:opacity-60"
        >
          <span>
            {isLocating
              ? `Mendeteksi lokasi${dots}`
              : "Ambil Lokasi Otomatis (GPS & Jaringan)"}
          </span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-0.5">
          <FormField label="Latitude" htmlFor="cr-lat" required>
            <div className="relative">
              <input
                id="cr-lat"
                value={form.location_latitude}
                onChange={(e) =>
                  setForm({ ...form, location_latitude: e.target.value })
                }
                placeholder={
                  isLocating ? `Mengambil latitude${dots}` : "Contoh: -8.740000"
                }
                disabled={isLocating}
                className={`${inputCls} ${
                  isLocating
                    ? "pr-24 border-fco-blue/60 bg-blue-50/30 dark:bg-blue-950/20"
                    : ""
                }`}
              />
              {isLocating && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-fco-blue animate-ping" />
                  <span className="text-2xs font-mono font-bold text-fco-blue">
                    Memuat{dots}
                  </span>
                </div>
              )}
              {isLocating && (
                <div className="absolute bottom-0 inset-x-1 h-0.5 overflow-hidden rounded-b-xs">
                  <div className="h-full bg-fco-blue animate-pulse w-full" />
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Longitude" htmlFor="cr-lng" required>
            <div className="relative">
              <input
                id="cr-lng"
                value={form.location_longitude}
                onChange={(e) =>
                  setForm({ ...form, location_longitude: e.target.value })
                }
                placeholder={
                  isLocating
                    ? `Mengambil longitude${dots}`
                    : "Contoh: 115.200000"
                }
                disabled={isLocating}
                className={`${inputCls} ${
                  isLocating
                    ? "pr-24 border-fco-blue/60 bg-blue-50/30 dark:bg-blue-950/20"
                    : ""
                }`}
              />
              {isLocating && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-fco-blue animate-ping" />
                  <span className="text-2xs font-mono font-bold text-fco-blue">
                    Memuat{dots}
                  </span>
                </div>
              )}
              {isLocating && (
                <div className="absolute bottom-0 inset-x-1 h-0.5 overflow-hidden rounded-b-xs">
                  <div className="h-full bg-fco-blue animate-pulse w-full" />
                </div>
              )}
            </div>
          </FormField>
        </div>
      </div>

      <FormField
        label="Catatan lokasi"
        htmlFor="cr-desc"
        hint="Terisi otomatis saat GPS aktif, atau ketik nama lokasi/perairan manual."
      >
        <div className="relative">
          <input
            id="cr-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={
              isLocating
                ? `Mencari nama perairan${dots}`
                : "Contoh: Teluk Benoa, Denpasar, Bali"
            }
            disabled={isLocating}
            className={`${inputCls} ${
              isLocating
                ? "pr-28 border-fco-blue/60 bg-blue-50/30 dark:bg-blue-950/20"
                : ""
            }`}
          />
          {isLocating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-fco-blue animate-ping" />
              <span className="text-2xs font-mono font-bold text-fco-blue">
                Mencari perairan{dots}
              </span>
            </div>
          )}
          {isLocating && (
            <div className="absolute bottom-0 inset-x-1 h-0.5 overflow-hidden rounded-b-xs">
              <div className="h-full bg-fco-blue animate-pulse w-full" />
            </div>
          )}
        </div>
      </FormField>
    </div>
  );
}
