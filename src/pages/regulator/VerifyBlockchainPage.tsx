import { useEffect, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { DataTable, type Column } from "../../components/DataTable";
import { StatusChip } from "../../components/StatusChip";
import {
  blockchainService,
  type FishCatchTransaction,
} from "../../services/blockchain";
import { formatRupiah } from "../../utils";
import { Check, ShieldCheck } from "lucide-react";

export function VerifyBlockchainPage() {
  const [rows, setRows] = useState<FishCatchTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusValid, setStatusValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [txData, statusData] = await Promise.all([
          blockchainService.getTransactions().catch(() => []),
          blockchainService.getStatus().catch(() => null),
        ]);
        setRows(txData);
        if (statusData) setStatusValid(statusData.valid);
      } catch (err: unknown) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Gagal memuat transaksi blockchain",
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cols: Column<FishCatchTransaction>[] = [
    {
      key: "ship",
      header: "Kapal / Blok",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold tabular-nums">
            {r.ship_registration_number}
          </div>
          <div className="text-xs text-soft">
            Blok #{r.block_id || (r.block_data ? r.block_data.index : "—")} ·{" "}
            {r.catch_date}
          </div>
        </div>
      ),
    },
    {
      key: "area",
      header: "WPP",
      flex: 1,
      render: (r) => (
        <span className="text-sm font-mono">{r.fishing_area_code || "—"}</span>
      ),
    },
    {
      key: "fish",
      header: "Spesies / Kode",
      flex: 2,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.fish_name}</div>
          <div className="text-xs text-soft font-mono">
            {r.fish_species_code || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "qty",
      header: "Jumlah",
      flex: 2,
      align: "right",
      hideOnMobile: true,
      render: (r) => (
        <span className="text-sm tabular-nums font-semibold">
          {r.quantity} {r.unit}
        </span>
      ),
    },
    {
      key: "pnbp",
      header: "PNBP Terhitung",
      flex: 2,
      align: "right",
      hideOnMobile: true,
      render: (r) => (
        <span className="text-sm tabular-nums font-mono text-fco-blue">
          {r.pnbp ? formatRupiah(r.pnbp, false) : "—"}
        </span>
      ),
    },
    {
      key: "st",
      header: "Status Hash",
      flex: 1,
      align: "center",
      render: () => (
        <StatusChip
          label="Valid"
          icon={
            <Check
              size={12}
              className="text-fco-blue"
              strokeWidth={2.6}
              aria-hidden="true"
            />
          }
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit & Verifikasi Transaksi Blockchain"
        desc="Verifikasi audit integritas transaksi penangkapan ikan yang disegel ke buku besar kriptografis KKP."
        actions={
          statusValid !== null ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ShieldCheck size={15} aria-hidden="true" />
              <span>Integritas Rantai: Valid</span>
            </div>
          ) : null
        }
      />

      {errorMsg && (
        <div className="p-3.5 px-4.5 rounded-xs bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          ⚠ {errorMsg}
        </div>
      )}

      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada transaksi penangkapan ikan tercatat di ledger blockchain."
      />
    </div>
  );
}
