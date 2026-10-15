/**
 * Utilitas pemformatan mata uang, berat, angka, dan hash untuk dashboard FISHPRO.
 */

/**
 * Format angka nominal ke format mata uang Rupiah Indonesia (Rp).
 * @param value Jumlah dalam angka
 * @param compact Jika true, memendekkan angka besar (misal Rp 4,4 M atau Rp 31 jt)
 */
export function formatRupiah(
  value: number | string | null | undefined,
  compact = true,
): string {
  if (value === null || value === undefined || value === "") return "Rp 0";
  const num = typeof value === "number" ? value : parseFloat(value) || 0;
  if (num === 0) return "Rp 0";

  if (compact) {
    if (num >= 1_000_000_000) {
      return `Rp ${(num / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
    }
    if (num >= 1_000_000) {
      return `Rp ${(num / 1_000_000).toFixed(0)} jt`;
    }
    if (num >= 1_000) {
      return `Rp ${(num / 1_000).toFixed(0)} rb`;
    }
  }

  return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
}

/**
 * Format bobot tangkapan ikan dalam satuan kilogram atau metrik ton.
 * @param kgValue Berat dalam kilogram
 */
export function formatWeight(
  kgValue: number | string | null | undefined,
): string {
  if (kgValue === null || kgValue === undefined || kgValue === "")
    return "0 kg";
  const num = typeof kgValue === "number" ? kgValue : parseFloat(kgValue) || 0;
  if (num === 0) return "0 kg";

  if (num >= 1000) {
    const tons = num / 1000;
    // Tampilkan 1 desimal jika tidak bulat
    return `${tons % 1 === 0 ? tons.toFixed(0) : tons.toFixed(1).replace(".", ",")} ton`;
  }

  return `${Math.round(num).toLocaleString("id-ID")} kg`;
}

/**
 * Format angka integer dengan pemisah ribuan standar Indonesia (titik).
 */
export function formatNumber(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "0";
  const num = typeof value === "number" ? value : parseFloat(value) || 0;
  return num.toLocaleString("id-ID");
}

/**
 * Memotong string hash kriptografis panjang (misal SHA-256) agar nyaman di mata.
 * @example formatShortHash("7be0c04da3f9...", 6, 4) -> "7be0c0…a3f9"
 */
export function formatShortHash(
  hash: string | null | undefined,
  prefixLength = 6,
  suffixLength = 4,
): string {
  if (!hash) return "—";
  if (hash.length <= prefixLength + suffixLength) return hash;
  return `${hash.slice(0, prefixLength)}…${hash.slice(-suffixLength)}`;
}
