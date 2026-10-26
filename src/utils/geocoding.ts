/**
 * Modul Geocoding & Resolusi Lokasi Maritim
 * Mengatasi masalah timeout GPS pada laptop/PC dan menyediakan fallback cerdas.
 */

export interface ResolvedLocation {
  latitude: number;
  longitude: number;
  description: string;
  source: "gps" | "network";
}

interface LocalityItem {
  name?: string;
  description?: string;
  adminLevel?: number;
}

interface ReverseGeocodeResponse {
  latitude?: number;
  longitude?: number;
  locality?: string;
  city?: string;
  principalSubdivision?: string;
  localityInfo?: {
    informative?: LocalityItem[];
    administrative?: LocalityItem[];
  };
}

function parseLocationData(
  data: ReverseGeocodeResponse,
  lat: number,
  lng: number,
): string {
  const parts: string[] = [];

  // Deteksi perairan maritim (Teluk, Selat, Laut, Samudra, Bay, Sea)
  const waterFeature = data.localityInfo?.informative?.find((item) => {
    const desc = (item.description || "").toLowerCase();
    const name = (item.name || "").toLowerCase();
    return (
      /\b(bay|sea|ocean|strait|gulf|laut|samudra|teluk)\b/i.test(desc) ||
      /\b(selat|laut|samudra|teluk)\b/i.test(name)
    );
  });

  if (waterFeature?.name) {
    parts.push(waterFeature.name);
  }

  // Nama lokalitas / kecamatan / kota
  if (data.locality && !parts.includes(data.locality)) {
    parts.push(data.locality);
  } else if (data.city && !parts.includes(data.city)) {
    parts.push(data.city);
  }

  // Kabupaten / Kota Administrasi
  const regency = data.localityInfo?.administrative?.find(
    (item) => item.adminLevel === 5 || item.adminLevel === 6,
  );
  if (regency?.name && !parts.includes(regency.name)) {
    parts.push(regency.name);
  }

  // Provinsi
  if (data.principalSubdivision && !parts.includes(data.principalSubdivision)) {
    parts.push(data.principalSubdivision);
  }

  if (parts.length > 0) {
    const locationText = parts.join(", ");
    return parts.some((p) => /\b(samudra|laut|selat|teluk)\b/i.test(p))
      ? locationText
      : `Perairan ${locationText}`;
  }

  return `Perairan (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

/**
 * Melakukan reverse geocoding dari koordinat GPS (lat, lng) ke nama perairan/alamat teks.
 */
export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number,
  timeoutMs = 5000,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("Gagal mengambil data geocode");
    const data: ReverseGeocodeResponse = await res.json();
    return parseLocationData(data, latitude, longitude);
  } catch {
    return `Perairan (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fallback Geolocation berbasis IP Jaringan.
 * Cepat (<250ms), gratis, tanpa API key, dan bekerja di semua laptop/PC tanpa chip GPS satelit.
 */
export async function getClientIpLocation(
  timeoutMs = 4000,
): Promise<ResolvedLocation> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=id`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("Gagal mengambil lokasi IP");
    const data: ReverseGeocodeResponse = await res.json();

    const lat = Number(data.latitude) || -8.74;
    const lng = Number(data.longitude) || 115.2;
    const desc = parseLocationData(data, lat, lng);

    return {
      latitude: lat,
      longitude: lng,
      description: desc,
      source: "network",
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Mengambil koordinat perangkat dengan strategi multi-tier cerdas:
 * 1. Prioritas Utama: Mengunci GPS Satelit Presisi Tinggi (A-GPS hardware smartphone).
 * 2. Fallback: Jika perangkat tidak memiliki chip satelit (seperti PC/laptop),
 *    sistem otomatis menggunakan IP/WiFi network geolocation agar proses tidak gagal.
 */
export async function resolveDeviceLocation(): Promise<ResolvedLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      getClientIpLocation()
        .then(resolve)
        .catch(() =>
          reject(new Error("Perangkat tidak mendukung pendeteksian lokasi.")),
        );
      return;
    }

    let hasHandled = false;

    // Timer proteksi jika perangkat menggantung tanpa respon
    const fallbackTimer = setTimeout(() => {
      if (!hasHandled) {
        hasHandled = true;
        getClientIpLocation()
          .then(resolve)
          .catch(() =>
            reject(
              new Error(
                "Waktu pembacaan lokasi habis. Masukkan koordinat secara manual.",
              ),
            ),
          );
      }
    }, 6000);

    const onGpsSuccess = async (pos: GeolocationPosition) => {
      if (hasHandled) return;
      hasHandled = true;
      clearTimeout(fallbackTimer);

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const desc = await reverseGeocodeLocation(lat, lng).catch(
        () => `Perairan (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      );

      resolve({
        latitude: lat,
        longitude: lng,
        description: desc,
        source: "gps",
      });
    };

    const tryCoarseOrIp = () => {
      if (hasHandled) return;
      // Coba akurasi standar (WiFi/seluler) sebelum beralih ke IP
      navigator.geolocation.getCurrentPosition(
        onGpsSuccess,
        () => {
          if (hasHandled) return;
          hasHandled = true;
          clearTimeout(fallbackTimer);
          getClientIpLocation()
            .then(resolve)
            .catch(() =>
              reject(
                new Error(
                  "Tidak dapat mendeteksi lokasi. Masukkan koordinat secara manual.",
                ),
              ),
            );
        },
        {
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 120000,
        },
      );
    };

    // 1. Coba GPS Satelit Hardware Presisi Tinggi terlebih dahulu (Optimal untuk HP nahkoda di kapal)
    navigator.geolocation.getCurrentPosition(
      onGpsSuccess,
      () => {
        // Jika gagal/timeout di laptop, fallback halus ke akurasi standar/IP
        tryCoarseOrIp();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      },
    );
  });
}
