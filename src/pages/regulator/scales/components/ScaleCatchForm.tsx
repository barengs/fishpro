import { CheckCircle2, Link2, Loader2, Sparkles } from "lucide-react";
import {
  SelectField,
  TextField,
  TextareaField,
} from "../../../../components/ui";
import {
  type SaveScaleCatchResponse,
  type ScaleReading,
} from "../../../../services/iot";
import { type Ship as ShipItem } from "../../../../services/ships";
import { type FishSpecies } from "../../../../services/fish";
import { type FishingArea } from "../../../../services/regions";

interface ScaleCatchFormProps {
  latestReading: ScaleReading | null;
  currentWeightNum: string;
  ships: ShipItem[];
  speciesList: FishSpecies[];
  areas: FishingArea[];
  selectedShipReg: string;
  onShipChange: (reg: string) => void;
  selectedSpeciesId: number;
  onSpeciesChange: (id: number) => void;
  selectedWppId?: number;
  onWppChange: (id?: number) => void;
  catchType: "pelagic" | "demersal" | "reef";
  onCatchTypeChange: (type: "pelagic" | "demersal" | "reef") => void;
  catchDate: string;
  onCatchDateChange: (date: string) => void;
  operatorNotes: string;
  onNotesChange: (notes: string) => void;
  saving: boolean;
  saveSuccess: SaveScaleCatchResponse | null;
  onSubmit: (e: React.FormEvent) => void;
}

export function ScaleCatchForm({
  latestReading,
  currentWeightNum,
  ships,
  speciesList,
  areas,
  selectedShipReg,
  onShipChange,
  selectedSpeciesId,
  onSpeciesChange,
  selectedWppId,
  onWppChange,
  catchType,
  onCatchTypeChange,
  catchDate,
  onCatchDateChange,
  operatorNotes,
  onNotesChange,
  saving,
  saveSuccess,
  onSubmit,
}: ScaleCatchFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={onSubmit}
        className="surface-card border border-fco-border-subtle rounded-xs p-6 shadow-2xs flex flex-col gap-4"
      >
        <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-fco-border-subtle">
          <div>
            <h2 className="m-0 text-base font-bold text-strong">
              Simpan Laporan Tangkapan Pelabuhan
            </h2>
            <p className="m-0 text-xs text-soft mt-0.5 leading-relaxed">
              Tautkan bobot timbangan digital ke data kapal dan simpan ke
              blockchain.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-fco-blue px-2.5 py-1 rounded-xs bg-blue-500/10 shrink-0">
            Bobot: {currentWeightNum} kg
          </span>
        </div>

        {/* Kapal Pembongkar */}
        <SelectField
          label="Nomor Registrasi / Kapal Pembongkar"
          id="sc-ship"
          required
          searchable
          searchPlaceholder="Cari nama kapal atau nomor registrasi..."
          value={selectedShipReg}
          onChange={(e) => onShipChange(e.target.value)}
          placeholder="— Pilih Kapal —"
          options={ships.map((s) => ({
            value: s.registration_number,
            label: `${s.name} (${s.registration_number}) · ${s.gross_tonnage || 0} GT`,
          }))}
        />

        {/* Jenis Ikan & WPP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <SelectField
            label="Jenis / Spesies Ikan"
            id="sc-species"
            required
            searchable
            searchPlaceholder="Cari nama ikan..."
            value={selectedSpeciesId}
            onChange={(e) => onSpeciesChange(Number(e.target.value))}
            options={speciesList.map((sp) => ({
              value: sp.id,
              label: `${sp.name} ${sp.scientific_name ? `(${sp.scientific_name})` : ""}`,
            }))}
          />

          <SelectField
            label="Wilayah Penangkapan (WPP)"
            id="sc-wpp"
            searchable
            value={selectedWppId ?? ""}
            onChange={(e) => onWppChange(Number(e.target.value) || undefined)}
            options={areas.map((a) => ({
              value: a.id,
              label: `${a.code} — ${a.nama}`,
            }))}
          />
        </div>

        {/* Tanggal & Jenis Tangkapan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextField
            label="Tanggal Pembongkaran"
            id="sc-date"
            type="date"
            required
            value={catchDate}
            onChange={(e) => onCatchDateChange(e.target.value)}
          />

          <SelectField
            label="Kategori Tangkapan"
            id="sc-type"
            value={catchType}
            onChange={(e) =>
              onCatchTypeChange(
                e.target.value as "pelagic" | "demersal" | "reef",
              )
            }
            options={[
              { value: "pelagic", label: "Ikan Pelagis" },
              { value: "demersal", label: "Ikan Demersal" },
              { value: "reef", label: "Ikan Karang" },
            ]}
          />
        </div>

        {/* Catatan Operator */}
        <TextareaField
          label="Catatan Mutu / Pemeriksaan Petugas (Opsional)"
          id="sc-notes"
          optional
          rows={2}
          value={operatorNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Kondisi ikan segar ber-es, lolos uji mutu organoleptik pelabuhan..."
        />

        {/* Submit Action Button */}
        <div className="pt-2 border-t border-fco-border-subtle flex flex-col gap-2">
          <button
            type="submit"
            disabled={saving || !latestReading}
            className="w-full h-11 rounded-xs border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-bold text-sm cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span>Merekam ke Blockchain & Menyimpan...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
                <span className="hidden sm:inline">
                  Simpan Tangkapan Resmi (Potong Kuota, PNBP, & Blockchain)
                </span>
                <span className="sm:hidden">Simpan Tangkapan Resmi</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-between text-2xs text-soft pt-1">
            <span className="flex items-center gap-1.5">
              <Link2 size={13} className="text-fco-blue" />
              <span>Verifikasi Blockchain SHA-256</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-fco-blue" />
              <span>Kalkulasi PNBP Otomatis</span>
            </span>
          </div>
        </div>
      </form>

      {/* Success Banner Card */}
      {saveSuccess && (
        <div className="surface-card border-2 border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xs p-4 sm:p-5 text-xs text-strong flex flex-col gap-2 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300 text-sm">
            <CheckCircle2 size={18} />
            <span>{saveSuccess.message}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 font-mono">
            <div>
              <span className="text-soft block text-2xs">ID Tangkapan</span>
              <span className="font-bold">#{saveSuccess.catch_id}</span>
            </div>
            <div>
              <span className="text-soft block text-2xs">Berat Resmi</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {saveSuccess.weight} {saveSuccess.unit}
              </span>
            </div>
            <div>
              <span className="text-soft block text-2xs">Tagihan PNBP</span>
              <span className="font-bold text-fco-blue">
                Rp {Number(saveSuccess.pnbp || 0).toLocaleString("id-ID")}
              </span>
            </div>
            <div>
              <span className="text-soft block text-2xs">Status Rantai</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                {saveSuccess.blockchain_status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
