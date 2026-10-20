import { useEffect, useState } from "react";
import { useToast } from "../../../components/toast";
import {
  shipsService,
  type PredictShipQuotaResponse,
  type Ship,
} from "../../../services/ships";

export function usePredictQuotaTab(
  initialShipReg = "",
  onQuotaApplied?: () => void,
) {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loadingShips, setLoadingShips] = useState(false);
  const [selectedReg, setSelectedReg] = useState(initialShipReg);
  const [months, setMonths] = useState(12);
  const [epochLevel, setEpochLevel] = useState(5);

  const [predicting, setPredicting] = useState(false);
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<PredictShipQuotaResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toast = useToast();

  useEffect(() => {
    let ignore = false;
    async function loadShips() {
      setLoadingShips(true);
      try {
        const data = await shipsService.getAll();
        if (!ignore) {
          setShips(data);
          if (!selectedReg && data.length > 0) {
            setSelectedReg(data[0].registration_number);
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (!ignore) setLoadingShips(false);
      }
    }
    loadShips();
    return () => {
      ignore = true;
    };
  }, [selectedReg]);

  const handleRunPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReg) {
      setErrorMsg("Pilih kapal terlebih dahulu.");
      return;
    }

    setPredicting(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await shipsService.predictQuota({
        ship_registration_number: selectedReg,
        prediction_months: months,
        epoch_level: epochLevel,
      });
      setResult(res);
      toast.success(`Prediksi AI untuk kapal ${selectedReg} selesai dihitung.`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menjalankan prediksi AI untuk kapal ini.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setPredicting(false);
    }
  };

  const recommendedVal =
    result?.recommended_quota ??
    result?.nsga_optimized_quota ??
    result?.predicted_quota ??
    result?.optimal_quota;

  const handleApplyToShip = async () => {
    if (!result || !recommendedVal) return;
    setApplying(true);
    try {
      await shipsService.regulatorManualQuota({
        ship_registration_number: result.ship_registration_number,
        year: 2026,
        quota_amount: Number(recommendedVal),
      });
      toast.success(
        `Kuota resmi kapal ${result.ship_registration_number} berhasil diperbarui menjadi ${Number(recommendedVal).toLocaleString("id-ID")} kg.`,
      );
      onQuotaApplied?.();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menerapkan rekomendasi kuota ke server.";
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  return {
    ships,
    loadingShips,
    selectedReg,
    setSelectedReg,
    months,
    setMonths,
    epochLevel,
    setEpochLevel,
    predicting,
    applying,
    result,
    errorMsg,
    setErrorMsg,
    recommendedVal,
    handleRunPrediction,
    handleApplyToShip,
  };
}
