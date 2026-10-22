import { useEffect, useState } from "react";
import { useCrudModal } from "../../../components/useCrudModal";
import type { CatchReportFormData } from "../../../components/catchReportTypes";
import type { CatchReport } from "../components/RecentCatchesTable";
import { shipsService, type Ship as ShipType } from "../../../services/ships";
import { catchesService } from "../../../services/catches";
import {
  blockchainService,
  type BlockchainBlock,
  type BlockchainStatus,
} from "../../../services/blockchain";
import { authService, getUserDisplayInfo } from "../../../services/auth";
import { fishSpeciesService } from "../../../services/fish";
import { extractCatchReportMetrics } from "../../../utils";

export function useCaptainDashboard() {
  const [reports, setReports] = useState<CatchReport[]>([]);
  const [ship, setShip] = useState<ShipType | null>(null);
  const [blockchainStatus, setBlockchainStatus] =
    useState<BlockchainStatus | null>(null);
  const [lastBlock, setLastBlock] = useState<BlockchainBlock | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { open: isModalOpen, openModal, closeModal } = useCrudModal();

  const currentUser = authService.getStoredUser();
  const userInfo = getUserDisplayInfo();

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [targetShip, chainStatus, blocks] = await Promise.all([
          shipsService.getShipForCaptain(currentUser).catch(() => null),
          blockchainService.getStatus().catch(() => null),
          blockchainService.getBlocks().catch(() => []),
        ]);

        if (ignore) return;

        if (chainStatus) setBlockchainStatus(chainStatus);
        if (blocks.length > 0) setLastBlock(blocks[blocks.length - 1]);

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
  }, [currentUser, refreshKey]);

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

  return {
    reports,
    ship,
    hasShip,
    quota,
    blockchainStatus,
    lastBlock,
    toast,
    setToast,
    userInfo,
    dynamicSpecs,
    totalWeightKg,
    totalPnbpSum,
    isModalOpen,
    openModal,
    closeModal,
    handleReportAdded,
  };
}
