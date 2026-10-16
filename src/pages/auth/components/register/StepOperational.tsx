import type { Role } from "./types";
import { SelectField } from "../../../../components/ui";

interface StepOperationalProps {
  role: Role;
  licenseNumber: string;
  setLicenseNumber: (val: string) => void;
  experienceYears: string;
  setExperienceYears: (val: string) => void;
  shipReg: string;
  setShipReg: (val: string) => void;
  shipName: string;
  setShipName: (val: string) => void;
  homePort: string;
  setHomePort: (val: string) => void;
  wpp: string;
  setWpp: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  nip: string;
  setNip: (val: string) => void;
}

const inputCls =
  "w-full h-11 border border-fco-border rounded-xl px-3.5 text-sm field-input focus:outline-none focus:border-fco-blue";
const labelCls = "block text-sm font-semibold text-strong mb-1.5";

export function StepOperational({
  role,
  licenseNumber,
  setLicenseNumber,
  experienceYears,
  setExperienceYears,
  shipReg,
  setShipReg,
  shipName,
  setShipName,
  homePort,
  setHomePort,
  wpp,
  setWpp,
  department,
  setDepartment,
  nip,
  setNip,
}: StepOperationalProps) {
  return (
    <div>
      <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">
        {role === "owner"
          ? "Data kapal"
          : role === "captain"
            ? "Data pelaut"
            : "Data pengawas"}
      </h3>
      <p className="m-0 mb-5 text-sm text-soft">
        {role === "owner"
          ? "Kapal yang Anda daftarkan."
          : role === "captain"
            ? "Lisensi dan kapal yang Anda awak."
            : "Satker dan identitas dinas."}
      </p>

      {role === "captain" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="rg-lic" className={labelCls}>
                No. lisensi
                <span className="text-soft font-normal text-xs ml-1.5">
                  (optional)
                </span>
              </label>
              <input
                id="rg-lic"
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="SKN-..."
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="rg-exp" className={labelCls}>
                Pengalaman (tahun)
                <span className="text-soft font-normal text-xs ml-1.5">
                  (optional)
                </span>
              </label>
              <input
                id="rg-exp"
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor="rg-ship" className={labelCls}>
              No. kapal yang diawaki
              <span className="text-soft font-normal text-xs ml-1.5">
                (optional)
              </span>
            </label>
            <input
              id="rg-ship"
              type="text"
              value={shipReg}
              onChange={(e) => setShipReg(e.target.value)}
              placeholder="REG-... (boleh kosong)"
              className={inputCls}
            />
          </div>
        </div>
      )}

      {role === "owner" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="rg-shipname" className={labelCls}>
                Nama kapal
                <span className="text-soft font-normal text-xs ml-1.5">
                  (optional)
                </span>
              </label>
              <input
                id="rg-shipname"
                type="text"
                value={shipName}
                onChange={(e) => setShipName(e.target.value)}
                placeholder="KM ..."
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="rg-shipreg" className={labelCls}>
                No. kapal (SIPI)
                <span className="text-soft font-normal text-xs ml-1.5">
                  (optional)
                </span>
              </label>
              <input
                id="rg-shipreg"
                type="text"
                value={shipReg}
                onChange={(e) => setShipReg(e.target.value)}
                placeholder="REG-..."
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="rg-port" className={labelCls}>
                Pelabuhan
                <span className="text-soft font-normal text-xs ml-1.5">
                  (optional)
                </span>
              </label>
              <input
                id="rg-port"
                type="text"
                value={homePort}
                onChange={(e) => setHomePort(e.target.value)}
                placeholder="Benoa"
                className={inputCls}
              />
            </div>
            <SelectField
              label="WPP"
              id="rg-wpp"
              optional
              value={wpp}
              onChange={(e) => setWpp(e.target.value)}
              options={[
                { value: "WPP 573", label: "573 — Hindia Selatan Jawa" },
                { value: "WPP 711", label: "711 — Karimata & Natuna" },
                { value: "WPP 712", label: "712 — Laut Jawa" },
                { value: "WPP 713", label: "713 — Makassar & Flores" },
              ]}
            />
          </div>
        </div>
      )}

      {role === "regulator" && (
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="rg-dept" className={labelCls}>
              Satuan kerja
              <span className="text-soft font-normal text-xs ml-1.5">
                (optional)
              </span>
            </label>
            <input
              id="rg-dept"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="rg-nip" className={labelCls}>
              NIP / ID pengawas
              <span className="text-soft font-normal text-xs ml-1.5">
                (optional)
              </span>
            </label>
            <input
              id="rg-nip"
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="18 digit NIP"
              className={inputCls}
            />
          </div>
        </div>
      )}
    </div>
  );
}
