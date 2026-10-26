import { FormField, inputCls } from "../../FormField";
import { SelectField } from "../../ui";
import { type ShipFormData } from "../../shipFormTypes";
import { type Owner } from "../../../services/owners";
import { type Captain } from "../../../services/captains";

interface StepShipIdentityProps {
  form: ShipFormData;
  setForm: React.Dispatch<React.SetStateAction<ShipFormData>>;
  owners: Owner[];
  captains: Captain[];
  fixedOwnerId?: number;
}

export function StepShipIdentity({
  form,
  setForm,
  owners,
  captains,
  fixedOwnerId,
}: StepShipIdentityProps) {
  return (
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
            onChange={(e) => setForm({ ...form, owner: e.target.value })}
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
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
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
            onChange={(e) => setForm({ ...form, captain: e.target.value })}
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
              onChange={(e) => setForm({ ...form, captain: e.target.value })}
              placeholder="ID atau Nama Nahkoda"
              className={inputCls}
            />
          </FormField>
        )}
      </div>
    </div>
  );
}
