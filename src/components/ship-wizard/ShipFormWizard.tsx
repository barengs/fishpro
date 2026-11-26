import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { type ShipFormData } from "./shipFormTypes";
import type { Ship } from "../../services/ships";
import { useShipWizard } from "./hooks/useShipWizard";
import { ShipFormStepper } from "./components/ShipFormStepper";
import { StepShipIdentity } from "./components/StepShipIdentity";
import { StepShipSpecs } from "./components/StepShipSpecs";
import { StepShipReview } from "./components/StepShipReview";

const steps = [
  { num: 1, title: "Identitas" },
  { num: 2, title: "Spesifikasi" },
  { num: 3, title: "Cek" },
];

export interface ShipFormWizardProps {
  onSubmit: (data: ShipFormData) => void;
  fixedOwnerId?: number;
  initialData?: Ship | null;
  submitLabel?: string;
}

export function ShipFormWizard({
  onSubmit,
  fixedOwnerId,
  initialData,
  submitLabel,
}: ShipFormWizardProps) {
  const {
    currentStep,
    form,
    setForm,
    errorMsg,
    owners,
    captains,
    handleNext,
    handlePrev,
    handleSubmit,
    selectedOwnerName,
    selectedCaptainName,
  } = useShipWizard({
    onSubmit,
    fixedOwnerId,
    initialData,
  });

  return (
    <div>
      <ShipFormStepper steps={steps} currentStep={currentStep} />

      {errorMsg && (
        <div
          role="alert"
          className="p-3 px-4 rounded-[10px] bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20 flex items-center gap-2.5"
        >
          <AlertCircle
            size={16}
            className="shrink-0 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <span>{errorMsg}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {currentStep === 1 && (
            <StepShipIdentity
              form={form}
              setForm={setForm}
              owners={owners}
              captains={captains}
              fixedOwnerId={fixedOwnerId}
            />
          )}

          {currentStep === 2 && <StepShipSpecs form={form} setForm={setForm} />}

          {currentStep === 3 && (
            <StepShipReview
              form={form}
              selectedOwnerName={selectedOwnerName}
              selectedCaptainName={selectedCaptainName}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 mt-5 pt-4 border-t border-[#e8ebf0] dark:border-[#1f2a42]">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 h-[44px] rounded-[10px] text-sm border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] font-semibold cursor-pointer transition-colors"
          >
            Kembali
          </button>
        )}
        {currentStep < 3 ? (
          <motion.button
            type="button"
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-[44px] rounded-[10px] text-sm border-0 bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#5b94ff] dark:hover:bg-[#78a7ff] text-white font-semibold cursor-pointer transition-colors"
          >
            Lanjut
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={handleSubmit}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-[44px] rounded-[10px] text-sm border-0 bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#5b94ff] dark:hover:bg-[#78a7ff] text-white font-semibold cursor-pointer transition-colors"
          >
            {submitLabel || (initialData ? "Perbarui Kapal" : "Simpan Kapal")}
          </motion.button>
        )}
      </div>
    </div>
  );
}
