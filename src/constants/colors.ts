/**
 * FishPro / Nexus Design System - Color Tokens & Palette
 *
 * File ini menampung seluruh referensi warna resmi yang digunakan di seluruh aplikasi:
 * - Brand / Primary colors
 * - Neutral surfaces & typography
 * - Semantic states (success, warning, danger, info)
 * - Component specific palettes (Tables, Action Buttons, Badges, Cards)
 */

export const colors = {
  // Brand / Dashboard Primary (Biru FishPro / Nexus)
  brand: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB", // Primary Brand Blue (Dashboard & Table Header)
    700: "#1D4ED8", // Hover State
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  },

  // Surfaces & Backgrounds
  surface: {
    canvas: "#F8F9FB",     // Latar belakang halaman utama
    card: "#FFFFFF",       // Kartu putih
    cardDark: "#111827",   // Kartu dark mode (Navy Slate)
    pageDark: "#0B1220",   // Latar belakang halaman dark mode
    inset: "#F9FAFB",      // Input, table header fallback, search bar
    insetDark: "#161E29",  // Inset dark mode
  },

  // Borders & Dividing Lines
  border: {
    line: "#E5E7EB",       // Border kartu & pemisah tabel utama (light)
    lineDark: "#1F2937",   // Border kartu dark mode
    subtle: "#F3F4F6",     // Garis pemisah halus
  },

  // Typography & Content
  ink: {
    primary: "#09090B",    // Teks judul & angka utama
    soft: "#111827",       // Teks konten reguler
    charcoal: "#1F2937",   // Label icon & teks sedang
    subtext: "#6B7280",    // Deskripsi, subjudul, & teks redup
    faint: "#9CA3AF",      // Placeholder & shortcut hint
    white: "#FFFFFF",      // Teks kontras putih
  },

  // Semantic States
  semantic: {
    success: {
      light: "#ECFDF5",
      border: "#A7F3D0",
      text: "#059669",
      solid: "#10B981",
    },
    warning: {
      light: "#FFFBEB",
      border: "#FDE68A",
      text: "#D97706",
      solid: "#F59E0B", // Tombol Ubah / Edit
      hover: "#D97706",
    },
    danger: {
      light: "#FEF2F2",
      border: "#FECACA",
      text: "#DC2626",
      solid: "#F43F5E", // Tombol Hapus / Delete (Rose 500)
      hover: "#E11D48",
    },
    info: {
      light: "#EFF6FF",
      border: "#BFDBFE",
      text: "#2563EB",
      solid: "#2563EB", // Tombol Detail / Primary Action
      hover: "#1D4ED8",
    },
  },

  // Specific Component Presets
  table: {
    headerBg: "#2563EB",        // Header tabel biru dashboard
    headerText: "#FFFFFF",      // Teks header tabel putih
    rowBorder: "#E5E7EB",       // Garis antar baris
    rowHover: "#F9FAFB",        // Hover state baris tabel
    rowHoverDark: "rgba(31, 41, 55, 0.4)",
    badgeRankBg: "#F9FAFB",
    badgeRankText: "#1F2937",
  },

  actions: {
    detail: {
      bg: "#2563EB",
      hover: "#1D4ED8",
      text: "#FFFFFF",
    },
    edit: {
      bg: "#F59E0B",
      hover: "#D97706",
      text: "#FFFFFF",
    },
    delete: {
      bg: "#F43F5E",
      hover: "#E11D48",
      text: "#FFFFFF",
    },
  },
} as const;

export type ColorTokens = typeof colors;
export default colors;
