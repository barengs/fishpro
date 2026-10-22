import { useEffect, useState } from "react";
import {
  emptyCatchForm,
  type CatchReportFormData,
} from "../../catchReportTypes";
import { catchStep1Schema, catchStep2Schema } from "../../../utils/schemas";
import { fishSpeciesService, type FishSpecies } from "../../../services/fish";
import { regionsService, type FishingArea } from "../../../services/regions";
import { iotService, type ScaleReading } from "../../../services/iot";

export function useCatchWizard({
  onSubmit,
}: {
  onSubmit: (data: CatchReportFormData) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CatchReportFormData>(emptyCatchForm);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [wppList, setWppList] = useState<FishingArea[]>([]);
  const [loadingWpp, setLoadingWpp] = useState(false);
  const [pendingReadings, setPendingReadings] = useState<ScaleReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchOptions() {
      setLoadingSpecies(true);
      setLoadingWpp(true);
      setLoadingReadings(true);
      try {
        const [spData, areaData, readingsData] = await Promise.all([
          fishSpeciesService.getAll().catch(() => []),
          regionsService.getAll().catch(() => []),
          iotService.getReadings(undefined, "pending").catch(() => []),
        ]);
        if (!ignore) {
          setSpeciesList(Array.isArray(spData) ? spData : []);
          setWppList(Array.isArray(areaData) ? areaData : []);
          setPendingReadings(Array.isArray(readingsData) ? readingsData : []);
        }
      } finally {
        if (!ignore) {
          setLoadingSpecies(false);
          setLoadingWpp(false);
          setLoadingReadings(false);
        }
      }
    }
    fetchOptions();
    return () => {
      ignore = true;
    };
  }, []);

  const handleGetLocation = () => {
    setErrorMsg(null);
    setIsLocating(true);

    const applyPosition = (lat: number | string, lng: number | string) => {
      const numLat = typeof lat === "number" ? lat : parseFloat(String(lat));
      const numLng = typeof lng === "number" ? lng : parseFloat(String(lng));
      setForm((prev: CatchReportFormData) => ({
        ...prev,
        location_latitude: isNaN(numLat) ? String(lat) : numLat.toFixed(6),
        location_longitude: isNaN(numLng) ? String(lng) : numLng.toFixed(6),
      }));
      setIsLocating(false);
    };

    if (!navigator.geolocation) {
      setErrorMsg("Perangkat ini tidak mendukung fitur sensor GPS.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyPosition(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg(
            "Izin akses GPS ditolak. Harap izinkan akses lokasi di pengaturan browser perangkat.",
          );
        } else if (err.code === err.TIMEOUT) {
          setErrorMsg(
            "Waktu pembacaan GPS habis. Pastikan GPS aktif atau masukkan angka koordinat secara manual.",
          );
        } else {
          setErrorMsg(
            "Sensor GPS tidak terjangkau. Masukkan koordinat lokasi secara manual.",
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (currentStep === 1) {
      const parsed = catchStep1Schema.safeParse(form);
      if (!parsed.success) {
        setErrorMsg(
          parsed.error.issues[0]?.message || "Data langkah 1 belum valid.",
        );
        return;
      }
    } else if (currentStep === 2) {
      const parsed = catchStep2Schema.safeParse(form);
      if (!parsed.success) {
        setErrorMsg(
          parsed.error.issues[0]?.message || "Data langkah 2 belum valid.",
        );
        return;
      }
    }
    setCurrentStep((p) => Math.min(3, p + 1));
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep((p) => Math.max(1, p - 1));
  };

  const handleSubmit = () => {
    onSubmit({ ...form });
    setForm(emptyCatchForm);
    setCurrentStep(1);
    setErrorMsg(null);
  };

  return {
    currentStep,
    setCurrentStep,
    form,
    setForm,
    errorMsg,
    setErrorMsg,
    isLocating,
    handleGetLocation,
    handleNext,
    handlePrev,
    handleSubmit,
    speciesList,
    loadingSpecies,
    wppList,
    loadingWpp,
    pendingReadings,
    loadingReadings,
  };
}
