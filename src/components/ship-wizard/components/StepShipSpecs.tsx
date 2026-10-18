import { FormField, inputCls } from "../../FormField";
import { ToggleSwitch } from "../../ui";
import { type ShipFormData } from "../../shipFormTypes";

interface StepShipSpecsProps {
  form: ShipFormData;
  setForm: React.Dispatch<React.SetStateAction<ShipFormData>>;
}

export function StepShipSpecs({ form, setForm }: StepShipSpecsProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField label="Panjang (m)" htmlFor="wz-length">
          <input
            id="wz-length"
            type="number"
            step="0.01"
            value={form.length}
            onChange={(e) => setForm({ ...form, length: e.target.value })}
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
            onChange={(e) => setForm({ ...form, width: e.target.value })}
            placeholder="5.2"
            className={inputCls}
          />
        </FormField>
        <FormField label="GT" htmlFor="wz-gt" hint="Menentukan tarif PNBP">
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
            onChange={(e) => setForm({ ...form, year_built: e.target.value })}
            placeholder="2018"
            className={inputCls}
          />
        </FormField>
        <FormField label="Pelabuhan asal" htmlFor="wz-port">
          <input
            id="wz-port"
            value={form.home_port}
            onChange={(e) => setForm({ ...form, home_port: e.target.value })}
            placeholder="Benoa / Muara Baru"
            className={inputCls}
          />
        </FormField>
      </div>

      <ToggleSwitch
        id="wz-status-toggle"
        checked={form.active}
        onChange={(checked) => setForm({ ...form, active: checked })}
        label="Status Operasional Kapal"
      />
    </div>
  );
}
