import { useCallback, useEffect, useState } from "react";
import { useDetailModal } from "../../../components/useDetailModal";
import {
  shipsService,
  type Ship,
  type PredictShipQuotaResponse,
} from "../../../services/ships";

export function useQuotaAudit() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Detail Modal
  const {
    selected: selectedAuditShip,
    open: isAuditDetailOpen,
    openDetail: openAuditDetail,
    closeDetail: closeAuditDetail,
  } = useDetailModal<Ship>();

  // Manual Quota Override Modal
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [selectedShipForOverride, setSelectedShipForOverride] =
    useState<Ship | null>(null);

  // AI Prediction Modal
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedShipForAi, setSelectedShipForAi] = useState<Ship | null>(null);
  const [aiPredicting, setAiPredicting] = useState(false);
  const [aiResult, setAiResult] = useState<PredictShipQuotaResponse | null>(
    null,
  );
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchShips = useCallback(async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await shipsService.getAll(query);
      setShips(data);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat data kapal",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShips(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchShips]);

  const handleOpenOverride = (ship?: Ship) => {
    setSelectedShipForOverride(ship || null);
    setIsOverrideOpen(true);
  };

  const handleCloseOverride = () => {
    setIsOverrideOpen(false);
  };

  const handleOverrideSave = async (data: {
    shipReg: string;
    year: number;
    newQuota: number;
    reason: string;
  }) => {
    try {
      const res = await shipsService.regulatorManualQuota({
        ship_registration_number: data.shipReg.trim(),
        year: Number(data.year) || 2026,
        quota_amount: data.newQuota,
      });

      setToast(
        res.message ||
          `Kuota ${data.shipReg} tahun ${data.year} berhasil disesuaikan menjadi ${Number(data.newQuota).toLocaleString("id-ID")} kg.`,
      );
      setTimeout(() => setToast(null), 4000);
      setIsOverrideOpen(false);
      fetchShips(search);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan kuota manual regulator.",
      );
    }
  };

  const handleOpenAiPrediction = async (ship: Ship) => {
    setSelectedShipForAi(ship);
    setAiResult(null);
    setAiError(null);
    setIsAiOpen(true);
    setAiPredicting(true);

    try {
      const res = await shipsService.predictQuota({
        ship_registration_number: ship.registration_number,
        prediction_months: 12,
        epoch_level: 5,
      });
      setAiResult(res);
    } catch (err: unknown) {
      setAiError(
        err instanceof Error
          ? err.message
          : "Gagal menjalankan prediksi AI untuk kapal ini.",
      );
    } finally {
      setAiPredicting(false);
    }
  };

  const handleCloseAi = () => {
    setIsAiOpen(false);
  };

  const handleApplyRecommendationFromAiModal = async (quotaVal: number) => {
    if (!selectedShipForAi) return;
    try {
      await shipsService.regulatorManualQuota({
        ship_registration_number: selectedShipForAi.registration_number,
        year: 2026,
        quota_amount: quotaVal,
      });
      setIsAiOpen(false);
      setToast(
        `Rekomendasi AI ${Number(quotaVal).toLocaleString("id-ID")} kg berhasil diterapkan ke kuota resmi kapal ${selectedShipForAi.registration_number}.`,
      );
      setTimeout(() => setToast(null), 4000);
      fetchShips(search);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menerapkan rekomendasi AI ke kuota resmi.",
      );
    }
  };

  return {
    ships,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    toast,
    setToast,

    // Detail Modal
    selectedAuditShip,
    isAuditDetailOpen,
    openAuditDetail,
    closeAuditDetail,

    // Override Modal
    isOverrideOpen,
    selectedShipForOverride,
    handleOpenOverride,
    handleCloseOverride,
    handleOverrideSave,

    // AI Prediction Modal
    isAiOpen,
    selectedShipForAi,
    aiPredicting,
    aiResult,
    aiError,
    handleOpenAiPrediction,
    handleCloseAi,
    handleApplyRecommendationFromAiModal,
  };
}
