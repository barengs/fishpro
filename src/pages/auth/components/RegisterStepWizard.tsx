import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { authService, type RegisterPayload } from "../../../services/auth";
import { useToast } from "../../../components/toast";
import { type Role } from "./register/types";
import { StepIdentity } from "./register/StepIdentity";
import { StepAccount } from "./register/StepAccount";
import { StepOperational } from "./register/StepOperational";
import { StepReview } from "./register/StepReview";
import {
  registerStep1Schema,
  registerStep2Schema,
} from "../../../utils/schemas";

const steps = [
  { num: 1, title: "Identitas" },
  { num: 2, title: "Akun" },
  { num: 3, title: "Operasional" },
  { num: 4, title: "Konfirmasi" },
];

export function RegisterStepWizard() {
  const navigate = useNavigate();
  const toast = useToast();

  // Role and Step state
  const [role, setRole] = useState<Role>("owner");
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Identity fields
  const [ownerType, setOwnerType] = useState<"individual" | "company">(
    "company",
  );
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Step 2: Account credentials
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Step 3: Operational data
  const [experienceYears, setExperienceYears] = useState("5");
  const [shipReg, setShipReg] = useState("");
  const [shipName, setShipName] = useState("");
  const [homePort, setHomePort] = useState("");
  const [wpp, setWpp] = useState("WPP 573");

  // Step 4: Terms & submission
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const FIELD_INPUT_MAP: Record<string, string> = {
    fullName: "rg-name",
    companyName: "rg-company",
    username: "rg-user",
    phone: "rg-phone",
    email: "rg-email",
    password: "rg-pass",
    passwordConfirm: "rg-pass2",
  };

  const focusFirstErrorField = (errs: Record<string, string>) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    const elementId = FIELD_INPUT_MAP[firstKey] || firstKey;
    setTimeout(() => {
      const el =
        document.getElementById(elementId) ||
        document.querySelector(`[name="${firstKey}"]`);
      if (el instanceof HTMLElement) {
        el.focus();
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 60);
  };

  const handleClearError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    setErrorMsg(null);
  };

  const handleNext = () => {
    setErrorMsg(null);

    // Step 1 Validation
    if (currentStep === 1) {
      const parsed = registerStep1Schema.safeParse({
        role,
        fullName,
        companyName,
      });
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        parsed.error.issues.forEach((issue) => {
          const key = String(issue.path[0] || "");
          if (key && !errors[key]) {
            errors[key] = issue.message;
          }
        });
        setFieldErrors(errors);
        setErrorMsg(
          parsed.error.issues[0]?.message ||
            "Harap lengkapi formulir identitas dengan benar.",
        );
        focusFirstErrorField(errors);
        return;
      }
    }

    // Step 2 Validation
    if (currentStep === 2) {
      const parsed = registerStep2Schema.safeParse({
        username,
        email,
        phone,
        password,
        passwordConfirm,
      });
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        parsed.error.issues.forEach((issue) => {
          const key = String(issue.path[0] || "");
          if (key && !errors[key]) {
            errors[key] = issue.message;
          }
        });
        setFieldErrors(errors);
        setErrorMsg(
          parsed.error.issues[0]?.message ||
            "Harap lengkapi kredensial akun dengan benar.",
        );
        focusFirstErrorField(errors);
        return;
      }
    }

    setFieldErrors({});
    setErrorMsg(null);
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setFieldErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!agreeTerms) {
      setErrorMsg(
        "Centang persetujuan syarat & ketentuan untuk menyelesaikan pendaftaran.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payload: RegisterPayload = {
        username: username.trim(),
        email: email.trim(),
        password,
        password_confirm: passwordConfirm,
        role: role === "captain" ? "captain" : "owner",
        full_name: fullName.trim(),
        phone: phone.trim(),
        contact_info: phone.trim(),
        owner_type: role === "owner" ? ownerType : "individual",
        ship_code: (shipReg && shipReg.trim()) || undefined,
        address: (homePort && homePort.trim()) || undefined,
      };

      const res = await authService.register(payload);
      toast.success(
        `Pendaftaran berhasil! Selamat datang, ${fullName.trim() || username}.`,
      );

      if (res.role === "captain") {
        navigate("/captain");
      } else {
        navigate("/owner");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Pendaftaran gagal. Periksa kembali isian formulir.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-full w-full">
      {/* 1. Circle Stepper with Text Underneath and Connecting Line */}
      <div
        className="relative mb-5 sm:mb-7 pt-1"
        aria-label="Tahapan Pendaftaran"
      >
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const isPassed = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={s.num}
                className="flex-1 relative flex flex-col items-center min-w-0"
              >
                {/* Connecting track between steps */}
                {!isLast && (
                  <div className="absolute top-4 sm:top-4.5 -translate-y-1/2 left-1/2 w-full h-0.5 bg-fco-border dark:bg-fco-border-dark z-0">
                    <div
                      className="h-full bg-fco-blue transition-all duration-300"
                      style={{ width: currentStep > s.num ? "100%" : "0%" }}
                    />
                  </div>
                )}

                {/* Step Circle */}
                <div
                  className={`relative z-1 w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center font-bold text-xs sm:text-sm transition-all ${
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

                {/* Step Title Label Underneath */}
                <span
                  className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-semibold tracking-tight text-center truncate max-w-full px-0.5 ${
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

      {/* 2. Streamlined Form Card */}
      <div className="surface-card border dark:border-fco-border-dark rounded-xl sm:rounded-2xl p-4 sm:p-7 lg:p-8 shadow-xs">
        {/* Contextual In-Card Alert Banner (Only shown if no inline field errors exist) */}
        {errorMsg && Object.keys(fieldErrors).length === 0 && (
          <div
            role="alert"
            className="flex items-center gap-2.5 p-3 px-3.5 sm:px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-5 border border-red-200 dark:border-red-500/20"
          >
            <AlertCircle
              size={16}
              className="shrink-0 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dynamic Form Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role + currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            {currentStep === 1 && (
              <StepIdentity
                role={role}
                setRole={setRole}
                ownerType={ownerType}
                setOwnerType={setOwnerType}
                fullName={fullName}
                setFullName={setFullName}
                companyName={companyName}
                setCompanyName={setCompanyName}
                errors={fieldErrors}
                onClearError={handleClearError}
              />
            )}

            {currentStep === 2 && (
              <StepAccount
                username={username}
                setUsername={setUsername}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                passwordConfirm={passwordConfirm}
                setPasswordConfirm={setPasswordConfirm}
                errors={fieldErrors}
                onClearError={handleClearError}
              />
            )}

            {currentStep === 3 && (
              <StepOperational
                role={role}
                experienceYears={experienceYears}
                setExperienceYears={setExperienceYears}
                shipReg={shipReg}
                setShipReg={setShipReg}
                shipName={shipName}
                setShipName={setShipName}
                homePort={homePort}
                setHomePort={setHomePort}
                wpp={wpp}
                setWpp={setWpp}
              />
            )}

            {currentStep === 4 && (
              <StepReview
                role={role}
                fullName={fullName}
                companyName={companyName}
                email={email}
                phone={phone}
                shipReg={shipReg}
                shipName={shipName}
                homePort={homePort}
                wpp={wpp}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* 3. Streamlined Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-7 pt-4 sm:pt-6 border-t border-fco-border-subtle">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isLoading}
              className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl text-xs sm:text-sm border border-fco-border surface-card hover:surface-page text-strong font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5 sm:gap-2 shrink-0"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Sebelumnya</span>
            </button>
          )}

          <div className="flex-1" />

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl text-xs sm:text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors shadow-xs inline-flex items-center justify-center gap-1.5 sm:gap-2 shrink-0"
            >
              <span>Lanjut</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl text-xs sm:text-sm border-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                  <span className="hidden sm:inline">
                    Selesaikan Pendaftaran
                  </span>
                  <span className="sm:hidden">Daftar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
