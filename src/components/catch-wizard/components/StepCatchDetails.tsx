import { Cpu, Pencil, CheckCircle2 } from "lucide-react";
import { SelectField, TextField, type SelectOption } from "../../ui";
import { type CatchReportFormData } from "../../catchReportTypes";
import { type FishSpecies } from "../../../services/fish";
import { type FishingArea } from "../../../services/regions";
import { type ScaleReading } from "../../../services/iot";

interface StepCatchDetailsProps {
  form: CatchReportFormData;
  setForm: React.Dispatch<React.SetStateAction<CatchReportFormData>>;
  speciesList: FishSpecies[];
  loadingSpecies: boolean;
  wppList?: FishingArea[];
  loadingWpp?: boolean;
  pendingReadings?: ScaleReading[];
  loadingReadings?: boolean;
}

export function StepCatchDetails({
  form,
  setForm,
  speciesList,
  loadingSpecies,
  wppList = [],
  loadingWpp,
  pendingReadings = [],
  loadingReadings,
}: StepCatchDetailsProps) {
  const speciesOptions: SelectOption[] = speciesList.map((s) => ({
    value: s.name,
    label: s.scientific_name ? `${s.name} (${s.scientific_name})` : s.name,
  }));

  const wppOptions: SelectOption[] = wppList.map((w) => ({
    value: w.code,
    label: `${w.code} · ${w.nama}`,
  }));

  const scaleOptions: SelectOption[] = pendingReadings.map((r) => ({
    value: r.id,
    label: `${r.device_id} (${r.port_name || "Pelabuhan"}) · ${r.weight} ${r.unit} (${new Date(r.created_at).toLocaleTimeString("id-ID")})`,
  }));

  const isIotMode = form.entry_mode === "iot";

  const handleSelectScaleReading = (readingId: string) => {
    const selected = pendingReadings.find((r) => r.id === readingId);
    if (selected) {
      setForm((prev) => ({
        ...prev,
        scale_reading_id: selected.id,
        quantity: String(selected.weight),
        unit: selected.unit || "kg",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        scale_reading_id: readingId,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Metode Input Toggle */}
      <div className="flex flex-col gap-1.5">
        <label className="block text-xs font-bold text-soft uppercase tracking-wider">
          Metode Pengukuran Berat
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xs surface-inset border border-fco-border-subtle">
          <button
            type="button"
            onClick={() => {
              const defaultReading = pendingReadings[0];
              setForm((prev) => ({
                ...prev,
                entry_mode: "iot",
                scale_reading_id: defaultReading ? defaultReading.id : "",
                quantity: defaultReading
                  ? String(defaultReading.weight)
                  : prev.quantity,
                unit: defaultReading?.unit || prev.unit,
              }));
            }}
            className={`h-9 px-3 rounded-xs text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none ${
              isIotMode
                ? "bg-fco-blue text-white shadow-xs font-bold"
                : "bg-transparent text-soft hover:text-strong"
            }`}
          >
            <Cpu size={14} />
            <span>Timbangan Pintar IoT</span>
            {pendingReadings.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-xs bg-emerald-500 text-white text-2xs font-mono font-bold">
                {pendingReadings.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                entry_mode: "manual",
                scale_reading_id: "",
              }));
            }}
            className={`h-9 px-3 rounded-xs text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none ${
              !isIotMode
                ? "bg-fco-blue text-white shadow-xs font-bold"
                : "bg-transparent text-soft hover:text-strong"
            }`}
          >
            <Pencil size={14} />
            <span>Input Manual / Arsip TPI</span>
          </button>
        </div>
      </div>

      {/* 2. IoT Device Selector (Only in IoT Mode) */}
      {isIotMode && (
        <div className="p-3.5 rounded-xs surface-inset border border-fco-border-subtle space-y-2">
          <SelectField
            label="Pilih Sesi Timbangan Dermaga Aktif"
            id="cr-scale-reading"
            required
            searchable
            value={form.scale_reading_id ?? ""}
            onChange={(e) => handleSelectScaleReading(e.target.value)}
            placeholder={
              loadingReadings
                ? "Memuat antrean timbangan..."
                : pendingReadings.length === 0
                  ? "— Belum ada antrean beban timbangan —"
                  : "— Pilih Hasil Timbang IoT —"
            }
            options={scaleOptions}
          />

          {pendingReadings.length === 0 ? (
            <p className="m-0 text-2xs text-amber-600 dark:text-amber-400">
              Belum ada data penimbangan baru dari sensor dermaga. Silakan
              beralih ke <strong>Input Manual</strong> atau tunggu penimbangan
              berlangsung.
            </p>
          ) : (
            <div className="flex items-center gap-1.5 text-2xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 size={13} />
              <span>
                Bobot dikunci langsung dari hardware sensor dermaga terdaftar
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. Spesies & WPP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SelectField
          label="Spesies Ikan"
          id="cr-sp"
          required
          searchable
          searchPlaceholder="Cari spesies ikan..."
          placeholder={
            loadingSpecies ? "Memuat spesies ikan..." : "— Pilih Spesies Ikan —"
          }
          value={form.fish_species}
          onChange={(e) => setForm({ ...form, fish_species: e.target.value })}
          options={speciesOptions}
        />
        <SelectField
          label="Wilayah Penangkapan (WPP)"
          id="cr-wpp"
          required
          searchable
          searchPlaceholder="Cari wilayah WPP..."
          placeholder={loadingWpp ? "Memuat WPP..." : "— Pilih Wilayah WPP —"}
          value={form.wpp}
          onChange={(e) => setForm({ ...form, wpp: e.target.value })}
          options={wppOptions}
        />
      </div>

      {/* 4. Volume Tangkapan & Satuan */}
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label={isIotMode ? "Jumlah (Terkunci IoT)" : "Jumlah"}
          id="cr-q"
          type="number"
          step="0.01"
          required
          disabled={isIotMode && Boolean(form.scale_reading_id)}
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="0"
        />
        <SelectField
          label="Satuan"
          id="cr-u"
          disabled={isIotMode && Boolean(form.scale_reading_id)}
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          options={[
            { value: "kg", label: "kg (Kilogram)" },
            { value: "ton", label: "ton (Ton)" },
          ]}
        />
      </div>

      {/* 5. Nilai PNBP Estimasi */}
      <TextField
        label="Estimasi Nilai (Rp)"
        id="cr-v"
        type="number"
        step="0.01"
        hint="Opsional — PNBP dihitung otomatis."
        value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })}
        placeholder="0"
      />
    </div>
  );
}
