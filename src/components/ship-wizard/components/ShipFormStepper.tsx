export interface WizardStepItem {
  num: number;
  title: string;
}

interface ShipFormStepperProps {
  steps: WizardStepItem[];
  currentStep: number;
}

export function ShipFormStepper({ steps, currentStep }: ShipFormStepperProps) {
  return (
    <div className="relative mb-6 pt-1">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const isPassed = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          const isLast = idx === steps.length - 1;

          return (
            <div
              key={s.num}
              className="flex-1 relative flex flex-col items-center"
            >
              {/* Connecting track between steps */}
              {!isLast && (
                <div className="absolute top-4 -translate-y-1/2 left-1/2 w-full h-0.5 bg-fco-border dark:bg-fco-border-dark z-0">
                  <div
                    className="h-full bg-fco-blue transition-all duration-300"
                    style={{ width: currentStep > s.num ? "100%" : "0%" }}
                  />
                </div>
              )}

              {/* Step Circle */}
              <div
                className={`relative z-1 w-8 h-8 rounded-full grid place-items-center font-bold text-xs sm:text-sm transition-all ${
                  isCurrent
                    ? "border-2 border-fco-blue bg-fco-blue text-white ring-4 ring-fco-blue/15"
                    : isPassed
                      ? "border-2 border-fco-blue bg-fco-blue text-white"
                      : "border-2 border-fco-border dark:border-fco-border-dark surface-card text-soft"
                }`}
              >
                <span className="leading-none tabular-nums select-none flex items-center justify-center text-center">
                  {isPassed ? "✓" : s.num}
                </span>
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 text-xs font-semibold tracking-tight text-center ${
                  isCurrent
                    ? "text-fco-blue font-bold"
                    : isPassed
                      ? "text-strong"
                      : "text-soft"
                }`}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
