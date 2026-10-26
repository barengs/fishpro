import { TextField, ToggleSwitch } from "../../ui";
import { type ShipFormData } from "../../shipFormTypes";

interface StepShipSpecsProps {
  form: ShipFormData;
  setForm: React.Dispatch<React.SetStateAction<ShipFormData>>;
}

export function StepShipSpecs({ form, setForm }: StepShipSpecsProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TextField
          label="Panjang (m)"
          id="wz-length"
          type="number"
          step="0.01"
          min="0"
          formatThousand={false}
          value={form.length}
          onChange={(e) => setForm({ ...form, length: e.target.value })}
          placeholder="Contoh: 35.50"
        />
        <TextField
          label="Lebar (m)"
          id="wz-width"
          type="number"
          step="0.01"
          min="0"
          formatThousand={false}
          value={form.width}
          onChange={(e) => setForm({ ...form, width: e.target.value })}
          placeholder="Contoh: 8.20"
        />
        <TextField
          label="GT"
          id="wz-gt"
          type="number"
          step="0.01"
          min="0"
          formatThousand={false}
          hint="Menentukan tarif PNBP"
          value={form.gross_tonnage}
          onChange={(e) => setForm({ ...form, gross_tonnage: e.target.value })}
          placeholder="Contoh: 85.00"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          label="Tahun dibuat"
          id="wz-year"
          type="number"
          formatThousand={false}
          value={form.year_built}
          onChange={(e) => setForm({ ...form, year_built: e.target.value })}
          placeholder="2018"
        />
        <TextField
          label="Pelabuhan asal"
          id="wz-port"
          value={form.home_port}
          onChange={(e) => setForm({ ...form, home_port: e.target.value })}
          placeholder="Benoa / Muara Baru"
        />
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
