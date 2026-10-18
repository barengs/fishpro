import { useState } from "react";
import {
  emptyCatchForm,
  type CatchReportFormData,
} from "../../catchReportTypes";
import { catchStep1Schema, catchStep2Schema } from "../../../utils/schemas";

export function useCatchWizard({
  onSubmit,
}: {
  onSubmit: (data: CatchReportFormData) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CatchReportFormData>(emptyCatchForm);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

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

    const fallbackToNetworkGeo = async () => {
      try {
        const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
        if (res.ok) {
          const data = await res.json();
          if (data.latitude && data.longitude) {
            applyPosition(data.latitude, data.longitude);
            return true;
          }
        }
      } catch {
        // network error / offline
      }
      return false;
    };

    if (window.isSecureContext && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyPosition(pos.coords.latitude, pos.coords.longitude);
        },
        async (err) => {
          const ok = await fallbackToNetworkGeo();
          if (!ok) {
            if (err.code === err.PERMISSION_DENIED) {
              setErrorMsg(
                "Izin akses GPS ditolak oleh browser. Harap izinkan akses lokasi di pengaturan browser.",
              );
            } else {
              applyPosition(-8.747, 115.214);
              setErrorMsg(
                "Sensor GPS tidak terjangkau. Koordinat diisi dengan estimasi pelabuhan Benoa.",
              );
            }
            setIsLocating(false);
          }
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 },
      );
    } else {
      fallbackToNetworkGeo().then((ok) => {
        if (!ok) {
          applyPosition(-8.747, 115.214);
          setErrorMsg(
            "Browser HP memblokir GPS di alamat HTTP lokal (wajib HTTPS). Koordinat diisi estimasi pelabuhan.",
          );
          setIsLocating(false);
        }
      });
    }
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
  };
}
