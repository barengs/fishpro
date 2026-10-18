import { useEffect, useState } from "react";
import { emptyShipForm, type ShipFormData } from "../../shipFormTypes";
import { ownersService, type Owner } from "../../../services/owners";
import { captainsService, type Captain } from "../../../services/captains";
import { shipFormSchema } from "../../../utils/schemas";
import type { Ship } from "../../../services/ships";

export function useShipWizard({
  onSubmit,
  fixedOwnerId,
  initialData,
}: {
  onSubmit: (data: ShipFormData) => void;
  fixedOwnerId?: number;
  initialData?: Ship | null;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<ShipFormData>(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        registration_number: initialData.registration_number || "",
        owner: initialData.owner
          ? String(initialData.owner)
          : fixedOwnerId
            ? String(fixedOwnerId)
            : "",
        captain: initialData.captain ? String(initialData.captain) : "",
        length:
          initialData.length !== null && initialData.length !== undefined
            ? String(initialData.length)
            : "",
        width:
          initialData.width !== null && initialData.width !== undefined
            ? String(initialData.width)
            : "",
        gross_tonnage:
          initialData.gross_tonnage !== null &&
          initialData.gross_tonnage !== undefined
            ? String(initialData.gross_tonnage)
            : "",
        engine_power: "",
        vessel_type: "purse_seine",
        fuel_type: "diesel",
        year_built:
          initialData.year_built !== null &&
          initialData.year_built !== undefined
            ? String(initialData.year_built)
            : "",
        home_port: initialData.home_port || "",
        active: initialData.active ?? true,
      };
    }
    return {
      ...emptyShipForm,
      owner: fixedOwnerId ? String(fixedOwnerId) : "",
    };
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);

  useEffect(() => {
    Promise.all([
      ownersService.getAll().catch(() => []),
      captainsService.getAll().catch(() => []),
    ]).then(([ownersData, captainsData]) => {
      setOwners(ownersData);
      setCaptains(captainsData);
    });
  }, []);

  const handleNext = () => {
    setErrorMsg(null);
    if (currentStep === 1) {
      const step1Schema = shipFormSchema.pick({
        name: true,
        registration_number: true,
      });
      const parsed = step1Schema.safeParse(form);
      if (!parsed.success) {
        setErrorMsg(
          parsed.error.issues[0]?.message || "Identitas kapal belum valid.",
        );
        return;
      }
    } else if (currentStep === 2) {
      const step2Schema = shipFormSchema.pick({
        gross_tonnage: true,
      });
      const parsed = step2Schema.safeParse(form);
      if (!parsed.success) {
        setErrorMsg(
          parsed.error.issues[0]?.message || "Spesifikasi kapal belum valid.",
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
    setForm(emptyShipForm);
    setCurrentStep(1);
    setErrorMsg(null);
  };

  const selectedOwnerName =
    owners.find((o) => String(o.id) === String(form.owner))?.full_name ||
    form.owner ||
    "—";

  const selectedCaptainName =
    captains.find((c) => String(c.id) === String(form.captain))?.full_name ||
    form.captain ||
    "—";

  return {
    currentStep,
    setCurrentStep,
    form,
    setForm,
    errorMsg,
    setErrorMsg,
    owners,
    captains,
    handleNext,
    handlePrev,
    handleSubmit,
    selectedOwnerName,
    selectedCaptainName,
  };
}
