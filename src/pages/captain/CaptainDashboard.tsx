import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Check, Coins, Fish, Plus, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { CatchReportWizard } from "../../components/CatchReportWizard";
import { AlertBanner } from "../../components/ui";
import type { CatchReportFormData } from "../../components/catchReportTypes";
import { QuotaHeroCard } from "./components/QuotaHeroCard";
import { ShipSpecsCard } from "./components/ShipSpecsCard";
import {
  RecentCatchesTable,
  type CatchReport,
} from "./components/RecentCatchesTable";
import { shipsService, type Ship as ShipType } from "../../services/ships";
import { catchesService } from "../../services/catches";
import {
  blockchainService,
  type BlockchainBlock,
  type BlockchainStatus,
} from "../../services/blockchain";
import { authService, getUserDisplayInfo } from "../../services/auth";
import { fishSpeciesService } from "../../services/fish";
import {
  extractCatchReportMetrics,
  formatRupiah,
  formatShortHash,
  formatWeight,
} from "../../utils";

export function CaptainDashboard() {
  const [reports, setReports] = useState<CatchReport[]>([]);
  const [ship, setShip] = useState<ShipType | null>(null);
  const [blockchainStatus, setBlockchainStatus] =
    useState<BlockchainStatus | null>(null);
  const [lastBlock, setLastBlock] = useState<BlockchainBlock | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { open, openModal, closeModal } = useCrudModal();

  const currentUser = authService.getStoredUser();
  const captainId = currentUser?.id || 1;
  const userInfo = getUserDisplayInfo();

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [ships, chainStatus, blocks] = await Promise.all([
          shipsService.getByCaptain(captainId).catch(() => []),
          blockchainService.getStatus().catch(() => null),
          blockchainService.getBlocks().catch(() => []),
        ]);

        if (ignore) return;

        if (chainStatus) setBlockchainStatus(chainStatus);
        if (blocks.length > 0) setLastBlock(blocks[blocks.length - 1]);

        let targetShip = ships.length > 0 ? ships[0] : null;
        if (!targetShip) {
          const all = await shipsService.getAll().catch(() => []);
          const matched = all.find(
            (s) =>
              (s.captain && s.captain === captainId) ||
              (s.captain_name &&
                s.captain_name.toLowerCase() ===
                  currentUser?.username.toLowerCase()),
          );
          targetShip = matched || (all.length > 0 ? all[0] : null);
        }

        setShip(targetShip);

        if (targetShip) {
          const catchesData = await catchesService
            .getAll({ ship_id: targetShip.id })
            .catch(() => []);
          if (ignore) return;

          if (catchesData.length > 0) {
            const formatted: CatchReport[] = [];
            for (const c of catchesData) {
              for (const d of c.catch_details || []) {
                formatted.push({
                  date: c.catch_date,
                  species: d.fish_species_name || `Spesies #${d.fish_species}`,
                  qty: `${d.quantity} ${d.unit}`,
                  pnbp: d.pnbp
                    ? `Rp ${Number(d.pnbp).toLocaleString("id-ID")}`
                    : "—",
                });
              }
            }
            setReports(formatted.slice(0, 5));
          } else {
            setReports([]);
          }
        } else {
          setReports([]);
        }
      } catch {
        // Ignored
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [captainId, currentUser?.username, refreshKey]);

  const handleReportAdded = async (data: CatchReportFormData) => {
    const shipReg = ship ? ship.registration_number : "REG-0412";

    try {
      const speciesList = await fishSpeciesService.getAll().catch(() => []);
      let speciesId = Number(data.fish_species);
      if (isNaN(speciesId) || speciesId === 0) {
        const found = speciesList.find(
          (s) => s.name.toLowerCase() === data.fish_species.toLowerCase(),
        );
        speciesId = found
          ? found.id
          : speciesList.length > 0
            ? speciesList[0].id
            : 1;
      }

      await catchesService.createWithDetails({
        ship: shipReg,
        catch_date: data.catch_date,
        catch_type: data.catch_type,
        location_latitude: data.location_latitude,
        location_longitude: data.location_longitude,
        description: data.description || "",
        catch_details: [
          {
            fish_species: speciesId,
            quantity: parseFloat(data.quantity) || 0,
            unit: data.unit || "kg",
            value: data.value ? parseFloat(data.value) : null,
            notes: data.description || "",
          },
        ],
      });

      setToast(`Laporan tangkapan berhasil dikirim dan disegel ke blockchain!`);
      setTimeout(() => setToast(null), 4000);
      closeModal();
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Gagal mengirim laporan tangkapan",
      );
    }
  };

  // Calculate actual metrics using pure calculation utilities
  const { totalWeightKg, totalPnbpSum } = extractCatchReportMetrics(reports);

  const hasShip = Boolean(ship);
  const quota = ship?.current_year_quota;

  const dynamicSpecs = ship
    ? [
        {
          label: "Gross tonnage",
          value: ship.gross_tonnage ? `${ship.gross_tonnage} GT` : "—",
        },
        { label: "Panjang", value: ship.length ? `${ship.length} m` : "—" },
        { label: "Lebar", value: ship.width ? `${ship.width} m` : "—" },
        {
          label: "Tahun dibuat",
          value: ship.year_built ? String(ship.year_built) : "—",
        },
      ]
    : undefined;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight">
            Ringkasan Nahkoda
          </h1>
          <div className="text-sm text-soft mt-1">
            {hasShip
              ? `${ship!.name} · ${ship!.registration_number} · Pelabuhan asal ${ship!.home_port || "—"}`
              : `Akun nahkoda: ${userInfo.name} · Belum ada kapal terhubung`}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 h-10 px-4.5 rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
            Lapor tangkapan
          </button>
        </div>
      </div>

      <AlertBanner
        variant="success"
        message={toast || ""}
        onDismiss={() => setToast(null)}
      />

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard
          label="Sisa kuota 2026"
          value={
            quota
              ? `${Number(quota.remaining_quota).toLocaleString("id-ID")} kg`
              : hasShip
                ? "—"
                : "0 kg"
          }
          delta={
            quota
              ? `${quota.quota_percentage}% dari kuota ${Number(quota.total_quota).toLocaleString("id-ID")} kg`
              : hasShip
                ? "Menunggu alokasi kuota"
                : "Belum ada kapal terhubung"
          }
          color="blue"
          Icon={BarChart3}
        />
        <KpiCard
          label="Tangkapan terlapor"
          value={formatWeight(totalWeightKg)}
          delta={
            reports.length > 0
              ? `${reports.length} laporan masuk ke sistem`
              : "Belum ada laporan tangkapan"
          }
          color="emerald"
          Icon={Fish}
        />
        <KpiCard
          label="PNBP terhitung"
          value={formatRupiah(totalPnbpSum, false)}
          delta="Berdasarkan tarif resmi KKP"
          color="purple"
          Icon={Coins}
        />
        <KpiCard
          label="Status kapal"
          value={
            hasShip
              ? ship!.active !== false
                ? "Aktif"
                : "Nonaktif"
              : "Belum Terhubung"
          }
          delta={
            hasShip
              ? `${ship!.gross_tonnage || 0} GT · SIPI berlaku`
              : "Hubungi pemilik untuk penugasan"
          }
          color="cyan"
          Icon={Ship}
        />
      </div>

      {/* Hero Quota & Blockchain Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 items-stretch">
        <div className="lg:col-span-3">
          <QuotaHeroCard
            remainingKg={
              quota
                ? `${Number(quota.remaining_quota).toLocaleString("id-ID")} kg`
                : "0 kg"
            }
            totalKg={
              quota
                ? `${Number(quota.total_quota).toLocaleString("id-ID")} kg`
                : "0 kg"
            }
            percentage={quota ? quota.quota_percentage : 0}
            validUntil={quota ? "31 Des 2026" : "—"}
          />
        </div>
        <div className="lg:col-span-2">
          <section className="surface-card border rounded-xl p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="m-0 text-base font-bold text-strong">
                  Status blockchain
                </h2>
                <StatusChip
                  label={
                    blockchainStatus?.valid === false
                      ? "Peringatan"
                      : "Terverifikasi"
                  }
                  bg={blockchainStatus?.valid === false ? "#FFF1E0" : "#E8F0FE"}
                  color={
                    blockchainStatus?.valid === false ? "#B54708" : "#1A56DB"
                  }
                  icon={
                    <Check
                      size={14}
                      className="text-fco-blue"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                  }
                />
              </div>
              <p className="m-0 text-xs text-soft mb-4 leading-relaxed">
                {hasShip
                  ? `Semua laporan tangkapan ${ship!.name} disegel permanen ke buku besar blockchain terdistribusi.`
                  : "Semua laporan tangkapan kapal disegel permanen ke buku besar blockchain terdistribusi."}
              </p>
              <div className="flex flex-col divide-y divide-fco-border-subtle text-sm">
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Blok terakhir</span>
                  <span className="font-semibold tabular-nums">
                    {lastBlock ? `#${lastBlock.index}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Hash verifikasi</span>
                  <span className="font-semibold tabular-nums text-fco-blue">
                    {formatShortHash(lastBlock?.hash, 4, 4)}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Total laporan kapal</span>
                  <span className="font-semibold tabular-nums">
                    {reports.length} transaksi
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-fco-border-subtle flex items-center justify-between text-xs text-soft">
              <span>
                Integritas ledger: {blockchainStatus?.valid ? "100%" : "—"}
              </span>
              <Link
                to="/captain/catches"
                className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline"
              >
                Lihat riwayat
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Recent Catches Table & Ship Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <RecentCatchesTable reports={reports} />
        </div>
        <div className="lg:col-span-2">
          <ShipSpecsCard specs={dynamicSpecs} />
        </div>
      </div>

      {/* Modal Lapor Tangkapan (Wizard) */}
      <CrudModal
        open={open}
        title="Lapor tangkapan baru"
        subtitle="3 langkah: waktu & lokasi, hasil, cek."
        onClose={closeModal}
        hideFooter
      >
        <CatchReportWizard onSubmit={handleReportAdded} onCancel={closeModal} />
      </CrudModal>
    </div>
  );
}
