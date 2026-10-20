import { SelectField, TextField, type SelectOption } from "../../ui";
import { type CatchReportFormData } from "../../catchReportTypes";
import { type FishSpecies } from "../../../services/fish";
import { type FishingArea } from "../../../services/regions";

interface StepCatchDetailsProps {
  form: CatchReportFormData;
  setForm: React.Dispatch<React.SetStateAction<CatchReportFormData>>;
  speciesList: FishSpecies[];
  loadingSpecies: boolean;
  wppList?: FishingArea[];
  loadingWpp?: boolean;
}

export function StepCatchDetails({
  form,
  setForm,
  speciesList,
  loadingSpecies,
  wppList = [],
  loadingWpp,
}: StepCatchDetailsProps) {
  const speciesOptions: SelectOption[] = speciesList.map((s) => ({
    value: s.name,
    label: s.scientific_name ? `${s.name} (${s.scientific_name})` : s.name,
  }));

  const wppOptions: SelectOption[] = wppList.map((w) => ({
    value: w.code,
    label: `${w.code} · ${w.nama}`,
  }));

  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SelectField
          label="Spesies"
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
          label="WPP"
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

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Jumlah"
          id="cr-q"
          type="number"
          step="0.01"
          required
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="0"
        />
        <SelectField
          label="Satuan"
          id="cr-u"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          options={[
            { value: "kg", label: "kg (Kilogram)" },
            { value: "ton", label: "ton (Ton)" },
          ]}
        />
      </div>

      <TextField
        label="Nilai (Rp)"
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
