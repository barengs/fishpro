import { useEffect, useState } from "react";
import { AlertTriangle, Coins, Link2, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import {
  QuotaAuditTable,
  type ShipQuotaItem,
} from "./components/QuotaAuditTable";
import { ManualQuotaModal } from "./components/ManualQuotaModal";
import { ComplianceOverview } from "./components/ComplianceOverview";
import { BlockchainCard } from "../admin/components/BlockchainCard";
import { shipsService } from "../../services/ships";
import { blockchainService } from "../../services/blockchain";
import { pnbpService } from "../../services/pnbp";

const fallbackShips: ShipQuotaItem[] = [
  {
    name: "KM Bahari Satu",
    reg: "REG-0087",
    owner: "PT Samudra Biru",
    allocatedQuota: "15.000 kg",
    usedQuota: "12.900 kg",
    percentRemaining: "14%",
    aiRecommendedQuota: "18.500 kg",
    status: "Mendekati Batas",
    statusBg: "#FFF1E0",
    statusColor: "#B54708",
  },
  {
    name: "KM Cahaya Timur",
    reg: "REG-0319",
    owner: "CV Bahari Jaya",
    allocatedQuota: "10.000 kg",
    usedQuota: "9.100 kg",
    percentRemaining: "9%",
    aiRecommendedQuota: "12.000 kg",
    status: "Kritis",
    statusBg: "#FFF1E0",
    statusColor: "#B54708",
  },
  {
    name: "KM Mutiara Laut",
    reg: "REG-0233",
    owner: "PT Mina Perkasa",
    allocatedQuota: "25.000 kg",
    usedQuota: "19.500 kg",
    percentRemaining: "22%",
    aiRecommendedQuota: "24.000 kg",
    status: "Waspada",
    statusBg: "#E8F0FE",
    statusColor: "#1A56DB",
  },
  {
    name: "KM Samudra Jaya",
    reg: "REG-0412",
    owner: "PT Laut Nusantara",
    allocatedQuota: "12.000 kg",
    usedQuota: "3.600 kg",
    percentRemaining: "70%",
    aiRecommendedQuota: "14.000 kg",
    status: "Normal",
    statusBg: "#E8F0FE",
    statusColor: "#1A56DB",
  },
];

export function RegulatorDashboard() {
  const [ships, setShips] = useState<ShipQuotaItem[]>(fallbackShips);
  const [selectedShip, setSelectedShip] = useState<ShipQuotaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dynamic KPI states
  const [totalMonitored, setTotalMonitored] = useState<number>(1284);
  const [criticalCount, setCriticalCount] = useState<number>(2);
  const [blockchainValid, setBlockchainValid] = useState<boolean>(true);
  const [pnbpStr, setPnbpStr] = useState<string>("Rp 4,4 M");

  useEffect(() => {
    let ignore = false;

    async function loadRegulatorData() {
      try {
        const [shipsData, chainStatus, chartRes] = await Promise.all([
          shipsService.getAll().catch(() => []),
          blockchainService.getStatus().catch(() => null),
          pnbpService.getUnifiedChartData().catch(() => null),
        ]);

        if (ignore) return;

        if (shipsData.length > 0) {
          setTotalMonitored(shipsData.length);

          const mapped: ShipQuotaItem[] = shipsData.map((s) => {
            const q = s.current_year_quota;
            const pct = q ? q.quota_percentage : 70;
            const totalQ = q ? Number(q.total_quota) : 12000;
            const usedQ = q ? Number(q.used_quota) : 3600;
            const isCritical = pct < 15;
            const isWarning = pct < 35;

            return {
              name: s.name,
              reg: s.registration_number,
              owner:
                s.owner_name ||
                (s.owner ? `Owner #${s.owner}` : "PT Laut Nusantara"),
              allocatedQuota: `${totalQ.toLocaleString("id-ID")} kg`,
              usedQuota: `${usedQ.toLocaleString("id-ID")} kg`,
              percentRemaining: `${pct}%`,
              aiRecommendedQuota: `${Math.round(totalQ * 1.15).toLocaleString("id-ID")} kg`,
              status: isCritical ? "Kritis" : isWarning ? "Waspada" : "Normal",
              statusBg: isCritical ? "#FFF1E0" : "#E8F0FE",
              statusColor: isCritical ? "#B54708" : "#1A56DB",
            };
          });

          setShips(mapped);

          const critCount = shipsData.filter(
            (s) => (s.current_year_quota?.quota_percentage ?? 70) < 15,
          ).length;
          setCriticalCount(critCount);
        }

        if (chainStatus && !ignore) {
          setBlockchainValid(chainStatus.valid);
        }

        const summary = chartRes?.charts_data?.summary_stats;
        if (summary?.total_pnbp_sum && !ignore) {
          const sum = summary.total_pnbp_sum;
          setPnbpStr(
            sum >= 1_000_000_000
              ? `Rp ${(sum / 1_000_000_000).toFixed(1)} M`
              : `Rp ${(sum / 1_000_000).toFixed(0)} jt`,
          );
        }
      } catch {
        // Ignored: keep fallback
      }
    }

    loadRegulatorData();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleOpenModal = (ship: ShipQuotaItem) => {
    setSelectedShip(ship);
    setIsModalOpen(true);
  };

  const handleSaveQuota = async (data: {
    shipReg: string;
    year: number;
    newQuota: number;
    reason: string;
  }) => {
    try {
      await shipsService.regulatorManualQuota({
        ship_registration_number: data.shipReg,
        year: data.year,
        quota_amount: data.newQuota,
      });

      setShips((prev) =>
        prev.map((s) =>
          s.reg === data.shipReg
            ? {
                ...s,
                allocatedQuota: `${data.newQuota.toLocaleString("id-ID")} kg`,
                status: "Disesuaikan",
                statusBg: "#E8F0FE",
                statusColor: "#1A56DB",
              }
            : s,
        ),
      );
      setToastMessage(
        `Kuota kapal ${data.shipReg} berhasil diupdate ke ${data.newQuota.toLocaleString("id-ID")} kg via API backend.`,
      );
      setTimeout(() => setToastMessage(null), 4000);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menyesuaikan kuota kapal via API.",
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight">
            Portal Pengawas & Regulator
          </h1>
          <div className="text-sm text-soft mt-1">
            Verifikasi kepatuhan kuota, audit pelaporan tangkapan, dan instrumen
            penyesuaian manual kuota KKP.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedShip(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 h-10 px-4 border-none rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            + Override Kuota Manual
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 px-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-5 border border-emerald-200 dark:border-emerald-500/20">
          ✓ {toastMessage}
        </div>
      )}

      {/* Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <KpiCard
          label="Total Kapal Diawasi"
          value={totalMonitored.toLocaleString("id-ID")}
          note="Aktif izin berlayar (SIPI/SIKPI)"
          color="blue"
          Icon={Ship}
        />
        <KpiCard
          label="Kapal Over-Quota / Kritis"
          value={`${criticalCount}`}
          delta={
            criticalCount > 0 ? "Perlu tindakan override" : "Semua kapal patuh"
          }
          trendUp={criticalCount === 0}
          color="rose"
          Icon={AlertTriangle}
        />
        <KpiCard
          label="Kepatuhan Blockchain"
          value={blockchainValid ? "100%" : "Perlu Cek"}
          note={
            blockchainValid
              ? "Seluruh tx tersinkronisasi hash"
              : "Integritas terganggu"
          }
          color="emerald"
          Icon={Link2}
        />
        <KpiCard
          label="Potensi PNBP Berjalan"
          value={pnbpStr}
          delta="Estimasi penerimaan resmi"
          color="purple"
          Icon={Coins}
        />
      </div>

      {/* Audit Table */}
      <div className="mb-5">
        <QuotaAuditTable ships={ships} onAdjustQuota={handleOpenModal} />
      </div>

      {/* Side by side: Compliance + Blockchain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ComplianceOverview
          totalShips={totalMonitored}
          criticalCount={criticalCount}
          blockchainValid={blockchainValid}
        />
        <BlockchainCard />
      </div>

      <ManualQuotaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuota}
        initialShipReg={selectedShip?.reg || ""}
      />
    </div>
  );
}
