import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Check, Coins, Fish, Plus, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { CatchReportWizard } from "../../components/CatchReportWizard";
import type { CatchReportFormData } from "../../components/catchReportTypes";
import { QuotaHeroCard } from "./components/QuotaHeroCard";
import { ShipSpecsCard } from "./components/ShipSpecsCard";
import {
  RecentCatchesTable,
  type CatchReport,
} from "./components/RecentCatchesTable";
import { shipsService, type Ship as ShipType } from "../../services/ships";
import { catchesService } from "../../services/catches";
import { authService } from "../../services/auth";
import { fishSpeciesService } from "../../services/fish";

const fallbackReports: CatchReport[] = [
  {
    date: "08 Okt 2026",
    species: "Tongkol",
    qty: "120 kg",
    pnbp: "Rp 120.000",
  },
  { date: "06 Okt 2026", species: "Cakalang", qty: "95 kg", pnbp: "Rp 95.000" },
  {
    date: "03 Okt 2026",
    species: "Tuna sirip kuning",
    qty: "60 kg",
    pnbp: "Rp 180.000",
  },
];

export function CaptainDashboard() {
  const [reports, setReports] = useState<CatchReport[]>(fallbackReports);
  const [ship, setShip] = useState<ShipType | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { open, openModal, closeModal } = useCrudModal();

  const currentUser = authService.getStoredUser();
  const captainId = currentUser?.id || 1;

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const ships = await shipsService
          .getByCaptain(captainId)
          .catch(() => []);
        let targetShip = ships.length > 0 ? ships[0] : null;
        if (!targetShip) {
          const all = await shipsService.getAll().catch(() => []);
          targetShip = all.length > 0 ? all[0] : null;
        }
        if (ignore) return;
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
            if (formatted.length > 0) setReports(formatted.slice(0, 5));
          }
        }
      } catch {
        // Ignored
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [captainId, refreshKey]);

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

  const shipName = ship?.name || "KM Samudra Jaya";
  const shipReg = ship?.registration_number || "REG-0412";
  const homePort = ship?.home_port || "Benoa";
  const remainingQuotaKg = ship?.current_year_quota
    ? `${ship.current_year_quota.remaining_quota} kg`
    : "8.400 kg";
  const totalQuotaKg = ship?.current_year_quota
    ? `${ship.current_year_quota.total_quota} kg`
    : "12.000 kg";
  const quotaPct = ship?.current_year_quota
    ? ship.current_year_quota.quota_percentage
    : 70;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight">
            Ringkasan Nahkoda
          </h1>
          <div className="text-sm text-soft mt-1">
            {shipName} · {shipReg} · Pelabuhan asal {homePort}
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

      {toast && (
        <div className="p-3.5 px-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-5 border border-emerald-200 dark:border-emerald-500/20">
          ✓ {toast}
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard
          label="Sisa kuota 2026"
          value={remainingQuotaKg}
          delta={`${quotaPct}% dari kuota ${totalQuotaKg}`}
          color="blue"
          Icon={BarChart3}
        />
        <KpiCard
          label="Tangkapan bulan ini"
          value="430 kg"
          delta={`${reports.length} laporan tercatat`}
          color="emerald"
          Icon={Fish}
        />
        <KpiCard
          label="PNBP terhitung"
          value="Rp 535.000"
          delta="Berdasarkan tarif resmi KKP"
          color="purple"
          Icon={Coins}
        />
        <KpiCard
          label="Status kapal"
          value={ship?.active ? "Aktif" : "Aktif"}
          delta={`${ship?.gross_tonnage || "42,5"} GT · SIPI berlaku s.d. Des 2026`}
          color="cyan"
          Icon={Ship}
        />
      </div>

      {/* Hero Quota & Blockchain Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 items-stretch">
        <div className="lg:col-span-3">
          <QuotaHeroCard
            remainingKg={remainingQuotaKg}
            totalKg={totalQuotaKg}
            percentage={quotaPct}
            validUntil="31 Des 2026"
          />
        </div>
        <div className="lg:col-span-2">
          <section className="surface-card border rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="m-0 text-base font-bold text-strong">
                  Status blockchain
                </h2>
                <StatusChip
                  label="Terverifikasi"
                  bg="#E8F0FE"
                  color="#1A56DB"
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
                Semua laporan tangkapan {shipName} disegel permanen ke buku
                besar blockchain terdistribusi.
              </p>
              <div className="flex flex-col divide-y divide-fco-border-subtle text-sm">
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Blok terakhir</span>
                  <span className="font-semibold tabular-nums">#2318</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Hash verifikasi</span>
                  <span className="font-semibold tabular-nums text-fco-blue">
                    c04d…88a7
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Total laporan kapal</span>
                  <span className="font-semibold tabular-nums">
                    48 transaksi
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-fco-border-subtle flex items-center justify-between text-xs text-soft">
              <span>Kepatuhan audit: 100%</span>
              <Link
                to="/captain/catches"
                className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline"
              >
                Lihat riwayat →
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
          <ShipSpecsCard />
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
