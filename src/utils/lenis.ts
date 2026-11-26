/**
 * Lenis Smooth Scroll Controller
 * Mengatur smooth scroll global dengan loop requestAnimationFrame,
 * pencegahan bentrok pada modal/dropdown, dan fallback aman jika Lenis gagal load.
 */

export interface LenisScrollOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

interface LenisInstance {
  raf: (time: number) => void;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: LenisScrollOptions,
  ) => void;
  destroy: () => void;
}

let activeLenisInstance: LenisInstance | null = null;
let activeRafId: number | null = null;

/**
 * Cek apakah user mengaktifkan prefers-reduced-motion
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Cek apakah layar berukuran mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 640px)").matches;
}

/**
 * Inisialisasi Lenis Smooth Scroll.
 * Jika library Lenis berhasil di-load, jalankan loop requestAnimationFrame.
 * Jika gagal load atau reduced motion aktif, fallback ke scroll standar tanpa error.
 */
export async function initLenis(): Promise<() => void> {
  if (typeof window === "undefined") {
    return () => {};
  }

  // Jika reduced motion aktif, jangan aktifkan smooth wheel interception
  if (isReducedMotionPreferred()) {
    return () => {};
  }

  try {
    // Mencoba memuat lenis secara dinamis
    const lenisModule = await import("lenis").catch(() => null);

    if (lenisModule) {
      const LenisClass =
        lenisModule.default || (lenisModule as unknown as { default: unknown });

      if (typeof LenisClass === "function") {
        const LenisCtor = LenisClass as unknown as new (
          options?: unknown,
        ) => LenisInstance;
        const instance = new LenisCtor({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: isMobileDevice() ? 0.9 : 1,
          touchMultiplier: 1.5,
          prevent: (node: HTMLElement) => {
            // Pastikan Lenis tidak bentrok dengan scroll di dalam modal / dropdown / dialog
            return (
              node.hasAttribute("data-lenis-prevent") ||
              Boolean(
                node.closest(
                  "[data-lenis-prevent], dialog, [role='dialog'], [role='menu'], [role='listbox'], .modal-content, .scrollable",
                ),
              )
            );
          },
        });

        activeLenisInstance = instance;

        const rafLoop = (time: number) => {
          instance.raf(time);
          activeRafId = requestAnimationFrame(rafLoop);
        };

        activeRafId = requestAnimationFrame(rafLoop);

        return () => {
          if (activeRafId !== null) {
            cancelAnimationFrame(activeRafId);
            activeRafId = null;
          }
          instance.destroy();
          activeLenisInstance = null;
        };
      }
    }
  } catch {
    // Lenis gagal load atau belum terpasang:
    // Aplikasi tetap berjalan dan scroll normal tanpa crash / error.
  }

  // Fallback: Kembalikan fungsi cleanup kosong jika Lenis tidak aktif
  return () => {
    if (activeRafId !== null) {
      cancelAnimationFrame(activeRafId);
      activeRafId = null;
    }
    activeLenisInstance = null;
  };
}

/**
 * Scroll ke elemen atau posisi tertentu secara smooth menggunakan Lenis.
 * Jika Lenis gagal / tidak aktif, gunakan native window.scrollTo smooth.
 */
export function lenisScrollTo(
  target: number | string | HTMLElement = 0,
  options: LenisScrollOptions = {},
): void {
  if (typeof window === "undefined") return;

  const reducedMotion = isReducedMotionPreferred();

  if (activeLenisInstance && !reducedMotion) {
    try {
      activeLenisInstance.scrollTo(target, {
        offset: options.offset ?? 0,
        duration: options.duration ?? 0.8,
        immediate: options.immediate || false,
      });
      return;
    } catch {
      // Abaikan dan gunakan fallback native
    }
  }

  // Fallback Native Smooth Scroll
  try {
    let top = 0;
    if (typeof target === "number") {
      top = target;
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) {
        const rect = el.getBoundingClientRect();
        top = window.scrollY + rect.top + (options.offset ?? 0);
      }
    } else if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();
      top = window.scrollY + rect.top + (options.offset ?? 0);
    }

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion || options.immediate ? "auto" : "smooth",
    });
  } catch {
    window.scrollTo(0, 0);
  }
}
