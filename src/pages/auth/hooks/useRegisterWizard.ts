import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/toast";
import { authService, type RegisterPayload } from "../../../services/auth";
import type { Role } from "../components/register/types";
import {
  registerStep1Schema,
  registerStep2Schema,
} from "../../../utils/schemas";

const FIELD_INPUT_MAP: Record<string, string> = {
  fullName: "rg-name",
  companyName: "rg-company",
  username: "rg-user",
  phone: "rg-phone",
  email: "rg-email",
  password: "rg-pass",
  passwordConfirm: "rg-pass2",
};

export function useRegisterWizard() {
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

  return {
    role,
    setRole,
    currentStep,
    setCurrentStep,
    ownerType,
    setOwnerType,
    fullName,
    setFullName,
    companyName,
    setCompanyName,
    username,
    setUsername,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    experienceYears,
    setExperienceYears,
    shipReg,
    setShipReg,
    shipName,
    setShipName,
    homePort,
    setHomePort,
    wpp,
    setWpp,
    agreeTerms,
    setAgreeTerms,
    errorMsg,
    setErrorMsg,
    fieldErrors,
    isLoading,
    handleClearError,
    handleNext,
    handlePrev,
    handleSubmit,
  };
}
