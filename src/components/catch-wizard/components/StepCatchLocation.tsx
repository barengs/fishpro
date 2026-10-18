import { Navigation } from "lucide-react";
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

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-soft">
            Koordinat lokasi
          </span>
          <button
            type="button"
            onClick={onGetLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-fco-blue bg-fco-blue-light dark:bg-fco-blue/15 hover:bg-fco-blue/25 border border-fco-blue-border dark:border-fco-blue/30 transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            <Navigation
              size={13}
              className={isLocating ? "animate-spin" : ""}
              aria-hidden="true"
            />
            <span>
              {isLocating ? "Mendeteksi GPS..." : "Gunakan GPS otomatis"}
            </span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Latitude" htmlFor="cr-lat" required>
            <input
              id="cr-lat"
              value={form.location_latitude}
              onChange={(e) =>
                setForm({ ...form, location_latitude: e.target.value })
              }
              placeholder="-8.740000"
              className={inputCls}
            />
          </FormField>
          <FormField label="Longitude" htmlFor="cr-lng" required>
            <input
              id="cr-lng"
              value={form.location_longitude}
              onChange={(e) =>
                setForm({ ...form, location_longitude: e.target.value })
              }
              placeholder="115.200000"
              className={inputCls}
            />
          </FormField>
        </div>
      </div>

      <FormField label="Catatan lokasi" htmlFor="cr-desc">
        <input
          id="cr-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Opsional"
          className={inputCls}
        />
      </FormField>
    </div>
  );
}
