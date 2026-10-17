import { useEffect, useState } from "react";
import { Clock, FileText, MapPin, Plus, RotateCcw, Ship } from "lucide-react";
import type { Role } from "./types";
import { SelectField } from "../../../../components/ui";
import {
  shipsService,
  type Ship as ShipItem,
} from "../../../../services/ships";

interface StepOperationalProps {
  role: Role;
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
}

const inputCls =
  "w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl pl-10 pr-3.5 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft";
const labelCls = "block text-sm font-semibold text-strong mb-1.5";

const wppOptions = [
  { value: "WPP 571", label: "WPPNRI 571 — Selat Malaka & Laut Andaman" },
  { value: "WPP 572", label: "WPPNRI 572 — Samudera Hindia Barat Sumatera" },
  { value: "WPP 573", label: "WPPNRI 573 — Samudera Hindia Selatan Jawa" },
  { value: "WPP 711", label: "WPPNRI 711 — Selat Karimata & Laut Natuna" },
  { value: "WPP 712", label: "WPPNRI 712 — Laut Jawa" },
  { value: "WPP 713", label: "WPPNRI 713 — Selat Makassar & Laut Flores" },
  { value: "WPP 714", label: "WPPNRI 714 — Teluk Tolo & Laut Banda" },
  { value: "WPP 718", label: "WPPNRI 718 — Laut Arafuru & Laut Timor" },
];

export function StepOperational({
  role,
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
}: StepOperationalProps) {
  const [ships, setShips] = useState<ShipItem[]>([]);
  const [loadingShips, setLoadingShips] = useState(false);
  const [manualShipMode, setManualShipMode] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadShips() {
      setLoadingShips(true);
      try {
        const data = await shipsService.getAll();
        if (!ignore) {
          setShips(data);
          if (data.length === 0) {
            setManualShipMode(true);
          }
        }
      } catch {
        if (!ignore) {
          setManualShipMode(true);
        }
      } finally {
        if (!ignore) setLoadingShips(false);
      }
    }
    loadShips();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSelectShip = (selectedReg: string) => {
    setShipReg(selectedReg);
    const found = ships.find((s) => s.registration_number === selectedReg);
    if (found) {
      setShipName(found.name);
      if (found.home_port && !homePort) {
        setHomePort(found.home_port);
      }
    } else {
      setShipName("");
    }
  };

  return (
    <div className="flex flex-col gap-4.5">
      {/* 1. Baris Wilayah & Pelabuhan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="rg-port" className={labelCls}>
            Pelabuhan Pangkalan Utama
          </label>
          <div className="relative">
            <MapPin
              size={17}
              className="text-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="rg-port"
              type="text"
              value={homePort}
              onChange={(e) => setHomePort(e.target.value)}
              placeholder="Contoh: Pelabuhan Benoa"
              className={inputCls}
            />
          </div>
        </div>

        <SelectField
          label="Wilayah Penangkapan (WPP) Utama"
          id="rg-wpp"
          searchable
          searchPlaceholder="Cari wilayah WPP..."
          value={wpp}
          onChange={(e) => setWpp(e.target.value)}
          options={wppOptions}
        />
      </div>

      {/* 2. Khusus Nahkoda: Pengalaman Berlayar */}
      {role === "captain" && (
        <div>
          <label htmlFor="rg-exp" className={labelCls}>
            Pengalaman Berlayar (Tahun)
          </label>
          <div className="relative">
            <Clock
              size={17}
              className="text-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="rg-exp"
              type="number"
              min="0"
              max="60"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="Contoh: 5"
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* 3. Pemilihan Kapal: Dropdown Terdaftar (Nama & Nomor Registrasi) atau Input Baru */}
      <div className="pt-2 border-t border-fco-border-subtle flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-strong">
              {role === "owner" ? "Kapal Armada Utama" : "Kapal yang Diawaki"}
              <span className="text-soft font-normal text-xs ml-1.5">
                (opsional)
              </span>
            </label>
            <p className="m-0 text-xs text-soft mt-0.5">
              Pilih kapal terdaftar di database KKP untuk ditautkan langsung ke
              akun Anda.
            </p>
          </div>

          {ships.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setManualShipMode(!manualShipMode);
                setShipReg("");
                setShipName("");
              }}
              className="text-xs font-semibold text-fco-blue hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1 shrink-0 p-0 self-start sm:self-auto"
            >
              {manualShipMode ? (
                <>
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>Pilih dari Daftar</span>
                </>
              ) : (
                <>
                  <Plus size={13} aria-hidden="true" />
                  <span>Input Kapal Baru</span>
                </>
              )}
            </button>
          )}
        </div>

        {!manualShipMode && ships.length > 0 ? (
          <div>
            <SelectField
              label="Pilih Kapal Terdaftar (Nama & Registrasi)"
              id="rg-ship-select"
              searchable
              searchPlaceholder="Ketik nama kapal atau nomor registrasi..."
              value={shipReg}
              onChange={(e) => handleSelectShip(e.target.value)}
              placeholder={
                loadingShips
                  ? "Memuat daftar kapal..."
                  : "— Pilih Kapal Terdaftar —"
              }
              options={[
                { value: "", label: "— Pilih Kapal Terdaftar —" },
                ...ships.map((s) => ({
                  value: s.registration_number,
                  label: `${s.name} — ${s.registration_number} (${s.gross_tonnage || 0} GT)`,
                })),
              ]}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="rg-shipname" className={labelCls}>
                Nama Kapal
                <span className="text-soft font-normal text-xs ml-1">
                  (opsional)
                </span>
              </label>
              <div className="relative">
                <Ship
                  size={17}
                  className="text-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="rg-shipname"
                  type="text"
                  value={shipName}
                  onChange={(e) => setShipName(e.target.value)}
                  placeholder="Contoh: KM Bahari Makmur 01"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="rg-shipreg" className={labelCls}>
                Nomor Registrasi / SIPI Kapal
                <span className="text-soft font-normal text-xs ml-1">
                  (opsional)
                </span>
              </label>
              <div className="relative">
                <FileText
                  size={17}
                  className="text-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="rg-shipreg"
                  type="text"
                  value={shipReg}
                  onChange={(e) => setShipReg(e.target.value)}
                  placeholder="Contoh: REG-2026-0412"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
