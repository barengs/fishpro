import { FormField, inputCls } from "../../FormField";
import { SelectField } from "../../ui";
import { type CatchReportFormData } from "../../catchReportTypes";

interface StepCatchDetailsProps {
  form: CatchReportFormData;
  setForm: React.Dispatch<React.SetStateAction<CatchReportFormData>>;
}

export function StepCatchDetails({ form, setForm }: StepCatchDetailsProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Spesies" htmlFor="cr-sp" required>
          <input
            id="cr-sp"
            value={form.fish_species}
            onChange={(e) => setForm({ ...form, fish_species: e.target.value })}
            placeholder="Tongkol"
            className={inputCls}
          />
        </FormField>
        <FormField label="WPP" htmlFor="cr-wpp">
          <input
            id="cr-wpp"
            value={form.wpp}
            onChange={(e) => setForm({ ...form, wpp: e.target.value })}
            placeholder="WPP 573"
            className={inputCls}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Jumlah" htmlFor="cr-q" required>
          <input
            id="cr-q"
            type="number"
            step="0.01"
            min="0"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className={inputCls}
          />
        </FormField>
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

      <FormField
        label="Nilai (Rp)"
        htmlFor="cr-v"
        hint="Opsional — PNBP dihitung otomatis."
      >
        <input
          id="cr-v"
          type="number"
          step="0.01"
          min="0"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className={inputCls}
        />
      </FormField>
    </div>
  );
}
