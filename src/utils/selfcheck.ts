function assertEqual<T>(actual: T, expected: T, msg?: string) {
  if (actual !== expected) {
    throw new Error(
      `Assertion failed: expected ${expected}, got ${actual}${msg ? ` (${msg})` : ""}`,
    );
  }
}

import {
  calculateCatchTotalVolume,
  calculateAverageRemainingQuota,
  extractCatchReportMetrics,
} from "./calculations.ts";
import {
  formatRupiah,
  formatWeight,
  formatThousandInput,
  unformatThousandInput,
  escapeHtml,
} from "./formatters.ts";
import { loginSchema, catchStep1Schema } from "./schemas.ts";
import type { FishCatch } from "../services/catches/types.ts";
import type { Ship } from "../services/ships/types.ts";

// 1. Calculations test
assertEqual(calculateCatchTotalVolume([]), 0, "Empty catches return 0");

const dummyCatches: FishCatch[] = [
  {
    id: 1,
    ship: "REG-01",
    catch_date: "2026-10-20",
    catch_type: "pelagic",
    location_latitude: "-8.74",
    location_longitude: "115.20",
    catch_details: [
      { id: 1, fish_species: 1, quantity: 150, unit: "kg" },
      { id: 2, fish_species: 2, quantity: 1.5, unit: "ton" },
    ],
  },
];
assertEqual(
  calculateCatchTotalVolume(dummyCatches),
  1650,
  "150 kg + 1.5 ton = 1650 kg",
);

const dummyShips: Ship[] = [
  {
    id: 1,
    name: "KM 1",
    registration_number: "REG-1",
    active: true,
    current_year_quota: {
      year: 2026,
      total_quota: 20000,
      used_quota: 200,
      remaining_quota: 19800,
      quota_percentage: 99,
    },
  },
  {
    id: 2,
    name: "KM 2",
    registration_number: "REG-2",
    active: true,
    current_year_quota: null,
  },
  {
    id: 3,
    name: "KM 3",
    registration_number: "REG-3",
    active: true,
    current_year_quota: {
      year: 2026,
      total_quota: 10000,
      used_quota: 3000,
      remaining_quota: 7000,
      quota_percentage: 70,
    },
  },
];
assertEqual(
  calculateAverageRemainingQuota(dummyShips),
  85,
  "Average of 99% and 70% ignoring unassigned",
);

const metrics = extractCatchReportMetrics([
  { qty: "200 kg", pnbp: "Rp 150.000" },
  { qty: "1.2 ton", pnbp: "Rp 1.000.000" },
]);
assertEqual(metrics.totalWeightKg, 1400, "200 kg + 1.2 ton = 1400 kg");
assertEqual(metrics.totalPnbpSum, 1150000, "150k + 1000k = 1150k");

// 2. Formatters test
assertEqual(formatRupiah(0), "Rp 0");
assertEqual(formatRupiah(1500000, false), "Rp 1.500.000");
assertEqual(formatWeight(500), "500 kg");
assertEqual(formatWeight(2500), "2,5 ton");

assertEqual(formatThousandInput("1000"), "1.000");
assertEqual(formatThousandInput("1000000"), "1.000.000");
assertEqual(unformatThousandInput("1.000.000"), "1000000");
assertEqual(unformatThousandInput("35.50"), "35.50");

assertEqual(
  escapeHtml('<script>alert("xss")</script>'),
  "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
);

// 3. Schema validation test
const validLogin = loginSchema.safeParse({
  username: "admin",
  password: "password123",
});
assertEqual(validLogin.success, true, "Valid login passes");

const invalidLogin = loginSchema.safeParse({ username: "a", password: "" });
assertEqual(invalidLogin.success, false, "Invalid login fails");

const invalidLat = catchStep1Schema.safeParse({
  catch_date: "2026-10-26",
  catch_type: "pelagic",
  location_latitude: "95.0",
  location_longitude: "115.0",
});
assertEqual(invalidLat.success, false, "Latitude > 90 fails");

console.log("All 12 unit assertions passed.");
