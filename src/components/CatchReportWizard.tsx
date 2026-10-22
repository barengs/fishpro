import { AnimatePresence, motion } from "framer-motion";
import { type CatchReportFormData } from "./catchReportTypes";
import { useCatchWizard } from "./catch-wizard/hooks/useCatchWizard";
import { CatchFormStepper } from "./catch-wizard/components/CatchFormStepper";
import { StepCatchLocation } from "./catch-wizard/components/StepCatchLocation";
import { StepCatchDetails } from "./catch-wizard/components/StepCatchDetails";
import { StepCatchSummary } from "./catch-wizard/components/StepCatchSummary";

const steps = [
  { num: 1, title: "Waktu & Lokasi" },
  { num: 2, title: "Hasil" },
  { num: 3, title: "Cek" },
];

export interface CatchReportWizardProps {
  onSubmit: (data: CatchReportFormData) => void;
  onCancel: () => void;
  shipSelector?: React.ReactNode;
}

export function CatchReportWizard({
  onSubmit,
  onCancel,
  shipSelector,
}: CatchReportWizardProps) {
  const {
    currentStep,
    form,
    setForm,
    errorMsg,
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
  } = useCatchWizard({ onSubmit });

  return (
    <div>
      <CatchFormStepper steps={steps} currentStep={currentStep} />

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
            <StepCatchLocation
              form={form}
              setForm={setForm}
              shipSelector={shipSelector}
              isLocating={isLocating}
              onGetLocation={handleGetLocation}
            />
          )}

          {currentStep === 2 && (
            <StepCatchDetails
              form={form}
              setForm={setForm}
              speciesList={speciesList}
              loadingSpecies={loadingSpecies}
              wppList={wppList}
              loadingWpp={loadingWpp}
              pendingReadings={pendingReadings}
              loadingReadings={loadingReadings}
            />
          )}

          {currentStep === 3 && <StepCatchSummary form={form} />}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2.5 mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl text-sm border border-fco-border bg-transparent text-soft hover:text-strong font-semibold cursor-pointer transition-colors"
        >
          Batal
        </button>
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
            Kirim laporan
          </motion.button>
        )}
      </div>
    </div>
  );
}
