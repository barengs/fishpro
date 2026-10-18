import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Cpu,
  Link2,
  Loader2,
  Radio,
  RefreshCw,
  Scale,
  Send,
  Sparkles,
} from "lucide-react";
import { DataTable, type Column } from "../../components/DataTable";
import { StatusChip } from "../../components/StatusChip";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import {
  AlertBanner,
  SelectField,
  TextField,
  TextareaField,
} from "../../components/ui";
import { useToast } from "../../components/toast";
import {
  iotService,
  type SaveScaleCatchResponse,
  type ScaleReading,
  type SmartScale,
} from "../../services/iot";
import { shipsService, type Ship as ShipItem } from "../../services/ships";
import { fishSpeciesService, type FishSpecies } from "../../services/fish";
import { regionsService, type FishingArea } from "../../services/regions";

export function IotScalesPage() {
  const [devices, setDevices] = useState<SmartScale[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [latestReading, setLatestReading] = useState<ScaleReading | null>(null);
  const [readings, setReadings] = useState<ScaleReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);

  // Catch saving form state
  const [ships, setShips] = useState<ShipItem[]>([]);
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
  const [areas, setAreas] = useState<FishingArea[]>([]);
  const [selectedShipReg, setSelectedShipReg] = useState("");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number>(0);
  const [selectedWppId, setSelectedWppId] = useState<number | undefined>(
    undefined,
  );
  const [catchType, setCatchType] = useState<"pelagic" | "demersal" | "reef">(
    "pelagic",
  );
  const [catchDate, setCatchDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [operatorNotes, setOperatorNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<SaveScaleCatchResponse | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Simulator state
  const [simWeight, setSimWeight] = useState("35.50");
  const [simulating, setSimulating] = useState(false);
  const [showSimulator, setShowSimulator] = useState(true);

  const eventSourceRef = useRef<EventSource | null>(null);
  const toast = useToast();

  const {
    selected: selectedDetailReading,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<ScaleReading>();

  // Fetch initial master data
  useEffect(() => {
    let ignore = false;
    async function loadInitialData() {
      setLoading(true);
      try {
        const [devData, shipData, spData, areaData] = await Promise.all([
          iotService.getDevices(),
          shipsService.getAll(),
          fishSpeciesService.getAll(),
          regionsService.getAll(),
        ]);
        if (!ignore) {
          setDevices(devData);
          setShips(shipData);
          setSpeciesList(spData);
          setAreas(areaData);

          if (devData.length > 0) {
            setSelectedDeviceId(devData[0].device_id);
          }
          if (shipData.length > 0) {
            setSelectedShipReg(shipData[0].registration_number);
          }
          if (spData.length > 0) {
            setSelectedSpeciesId(spData[0].id);
          }
          if (areaData.length > 0) {
            setSelectedWppId(areaData[0].id);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMsg(
            err instanceof Error ? err.message : "Gagal memuat data awal",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadInitialData();
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch latest reading & history log
  const fetchReadings = useCallback(async (devId?: string) => {
    try {
      const [latest, list] = await Promise.all([
        iotService.getLatestReading(devId, "pending"),
        iotService.getReadings(devId),
      ]);
      setLatestReading(latest);
      setReadings(list);
    } catch {
      // Ignore
    }
  }, []);

  // Setup Server-Sent Events (SSE) stream & initial load
  useEffect(() => {
    if (!selectedDeviceId) return;
    let ignore = false;

    async function loadReadings() {
      try {
        const [latest, list] = await Promise.all([
          iotService.getLatestReading(selectedDeviceId, "pending"),
          iotService.getReadings(selectedDeviceId),
        ]);
        if (!ignore) {
          setLatestReading(latest);
          setReadings(list);
        }
      } catch {
        // Ignore
      }
    }
    loadReadings();

    const streamUrl = iotService.getStreamUrl(selectedDeviceId);
    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.onopen = () => {
      if (!ignore) setSseConnected(true);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "weight_update" || data.event === "initial_state") {
          if (!ignore) {
            setLatestReading({
              id: data.reading_id,
              device_id: data.device_id,
              scale_name: data.scale_name,
              port_name: data.port_name,
              weight: data.weight,
              unit: data.unit || "kg",
              tare: data.tare || 0,
              is_stable: data.is_stable ?? true,
              status: data.status || "pending",
              created_at: data.created_at || new Date().toISOString(),
            });
          }
          fetchReadings(selectedDeviceId);
        } else if (data.event === "weight_saved") {
          fetchReadings(selectedDeviceId);
        }
      } catch {
        // Ignore json parse error
      }
    };

    es.onerror = () => {
      if (!ignore) setSseConnected(false);
    };

    return () => {
      ignore = true;
      es.close();
      setSseConnected(false);
    };
  }, [selectedDeviceId, fetchReadings]);

  // Handle Save Catch directly from Scale Reading
  const handleSaveCatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latestReading) {
      setErrorMsg("Belum ada data timbangan yang aktif untuk disimpan.");
      return;
    }
    if (!selectedShipReg) {
      setErrorMsg("Pilih kapal yang membongkar muatan tangkapan.");
      return;
    }
    if (!selectedSpeciesId) {
      setErrorMsg("Pilih jenis ikan yang sedang ditimbang.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(null);

    try {
      const res = await iotService.saveCatch({
        reading_id: latestReading.id,
        ship_registration_number: selectedShipReg,
        fish_species_id: selectedSpeciesId,
        wpp_id: selectedWppId,
        catch_type: catchType,
        catch_date: catchDate,
        operator_notes: operatorNotes.trim() || undefined,
      });

      setSaveSuccess(res);
      toast.success(
        `Tangkapan ${res.weight} kg untuk kapal ${res.ship_name} berhasil disimpan dan tersegel di blockchain!`,
      );
      setLatestReading(null);
      fetchReadings(selectedDeviceId);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menyimpan laporan tangkapan.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Handle Testing Simulator (Send simulated weight)
  const handleSimulateWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(simWeight);
    if (isNaN(w) || w <= 0) {
      setErrorMsg("Masukkan nilai berat simulasi yang valid (> 0 kg).");
      return;
    }

    const devId =
      selectedDeviceId || (devices[0]?.device_id ?? "SCALE-BENOAS-01");
    setSimulating(true);
    setErrorMsg(null);

    try {
      await iotService.sendWeight({
        device_id: devId,
        weight: w,
        unit: "kg",
      });
      toast.success(
        `Sinyal sensor timbangan (${w} kg) berhasil dikirim ke server.`,
      );
      fetchReadings(devId);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim data sensor IoT.";
      setErrorMsg(msg);
    } finally {
      setSimulating(false);
    }
  };

  const currentWeightNum = latestReading
    ? Number(latestReading.weight).toFixed(2)
    : "0.00";

  const historyCols: Column<ScaleReading>[] = [
    {
      key: "time",
      header: "Waktu Timbang",
      flex: 2,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold tabular-nums">
            {new Date(r.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="text-2xs text-soft">
            {new Date(r.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      ),
    },
    {
      key: "device",
      header: "Timbangan / Pelabuhan",
      flex: 2,
      render: (r) => (
        <div>
          <span className="text-sm font-bold text-strong">{r.device_id}</span>
          <div className="text-2xs text-soft">{r.port_name || "Pelabuhan"}</div>
        </div>
      ),
    },
    {
      key: "weight",
      header: "Berat Terbaca",
      flex: 2,
      align: "right",
      render: (r) => (
        <span className="text-base font-extrabold text-strong font-mono tabular-nums">
          {Number(r.weight).toLocaleString("id-ID", {
            minimumFractionDigits: 2,
          })}{" "}
          <span className="text-xs text-soft font-normal">{r.unit}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      flex: 2,
      align: "center",
      render: (r) =>
        r.status === "saved" ? (
          <StatusChip label="Tersimpan Resmi" />
        ) : r.status === "discarded" ? (
          <StatusChip label="Dilewati" bg="#EEF1F6" color="#4A5872" />
        ) : (
          <StatusChip label="Menunggu Input" bg="#FFF1E0" color="#B54708" />
        ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <button
          type="button"
          onClick={() => openDetail(r)}
          className="h-8 px-3 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors"
        >
          Detail
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Toolbar & Device Selector Bar */}
      <div className="surface-card border rounded-xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale size={20} className="text-fco-blue" aria-hidden="true" />
            <h1 className="m-0 text-xl sm:text-2xl font-extrabold tracking-tight text-strong">
              Terminal Timbangan Pintar IoT
            </h1>
          </div>
          <p className="m-0 text-xs sm:text-sm text-soft">
            Penerimaan berat tangkapan otomatis dari timbangan dermaga
            pelabuhan, kalkulasi PNBP instan, dan segel blockchain.
          </p>
        </div>

        {/* Device Picker & Live Indicator */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-56 sm:w-64">
            <SelectField
              label="Pilih Timbangan Dermaga"
              id="scale-device-select"
              searchable
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              placeholder="— Pilih Timbangan —"
              options={devices.map((d) => ({
                value: d.device_id,
                label: `${d.name} (${d.device_id})`,
              }))}
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                sseConnected
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  sseConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{sseConnected ? "SSE Live" : "Menghubungkan"}</span>
            </span>

            <button
              type="button"
              onClick={() => fetchReadings(selectedDeviceId)}
              title="Refresh Pembacaan"
              className="w-9 h-9 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-soft hover:text-strong flex items-center justify-center cursor-pointer transition-colors"
            >
              <RefreshCw size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <AlertBanner
          variant="error"
          message={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
      )}

      {/* 2. Main Live Scale Terminal + Catch Linking Form (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col (5 cols): Large Digital Scale Weight Display */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="surface-card border rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden bg-linear-to-b from-slate-900 to-[#0e2756] text-white">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sensor Timbangan Digital
                </span>
              </div>
              <span className="text-2xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {selectedDeviceId || "SEMUA TIMBANGAN"}
              </span>
            </div>

            {/* Giant Digital Number */}
            <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-mono font-black tracking-tight tabular-nums text-white drop-shadow-md">
                {currentWeightNum}
              </div>
              <div className="text-sm sm:text-base font-bold uppercase tracking-widest text-emerald-400 mt-2">
                KILOGRAM (KG)
              </div>
            </div>

            {/* Scale Status Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold">
                  {latestReading
                    ? "Beban Terdeteksi (Pending)"
                    : "Siap Menimbang"}
                </span>
              </span>
              <span className="font-mono text-2xs opacity-75">
                {latestReading
                  ? `ID: ${latestReading.id.slice(0, 8)}...`
                  : "Menunggu keranjang ikan..."}
              </span>
            </div>
          </div>

          {/* Interactive Hardware Simulator (For testing without physical IoT) */}
          <div className="surface-card border rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu
                  size={16}
                  className="text-purple-600 dark:text-purple-400"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-strong">
                  Simulator Hardware IoT
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSimulator(!showSimulator)}
                className="text-2xs text-fco-blue hover:underline bg-transparent border-none cursor-pointer p-0 font-semibold"
              >
                {showSimulator ? "Sembunyikan" : "Buka Tester"}
              </button>
            </div>

            {showSimulator && (
              <form
                onSubmit={handleSimulateWeight}
                className="flex flex-col gap-3"
              >
                <p className="m-0 text-xs text-soft leading-relaxed">
                  Uji alur penimbangan secara instan tanpa perangkat fisik.
                  Masukkan angka berat untuk memicu endpoint{" "}
                  <code>POST /api/iot/receive-weight/</code>.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={simWeight}
                      onChange={(e) => setSimWeight(e.target.value)}
                      placeholder="Contoh: 45.50"
                      className="w-full h-10 border-2 border-fco-border dark:border-fco-border-dark rounded-lg px-3 text-sm font-mono field-input focus:outline-hidden focus:border-fco-blue"
                    />
                    <span className="text-xs text-soft font-semibold absolute right-3 top-2.5">
                      kg
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={simulating}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border-none bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-60 shrink-0"
                  >
                    {simulating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    <span>Kirim Berat</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Col (7 cols): Link Catch Form & Blockchain Lock */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <form
            onSubmit={handleSaveCatch}
            className="surface-card border rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col gap-4.5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-fco-border-subtle">
              <div>
                <h2 className="m-0 text-base font-bold text-strong">
                  Simpan Laporan Tangkapan Pelabuhan
                </h2>
                <p className="m-0 text-xs text-soft mt-0.5">
                  POST /api/iot/save-catch/ — Tautkan bobot timbangan ke kapal
                  dan segel ke blockchain.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-fco-blue px-2.5 py-1 rounded-md bg-blue-500/10">
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
              onChange={(e) => setSelectedShipReg(e.target.value)}
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
                onChange={(e) => setSelectedSpeciesId(Number(e.target.value))}
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
                onChange={(e) =>
                  setSelectedWppId(Number(e.target.value) || undefined)
                }
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
                onChange={(e) => setCatchDate(e.target.value)}
              />

              <SelectField
                label="Kategori Tangkapan"
                id="sc-type"
                value={catchType}
                onChange={(e) =>
                  setCatchType(
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
              onChange={(e) => setOperatorNotes(e.target.value)}
              placeholder="Kondisi ikan segar ber-es, lolos uji mutu organoleptik pelabuhan..."
            />

            {/* Submit Action Button */}
            <div className="pt-3 border-t border-fco-border-subtle flex flex-col gap-2">
              <button
                type="submit"
                disabled={saving || !latestReading}
                className="w-full h-12 rounded-xl border-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <CheckCircle2
                      size={18}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <span>
                      Simpan Tangkapan Resmi (Otomatis Potong Kuota, PNBP, &
                      Blockchain)
                    </span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-4 text-2xs text-soft pt-1">
                <span className="flex items-center gap-1">
                  <Link2 size={13} className="text-fco-blue" />
                  <span>Segel Imutabilitas Blockchain SHA-256</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Sparkles size={13} className="text-purple-600" />
                  <span>Kalkulasi Otomatis PNBP KKP</span>
                </span>
              </div>
            </div>
          </form>

          {/* Success Banner Card */}
          {saveSuccess && (
            <div className="surface-card border-2 border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl p-4 sm:p-5 text-xs text-strong flex flex-col gap-2 shadow-xs animate-in fade-in duration-200">
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
                  <span className="text-soft block text-2xs">
                    Status Rantai
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    {saveSuccess.blockchain_status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Scale Readings Log Table */}
      <section className="surface-card border rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="m-0 text-base font-bold text-strong">
              Riwayat Pembacaan Sensor Timbangan ({readings.length})
            </h3>
            <p className="m-0 text-xs text-soft mt-0.5">
              GET /api/iot/readings/ — Log audit seluruh sesi penimbangan ikan
              di pelabuhan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchReadings(selectedDeviceId)}
            className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-strong cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Muat Ulang</span>
          </button>
        </div>

        <DataTable
          columns={historyCols}
          rows={readings}
          rowKey={(r) => r.id}
          loading={loading}
          emptyText="Belum ada riwayat pembacaan sensor timbangan IoT."
          onRowClick={openDetail}
        />
      </section>

      {/* Detail Modal */}
      <DetailModal
        open={isDetailOpen}
        title={
          selectedDetailReading
            ? `Pembacaan: ${selectedDetailReading.weight} ${selectedDetailReading.unit}`
            : "Detail Pembacaan Timbangan"
        }
        subtitle="Data log mentah yang dikirim oleh sensor timbangan IoT dermaga."
        badge={
          selectedDetailReading ? (
            <StatusChip
              label={
                selectedDetailReading.status === "saved"
                  ? "Tersimpan"
                  : selectedDetailReading.status === "discarded"
                    ? "Dilewati"
                    : "Pending"
              }
              bg={
                selectedDetailReading.status === "saved" ? undefined : "#FFF1E0"
              }
              color={
                selectedDetailReading.status === "saved" ? undefined : "#B54708"
              }
            />
          ) : undefined
        }
        onClose={closeDetail}
        fields={[
          {
            label: "ID Pembacaan (UUID)",
            value: (
              <span className="font-mono text-xs font-bold text-fco-blue break-all">
                {selectedDetailReading?.id}
              </span>
            ),
            fullWidth: true,
          },
          {
            label: "ID Perangkat Timbangan",
            value: selectedDetailReading?.device_id,
          },
          {
            label: "Lokasi Pelabuhan",
            value: selectedDetailReading?.port_name || "Pelabuhan Utama",
          },
          {
            label: "Berat Terbaca",
            value: (
              <span className="font-mono font-extrabold text-strong">
                {selectedDetailReading?.weight} {selectedDetailReading?.unit}
              </span>
            ),
          },
          {
            label: "Stabilitas Sensor",
            value: selectedDetailReading?.is_stable ? "Stabil" : "Fluktuatif",
          },
          {
            label: "Waktu Penerimaan",
            value: selectedDetailReading?.created_at
              ? new Date(selectedDetailReading.created_at).toLocaleString(
                  "id-ID",
                )
              : "—",
          },
          {
            label: "Status Integrasi",
            value:
              selectedDetailReading?.status === "saved"
                ? `Tersimpan ke Tangkapan #${selectedDetailReading.fish_catch || "—"}`
                : "Belum disimpan ke laporan tangkapan",
            fullWidth: true,
          },
        ]}
      />
    </div>
  );
}
