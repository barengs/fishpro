import React, { useCallback, useMemo, useState } from "react";
import type { Toast, ToastType } from "./types";
import { ToastContext } from "./toastContext";
import { ToastItem } from "./ToastItem";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
      return id;
    },
    [],
  );

  const success = useCallback(
    (message: string, duration?: number) =>
      showToast(message, "success", duration),
    [showToast],
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      showToast(message, "error", duration),
    [showToast],
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      showToast(message, "warning", duration),
    [showToast],
  );

  const info = useCallback(
    (message: string, duration?: number) =>
      showToast(message, "info", duration),
    [showToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      success,
      error,
      warning,
      info,
      dismissToast,
      clearAll,
    }),
    [showToast, success, error, warning, info, dismissToast, clearAll],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-label="Notifikasi sistem"
        className="fixed bottom-5 right-5 z-60 pointer-events-none flex flex-col gap-2.5 items-end max-w-full"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
