import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Ship } from "lucide-react";
import { authService, type RegisterPayload } from "../../../services/auth";
import { roleCards, roleLabel, type Role } from "./register/types";
import { RoleSelector } from "./register/RoleSelector";
import { StepIdentity } from "./register/StepIdentity";
import { StepAccount } from "./register/StepAccount";
import { StepOperational } from "./register/StepOperational";
import { StepReview } from "./register/StepReview";

const steps = [
  { num: 1, title: "Data diri" },
  { num: 2, title: "Akun" },
  { num: 3, title: "Detail" },
  { num: 4, title: "Cek" },
];

export function RegisterStepWizard() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [ownerType, setOwnerType] = useState<"individual" | "company">(
    "company",
  );
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [licenseNumber, setLicenseNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState("5");
  const [shipReg, setShipReg] = useState("");
  const [shipName, setShipName] = useState("");
  const [homePort, setHomePort] = useState("Pelabuhan Benoa");
  const [wpp, setWpp] = useState("WPP 573");
  const [department, setDepartment] = useState(
    "Direktorat Pengawasan Sumber Daya Kelautan",
  );
  const [nip, setNip] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickRole = (r: Role) => {
    setRole(r);
    setCurrentStep(1);
    setErrorMsg(null);
  };

  const changeRole = () => {
    setRole(null);
    setCurrentStep(1);
    setErrorMsg(null);
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (currentStep === 2) {
      if (!username.trim() || !email.trim() || !password) {
        setErrorMsg("Lengkapi username, email, dan sandi.");
        return;
      }
      if (password.length < 8) {
        setErrorMsg("Sandi minimal 8 karakter.");
        return;
      }
      if (password !== passwordConfirm) {
        setErrorMsg("Sandi tidak sama, coba lagi.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!agreeTerms) {
      setErrorMsg("Centang persetujuan dulu untuk lanjut.");
      return;
    }

    if (role === "regulator") {
      setErrorMsg(
        "Pendaftaran mandiri diperuntukkan bagi Pemilik Kapal dan Nahkoda. Akun Pengawas/Regulator diterbitkan langsung oleh Administrator KKP.",
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
    } finally {
      setIsLoading(false);
    }
  };

  // Gate: Role Selection
  if (!role) {
    return <RoleSelector onSelect={pickRole} />;
  }

  const foundRoleCard = roleCards.find((c) => c.key === role);
  const RoleIcon = foundRoleCard?.Icon ?? Ship;
  const roleBg =
    role === "owner"
      ? "bg-fco-blue"
      : role === "captain"
        ? "bg-emerald-600"
        : "bg-amber-500";

  return (
    <div className="max-w-full w-full">
      {/* Header identitas peran terpilih */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-fco-border">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-10 h-10 rounded-xl ${roleBg} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <RoleIcon size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="text-xs text-soft font-medium block">
              Mendaftar sebagai
            </span>
            <span className="text-base font-extrabold text-strong truncate block">
              {roleLabel[role]}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={changeRole}
          className="text-xs sm:text-sm font-semibold text-fco-blue hover:text-fco-blue-hover hover:underline bg-transparent border-none cursor-pointer py-1 px-2.5 rounded-lg hover:surface-inset transition-colors shrink-0"
        >
          Ganti peran
        </button>
      </div>

      {/* Stepper */}
      <div className="mb-5">
        <div className="flex items-center justify-between relative mb-2">
          <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-4 sm:top-4.5 h-0.5 bg-fco-border z-0" />
          <div
            className="absolute left-4 sm:left-6 top-4 sm:top-4.5 h-0.5 bg-fco-blue z-0 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 88}%`,
            }}
          />
          {steps.map((s) => {
            const isPassed = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className="flex flex-col items-center gap-1 z-10 px-0.5 sm:px-1"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center font-bold text-xs sm:text-sm transition-all ${
                    isCurrent
                      ? "bg-fco-blue text-white ring-2 ring-fco-blue/15"
                      : isPassed
                        ? "bg-fco-blue text-white"
                        : "surface-card border-2 border-fco-border text-soft"
                  }`}
                >
                  <span className="leading-none tabular-nums select-none flex items-center justify-center text-center">
                    {isPassed ? "✓" : s.num}
                  </span>
                </div>
                <span
                  className={`text-fco-xs sm:text-xs font-semibold whitespace-nowrap ${
                    isCurrent
                      ? "text-fco-blue"
                      : isPassed
                        ? "text-strong"
                        : "text-fco-placeholder"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
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
            key={role + currentStep}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-w-full w-full"
          >
            {currentStep === 1 && (
              <StepIdentity
                role={role}
                ownerType={ownerType}
                setOwnerType={setOwnerType}
                fullName={fullName}
                setFullName={setFullName}
                companyName={companyName}
                setCompanyName={setCompanyName}
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
              />
            )}

            {currentStep === 3 && (
              <StepOperational
                role={role}
                licenseNumber={licenseNumber}
                setLicenseNumber={setLicenseNumber}
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
                department={department}
                setDepartment={setDepartment}
                nip={nip}
                setNip={setNip}
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
                licenseNumber={licenseNumber}
                nip={nip}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 h-11 rounded-xl text-sm border border-fco-border surface-card text-strong font-semibold cursor-pointer transition-colors"
            >
              Kembali
            </button>
          )}
          {currentStep < 4 ? (
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
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              className="flex-1 h-11 rounded-xl text-sm border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}
              <span>{isLoading ? "Mendaftarkan..." : "Buat akun"}</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
