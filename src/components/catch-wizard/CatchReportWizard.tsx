import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { type CatchReportFormData } from "./catchReportTypes";
import { useCatchWizard } from "./hooks/useCatchWizard";
import { CatchFormStepper } from "./components/CatchFormStepper";
import { StepCatchLocation } from "./components/StepCatchLocation";
import { StepCatchDetails } from "./components/StepCatchDetails";
import { StepCatchSummary } from "./components/StepCatchSummary";

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

      <div className="flex gap-3 mt-5 pt-4 border-t border-[#e8ebf0] dark:border-[#1f2a42]">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-[44px] rounded-[10px] text-sm border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] font-semibold cursor-pointer transition-colors"
        >
          Batal
        </button>
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
            Kirim laporan
          </motion.button>
        )}
      </div>
    </div>
  );
}
