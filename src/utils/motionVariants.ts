import type { TargetAndTransition, Variants } from "framer-motion";
import { isReducedMotionPreferred, isMobileDevice } from "./lenis";

/**
 * Variants untuk container daftar kartu role & jenis akun (Stagger effect)
 */
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: isReducedMotionPreferred()
        ? 0
        : isMobileDevice()
          ? 0.05
          : 0.08,
      delayChildren: isReducedMotionPreferred() ? 0 : 0.04,
    },
  },
};

/**
 * Variants untuk kartu role & jenis akun (Fade + naik sedikit dari bawah)
 */
export const cardItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: isReducedMotionPreferred() ? 0 : isMobileDevice() ? 8 : 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: isReducedMotionPreferred()
        ? 0.01
        : isMobileDevice()
          ? 0.25
          : 0.35,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

/**
 * Animasi hover kartu role & jenis akun:
 * Naik sedikit (-3px) + shadow membesar + border highlight
 */
export const roleCardHoverVariants: TargetAndTransition = {
  y: isReducedMotionPreferred() ? 0 : -3,
  boxShadow: isReducedMotionPreferred()
    ? "none"
    : "0 10px 22px -4px rgba(37, 99, 235, 0.16), 0 4px 6px -2px rgba(37, 99, 235, 0.08)",
  borderColor: "#2563EB",
  transition: {
    duration: 0.2,
    ease: "easeOut",
  },
};

/**
 * Animasi tap / tekan tombol: scale 0.97
 */
export const buttonTapVariants: TargetAndTransition = {
  scale: isReducedMotionPreferred() ? 1 : 0.97,
  transition: {
    duration: 0.1,
  },
};

/**
 * Animasi pindah wizard step:
 * Step lama keluar ke kiri, step baru masuk dari kanan, durasi 0.4 detik
 */
export const wizardStepVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: isReducedMotionPreferred()
      ? 0
      : direction > 0
        ? isMobileDevice()
          ? 24
          : 45
        : isMobileDevice()
          ? -24
          : -45,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: isReducedMotionPreferred() ? 0.01 : 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: isReducedMotionPreferred()
      ? 0
      : direction > 0
        ? isMobileDevice()
          ? -24
          : -45
        : isMobileDevice()
          ? 24
          : 45,
    transition: {
      duration: isReducedMotionPreferred() ? 0.01 : 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

/**
 * Animasi geser Panel Welcome / toggle Login & Register:
 * Durasi 0.6 detik, smooth ease
 */
export const panelWelcomeVariants: Variants = {
  initial: (direction: number = 1) => ({
    opacity: 0,
    x: isReducedMotionPreferred()
      ? 0
      : direction * (isMobileDevice() ? 20 : 40),
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: isReducedMotionPreferred() ? 0.01 : 0.6,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: (direction: number = 1) => ({
    opacity: 0,
    x: isReducedMotionPreferred()
      ? 0
      : -direction * (isMobileDevice() ? 20 : 40),
    transition: {
      duration: isReducedMotionPreferred() ? 0.01 : 0.6,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};
