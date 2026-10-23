export interface WppGeoFeature {
  code: string;
  name: string;
  ocean: string;
  center: { x: number; y: number };
  path: string;
  description: string;
}

export interface IslandPath {
  name: string;
  path: string;
}

/**
 * Kontur geografis nyata kepulauan Nusantara Indonesia (Pulau Sumatera, Jawa, Kalimantan, Sulawesi, Papua, Maluku, Bali-Nusa Tenggara)
 * Skala koordinat: 1000 x 440 (Domain Maritim ~94°BT s.d. ~141°BT)
 */
export const INDONESIA_ISLANDS: IslandPath[] = [
  // 1. Pulau Sumatera
  {
    name: "Sumatera",
    path: "M 42 125 C 50 115, 65 95, 78 82 C 85 85, 96 100, 110 120 C 130 145, 155 170, 175 195 C 190 215, 208 245, 218 268 C 215 275, 202 280, 192 278 C 175 258, 155 230, 135 200 C 115 170, 85 145, 60 135 Z",
  },
  // Bangka & Belitung
  {
    name: "Bangka Belitung",
    path: "M 210 215 C 220 210, 226 218, 224 230 C 218 238, 212 232, 210 215 Z M 240 230 C 248 226, 254 234, 250 242 C 242 245, 238 238, 240 230 Z",
  },
  // 2. Pulau Jawa & Madura
  {
    name: "Jawa & Madura",
    path: "M 218 290 C 240 286, 280 288, 330 292 C 370 294, 410 292, 450 296 C 465 298, 480 305, 488 316 C 485 322, 470 326, 440 322 C 390 318, 340 318, 290 316 C 250 314, 225 310, 215 300 Z M 445 285 C 465 282, 485 285, 480 292 C 460 295, 445 292, 445 285 Z",
  },
  // 3. Bali, Lombok, Sumbawa, Flores, Timor Barat (Nusa Tenggara)
  {
    name: "Kepulauan Nusa Tenggara",
    path: "M 495 318 C 504 316, 510 320, 506 325 C 498 326, 495 322, 495 318 Z M 516 318 C 528 316, 532 322, 526 327 C 518 327, 515 322, 516 318 Z M 538 316 C 565 314, 580 320, 570 327 C 545 328, 535 322, 538 316 Z M 585 315 C 640 314, 655 322, 645 329 C 600 330, 585 322, 585 315 Z M 660 330 C 690 325, 715 335, 700 348 C 675 350, 655 340, 660 330 Z",
  },
  // 4. Pulau Kalimantan (Wilayah Indonesia)
  {
    name: "Kalimantan",
    path: "M 270 160 C 290 140, 340 135, 370 145 C 400 155, 435 150, 440 170 C 445 195, 430 220, 438 245 C 435 260, 415 272, 395 275 C 360 278, 320 270, 295 265 C 275 255, 260 230, 262 200 C 265 175, 268 165, 270 160 Z",
  },
  // 5. Pulau Sulawesi
  {
    name: "Sulawesi",
    path: "M 475 140 C 495 130, 545 120, 555 130 C 530 145, 515 155, 508 175 C 505 195, 535 205, 550 215 C 540 225, 515 220, 505 205 C 498 220, 502 260, 492 280 C 480 278, 475 250, 485 220 C 475 195, 465 155, 475 140 Z",
  },
  // 6. Kepulauan Maluku & Halmahera
  {
    name: "Kepulauan Maluku",
    path: "M 645 120 C 655 110, 670 125, 660 145 C 650 165, 665 175, 655 185 C 645 175, 640 145, 645 120 Z M 635 220 C 665 215, 680 225, 660 235 C 640 238, 630 230, 635 220 Z M 670 240 C 695 235, 705 245, 690 255 C 675 255, 665 245, 670 240 Z",
  },
  // 7. Pulau Papua (Wilayah Indonesia)
  {
    name: "Papua",
    path: "M 740 185 C 760 165, 785 180, 810 185 C 840 190, 880 195, 930 200 L 930 330 C 880 335, 845 320, 810 295 C 785 270, 775 235, 755 225 C 735 220, 725 195, 740 185 Z",
  },
];

/**
 * 11 Batas Wilayah Pengelolaan Perikanan (WPPNRI)
 * Membentang menutupi seluruh laut teritorial & ZEE Indonesia
 */
export const WPP_GEO_REGIONS: WppGeoFeature[] = [
  {
    code: "571",
    name: "Selat Malaka & Laut Andaman",
    ocean: "Perairan Barat Sumatera",
    center: { x: 125, y: 95 },
    path: "M 30 65 L 140 45 L 205 130 L 175 175 L 115 155 L 45 105 Z",
    description: "Perairan Selat Malaka membentang hingga Laut Andaman",
  },
  {
    code: "572",
    name: "Samudera Hindia Barat Sumatera",
    ocean: "Samudera Hindia",
    center: { x: 95, y: 250 },
    path: "M 25 105 L 105 160 L 155 235 L 205 315 L 155 355 L 20 220 Z",
    description: "Samudera Hindia sebelah barat Sumatera dan Selat Sunda",
  },
  {
    code: "573",
    name: "Samudera Hindia Selatan Jawa",
    ocean: "Samudera Hindia",
    center: { x: 380, y: 365 },
    path: "M 195 325 L 485 330 L 655 355 L 725 375 L 710 425 L 185 415 Z",
    description: "Samudera Hindia selatan Jawa hingga selatan Nusa Tenggara",
  },
  {
    code: "711",
    name: "Selat Karimata & Laut Natuna",
    ocean: "Laut Natuna Utara",
    center: { x: 265, y: 105 },
    path: "M 185 35 L 340 30 L 360 145 L 280 205 L 205 185 L 180 115 Z",
    description: "Selat Karimata, Laut Natuna, hingga Laut Natuna Utara",
  },
  {
    code: "712",
    name: "Laut Jawa",
    ocean: "Perairan Dangkal Jawa",
    center: { x: 350, y: 245 },
    path: "M 215 245 L 440 235 L 485 245 L 490 295 L 340 290 L 210 280 Z",
    description: "Perairan produktif Laut Jawa dari DKI Jakarta hingga Madura",
  },
  {
    code: "713",
    name: "Selat Makassar & Laut Flores",
    ocean: "Perairan Tengah",
    center: { x: 525, y: 220 },
    path: "M 445 130 L 575 125 L 590 265 L 655 305 L 505 320 L 445 235 Z",
    description: "Selat Makassar, Teluk Bone, Laut Flores, dan Laut Bali",
  },
  {
    code: "714",
    name: "Laut Banda",
    ocean: "Kepulauan Maluku Selatan",
    center: { x: 675, y: 275 },
    path: "M 595 245 L 755 240 L 785 305 L 715 345 L 595 305 Z",
    description: "Palung dalam Laut Banda dan perairan Teluk Tolo",
  },
  {
    code: "715",
    name: "Laut Maluku & Laut Halmahera",
    ocean: "Perairan Timur Laut",
    center: { x: 670, y: 140 },
    path: "M 575 85 L 740 75 L 765 195 L 665 210 L 575 165 Z",
    description: "Laut Maluku, Teluk Tomini, Laut Halmahera, dan Laut Seram",
  },
  {
    code: "716",
    name: "Laut Sulawesi",
    ocean: "Utara Sulawesi & Pasifik",
    center: { x: 525, y: 55 },
    path: "M 435 25 L 635 25 L 625 85 L 440 85 Z",
    description: "Perairan Laut Sulawesi dan perbatasan utara Pulau Halmahera",
  },
  {
    code: "717",
    name: "Teluk Cenderawasih & Samudera Pasifik",
    ocean: "Utara Papua",
    center: { x: 845, y: 115 },
    path: "M 745 55 L 975 65 L 975 185 L 835 195 L 755 175 Z",
    description: "Perairan Teluk Cenderawasih dan Samudera Pasifik utara Papua",
  },
  {
    code: "718",
    name: "Laut Aru, Laut Arafuru, & Timor",
    ocean: "Selatan Papua",
    center: { x: 840, y: 285 },
    path: "M 765 225 L 975 205 L 975 375 L 795 385 L 735 325 Z",
    description: "Perairan kaya udang & demersal: Laut Aru, Arafuru, dan Timor",
  },
];
