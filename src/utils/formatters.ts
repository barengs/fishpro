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

/**
 * Format string/angka numerik dengan pemisah ribuan titik secara real-time.
 * @example formatThousandInput("1000") -> "1.000"
 * @example formatThousandInput("1000000") -> "1.000.000"
 * @example formatThousandInput("1000.5") -> "1.000,5"
 */
export function formatThousandInput(
  val: string | number | null | undefined,
): string {
  if (val === null || val === undefined) return "";
  let s = String(val).trim();
  if (!s) return "";

  const isNegative = s.startsWith("-");
  if (isNegative) s = s.slice(1);

  let integerPart = s;
  let decimalPart: string | null = null;

  if (s.includes(",")) {
    const parts = s.split(",");
    integerPart = parts[0].replace(/\./g, "");
    decimalPart = parts.slice(1).join("");
  } else if (s.includes(".")) {
    const parts = s.split(".");
    if (parts.length > 2) {
      integerPart = s.replace(/\./g, "");
    } else if (parts.length === 2) {
      if (
        parts[1].length === 3 &&
        parts[0].length >= 1 &&
        parts[0].length <= 3
      ) {
        integerPart = parts[0] + parts[1];
      } else {
        integerPart = parts[0];
        decimalPart = parts[1];
      }
    }
  }

  integerPart = integerPart.replace(/\D/g, "");
  if (!integerPart && decimalPart === null) return "";

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const res =
    decimalPart !== null
      ? `${formattedInteger || "0"},${decimalPart.replace(/\D/g, "")}`
      : formattedInteger;

  return isNegative ? `-${res}` : res;
}

/**
 * Mengubah string tampilan (masked dengan titik ribuan) kembali ke angka mentah tanpa titik.
 * @example unformatThousandInput("1.000") -> "1000"
 * @example unformatThousandInput("1.000,5") -> "1000.5"
 */
export function unformatThousandInput(
  val: string | number | null | undefined,
): string {
  if (val === null || val === undefined) return "";
  const s = String(val).trim();
  if (!s) return "";

  const isNegative = s.startsWith("-");
  let clean = s.replace(/\./g, "");
  clean = clean.replace(/,/g, ".");
  clean = clean.replace(/[^\d.]/g, "");

  const dotParts = clean.split(".");
  if (dotParts.length > 2) {
    clean = `${dotParts[0]}.${dotParts.slice(1).join("")}`;
  }

  return isNegative ? `-${clean}` : clean;
}

/**
 * Menghitung posisi kursor input agar tidak melompat saat pemisah ribuan disisipkan.
 */
export function calculateCursorPosition(
  oldFormatted: string,
  newFormatted: string,
  oldCursor: number,
): number {
  const rawBeforeCursor = oldFormatted
    .slice(0, oldCursor)
    .replace(/\./g, "").length;
  let count = 0;
  for (let i = 0; i < newFormatted.length; i++) {
    if (newFormatted[i] !== ".") {
      count++;
    }
    if (count === rawBeforeCursor) {
      return i + 1;
    }
  }
  return newFormatted.length;
}
