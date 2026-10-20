import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { useToast } from "./toast";

export function useLogout() {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await authService.logout();
      toast.success("Logout berhasil. Sesi telah diakhiri.");
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return { loggingOut, handleLogout };
}
