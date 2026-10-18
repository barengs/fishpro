import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../../components/toast";
import {
  iotService,
  type SaveScaleCatchResponse,
  type ScaleReading,
  type SmartScale,
} from "../../../../services/iot";
import {
  shipsService,
  type Ship as ShipItem,
} from "../../../../services/ships";
import {
  fishSpeciesService,
  type FishSpecies,
} from "../../../../services/fish";
import { regionsService, type FishingArea } from "../../../../services/regions";

export function useIotScales() {
  const [devices, setDevices] = useState<SmartScale[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [latestReading, setLatestReading] = useState<ScaleReading | null>(null);
  const [readings, setReadings] = useState<ScaleReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);

  // Form states for saving catch
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

  // Load initial master data
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
          const safeDevs = Array.isArray(devData) ? devData : [];
          setDevices(safeDevs);
          setShips(Array.isArray(shipData) ? shipData : []);
          setSpeciesList(Array.isArray(spData) ? spData : []);
          setAreas(Array.isArray(areaData) ? areaData : []);

          if (safeDevs.length > 0) {
            setSelectedDeviceId(safeDevs[0].device_id);
          }
          if (Array.isArray(shipData) && shipData.length > 0) {
            setSelectedShipReg(shipData[0].registration_number);
          }
          if (Array.isArray(spData) && spData.length > 0) {
            setSelectedSpeciesId(spData[0].id);
          }
          if (Array.isArray(areaData) && areaData.length > 0) {
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

  // Fetch readings helper
  const fetchReadings = useCallback(async (devId?: string) => {
    try {
      const [latest, list] = await Promise.all([
        iotService.getLatestReading(devId, "pending"),
        iotService.getReadings(devId),
      ]);
      setLatestReading(latest);
      setReadings(list);
    } catch {
      // Ignored
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
        // Ignored
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
        // Ignored
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

  // Handle Save Catch
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

  // Handle Testing Simulator
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

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    latestReading,
    readings,
    loading,
    sseConnected,
    fetchReadings,

    // Form fields
    ships,
    speciesList,
    areas,
    selectedShipReg,
    setSelectedShipReg,
    selectedSpeciesId,
    setSelectedSpeciesId,
    selectedWppId,
    setSelectedWppId,
    catchType,
    setCatchType,
    catchDate,
    setCatchDate,
    operatorNotes,
    setOperatorNotes,

    saving,
    saveSuccess,
    errorMsg,
    setErrorMsg,
    handleSaveCatch,

    // Simulator
    simWeight,
    setSimWeight,
    simulating,
    showSimulator,
    setShowSimulator,
    handleSimulateWeight,
  };
}
