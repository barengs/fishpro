import { AnimatePresence, motion } from "framer-motion";
import { type ShipFormData } from "./shipFormTypes";
import type { Ship } from "../services/ships";
import { useShipWizard } from "./ship-wizard/hooks/useShipWizard";
import { ShipFormStepper } from "./ship-wizard/components/ShipFormStepper";
import { StepShipIdentity } from "./ship-wizard/components/StepShipIdentity";
import { StepShipSpecs } from "./ship-wizard/components/StepShipSpecs";
import { StepShipReview } from "./ship-wizard/components/StepShipReview";

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
          className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20"
        >
          {errorMsg}
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

      <div className="flex gap-2.5 mt-5">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 h-11 rounded-xl text-sm border border-fco-border surface-card text-strong font-semibold cursor-pointer transition-colors"
          >
            Kembali
          </button>
        )}
        {currentStep < 3 ? (
          <motion.button
            type="button"
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors"
          >
            Lanjut
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={handleSubmit}
            whileTap={{ scale: 0.97 }}
            className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors"
          >
            {submitLabel || (initialData ? "Perbarui Kapal" : "Simpan Kapal")}
          </motion.button>
        )}
      </div>
    </div>
  );
}
