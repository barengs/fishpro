export interface WppPolygonGeo {
  code: string;
  name: string;
  ocean: string;
  // Latitude, Longitude center point for label/marker
  center: [number, number];
  // Array of [latitude, longitude] pairs defining real maritime boundaries
  polygon: [number, number][];
  description: string;
}

/**
 * Batas Koordinat Geografis Nyata 11 WPPNRI (Permen-KP RI)
 * Berdasarkan titik koordinat Lintang (Lat) dan Bujur (Lng) perairan maritim Indonesia
 */
export const WPP_REAL_POLYGONS: WppPolygonGeo[] = [
  {
    code: "571",
    name: "Selat Malaka & Laut Andaman",
    ocean: "Barat Laut Sumatera",
    center: [3.8, 99.8],
    polygon: [
      [6.0, 95.0],
      [6.0, 98.0],
      [4.5, 100.0],
      [1.5, 103.5],
      [1.0, 102.5],
      [2.5, 99.5],
      [4.0, 97.5],
      [5.5, 95.2],
    ],
    description: "Perairan Selat Malaka membentang hingga Laut Andaman",
  },
  {
    code: "572",
    name: "Samudera Hindia Barat Sumatera",
    ocean: "Samudera Hindia Barat",
    center: [-1.5, 97.5],
    polygon: [
      [6.0, 95.0],
      [4.0, 97.5],
      [1.0, 100.0],
      [-3.0, 102.0],
      [-6.0, 105.0],
      [-7.5, 103.0],
      [-3.0, 96.0],
      [2.0, 92.0],
      [5.5, 93.0],
    ],
    description: "Samudera Hindia sebelah barat Sumatera dan Selat Sunda",
  },
  {
    code: "573",
    name: "Samudera Hindia Selatan Jawa",
    ocean: "Samudera Hindia Selatan",
    center: [-9.5, 113.0],
    polygon: [
      [-6.0, 105.0],
      [-7.5, 108.5],
      [-8.5, 114.0],
      [-8.8, 117.0],
      [-9.0, 122.0],
      [-10.8, 124.0],
      [-12.0, 124.0],
      [-12.0, 105.0],
      [-7.5, 103.0],
    ],
    description:
      "Samudera Hindia selatan Jawa hingga perairan selatan Nusa Tenggara",
  },
  {
    code: "711",
    name: "Selat Karimata & Laut Natuna",
    ocean: "Laut Natuna & Natuna Utara",
    center: [2.5, 107.5],
    polygon: [
      [6.5, 105.0],
      [6.5, 110.0],
      [4.0, 110.0],
      [2.0, 110.0],
      [-1.0, 109.5],
      [-3.0, 107.5],
      [-1.5, 105.0],
      [1.0, 103.5],
      [3.0, 105.5],
    ],
    description: "Selat Karimata, Laut Natuna, hingga Laut Natuna Utara",
  },
  {
    code: "712",
    name: "Laut Jawa",
    ocean: "Perairan Dangkal Jawa",
    center: [-5.5, 111.5],
    polygon: [
      [-3.0, 106.5],
      [-3.0, 111.0],
      [-3.5, 116.0],
      [-7.0, 116.0],
      [-7.0, 113.5],
      [-6.5, 108.0],
      [-5.8, 106.0],
    ],
    description:
      "Perairan produktif Laut Jawa dari utara Jakarta hingga Madura",
  },
  {
    code: "713",
    name: "Selat Makassar & Laut Flores",
    ocean: "Perairan Tengah",
    center: [-3.5, 118.5],
    polygon: [
      [1.0, 118.0],
      [1.0, 120.5],
      [-2.5, 120.0],
      [-4.0, 121.5],
      [-8.0, 121.0],
      [-8.5, 116.0],
      [-3.5, 116.0],
      [-1.0, 117.5],
    ],
    description: "Selat Makassar, Teluk Bone, Laut Flores, dan Laut Bali",
  },
  {
    code: "714",
    name: "Laut Banda",
    ocean: "Kepulauan Maluku Selatan",
    center: [-5.5, 127.5],
    polygon: [
      [-3.0, 124.0],
      [-3.0, 130.5],
      [-6.0, 131.5],
      [-8.5, 129.0],
      [-8.5, 125.0],
      [-5.5, 123.5],
      [-4.0, 121.5],
    ],
    description: "Palung dalam Laut Banda dan perairan Teluk Tolo",
  },
  {
    code: "715",
    name: "Laut Maluku & Laut Halmahera",
    ocean: "Perairan Timur Laut",
    center: [0.5, 127.0],
    polygon: [
      [2.5, 124.5],
      [2.5, 130.5],
      [-1.5, 131.0],
      [-2.5, 126.0],
      [-0.5, 123.5],
      [1.5, 124.5],
    ],
    description: "Laut Maluku, Teluk Tomini, Laut Halmahera, dan Laut Seram",
  },
  {
    code: "716",
    name: "Laut Sulawesi",
    ocean: "Utara Sulawesi & Pasifik",
    center: [3.5, 122.5],
    polygon: [
      [5.5, 118.0],
      [5.5, 126.5],
      [2.5, 126.5],
      [1.5, 121.0],
      [1.0, 118.0],
    ],
    description: "Perairan Laut Sulawesi dan perbatasan utara Pulau Halmahera",
  },
  {
    code: "717",
    name: "Teluk Cenderawasih & Samudera Pasifik",
    ocean: "Utara Papua",
    center: [-0.5, 137.0],
    polygon: [
      [3.0, 130.5],
      [3.0, 141.0],
      [-2.5, 141.0],
      [-2.5, 135.0],
      [-1.5, 130.5],
    ],
    description: "Perairan Teluk Cenderawasih dan Samudera Pasifik utara Papua",
  },
  {
    code: "718",
    name: "Laut Aru, Laut Arafuru, & Timor",
    ocean: "Selatan Papua",
    center: [-7.0, 136.5],
    polygon: [
      [-4.5, 131.5],
      [-4.5, 141.0],
      [-9.5, 141.0],
      [-10.5, 134.0],
      [-9.5, 128.0],
      [-6.0, 131.5],
    ],
    description: "Perairan kaya udang & demersal: Laut Aru, Arafuru, dan Timor",
  },
];
