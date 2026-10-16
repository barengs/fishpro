import { useEffect, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { DataTable, type Column } from "../../components/DataTable";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import { StatusChip } from "../../components/StatusChip";
import {
  blockchainService,
  type BlockchainBlock,
  type FishCatchTransaction,
} from "../../services/blockchain";
import { formatShortHash } from "../../utils";
import { Check, ShieldCheck } from "lucide-react";

export function BlockchainPage() {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [transactions, setTransactions] = useState<FishCatchTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusValid, setStatusValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    selected: selectedBlock,
    open: isBlockDetailOpen,
    openDetail: openBlockDetail,
    closeDetail: closeBlockDetail,
  } = useDetailModal<BlockchainBlock>();
  const {
    selected: selectedTx,
    open: isTxDetailOpen,
    openDetail: openTxDetail,
    closeDetail: closeTxDetail,
  } = useDetailModal<FishCatchTransaction>();

  useEffect(() => {
    async function loadBlockchainData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [blocksData, txData, statusData] = await Promise.all([
          blockchainService.getBlocks().catch(() => []),
          blockchainService.getTransactions().catch(() => []),
          blockchainService.getStatus().catch(() => null),
        ]);
        setBlocks(blocksData);
        setTransactions(txData);
        if (statusData) setStatusValid(statusData.valid);
      } catch (err: unknown) {
        setErrorMsg(
          err instanceof Error ? err.message : "Gagal memuat data blockchain",
        );
      } finally {
        setLoading(false);
      }
    }
    loadBlockchainData();
  }, []);

  const blockCols: Column<BlockchainBlock>[] = [
    {
      key: "ix",
      header: "Blok",
      flex: 1,
      render: (r) => (
        <span className="text-sm font-bold tabular-nums">#{r.index}</span>
      ),
    },
    {
      key: "hash",
      header: "Hash Blok",
      flex: 3,
      render: (r) => (
        <span
          className="text-xs font-mono text-fco-blue truncate block max-w-44"
          title={r.hash}
        >
          {formatShortHash(r.hash, 8, 6)}
        </span>
      ),
    },
    {
      key: "prev",
      header: "Previous Hash",
      flex: 3,
      render: (r) => (
        <span
          className="text-xs font-mono text-soft truncate block max-w-44"
          title={r.previous_hash}
        >
          {r.previous_hash ? formatShortHash(r.previous_hash, 8, 6) : "Genesis"}
        </span>
      ),
    },
    {
      key: "nonce",
      header: "Nonce",
      flex: 1,
      align: "center",
      render: (r) => (
        <span className="text-xs tabular-nums text-soft">{r.nonce}</span>
      ),
    },
    {
      key: "time",
      header: "Timestamp",
      flex: 2,
      align: "right",
      render: (r) => (
        <span className="text-xs text-soft tabular-nums">
          {new Date(r.timestamp).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  const txCols: Column<FishCatchTransaction>[] = [
    {
      key: "ship",
      header: "Kapal / WPP",
      flex: 2,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold tabular-nums">
            {r.ship_registration_number}
          </div>
          <div className="text-xs text-soft">
            {r.fishing_area_code || "WPP —"}
          </div>
        </div>
      ),
    },
    {
      key: "fish",
      header: "Spesies / Jumlah",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.fish_name}</div>
          <div className="text-xs text-soft tabular-nums">
            {r.quantity} {r.unit}
          </div>
        </div>
      ),
    },
    {
      key: "block",
      header: "Blok ID",
      flex: 1,
      align: "center",
      render: (r) => (
        <span className="text-xs font-bold text-fco-blue tabular-nums">
          #{r.block_id || (r.block_data ? r.block_data.index : "—")}
        </span>
      ),
    },
    {
      key: "st",
      header: "Integritas",
      flex: 1,
      align: "center",
      render: () => (
        <StatusChip
          label="Tercatat"
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
        title="Buku Besar Blockchain (Ledger)"
        desc="Buku besar kriptografis terdistribusi SHA-256 untuk menjamin laporan tangkapan tidak dapat dimanipulasi."
        actions={
          statusValid !== null ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ShieldCheck size={15} aria-hidden="true" />
              <span>Rantai Blok Valid</span>
            </div>
          ) : null
        }
      />

      {errorMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          ⚠ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <section className="surface-card border rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="m-0 text-base font-bold text-strong">
              Blok Blockchain ({blocks.length})
            </h2>
            <span className="text-xs text-soft">Ordered by index</span>
          </div>
          <DataTable
            columns={blockCols}
            rows={blocks}
            rowKey={(r) => String(r.index)}
            loading={loading}
            emptyText="Belum ada blok tercatat di jaringan blockchain."
            onRowClick={openBlockDetail}
          />
        </section>

        <section className="surface-card border rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="m-0 text-base font-bold text-strong">
              Transaksi Tangkapan ({transactions.length})
            </h2>
            <span className="text-xs text-soft">Immutable SHA-256</span>
          </div>
          <DataTable
            columns={txCols}
            rows={transactions}
            rowKey={(r) => String(r.id)}
            loading={loading}
            emptyText="Belum ada transaksi tangkapan tersegel di blockchain."
            onRowClick={openTxDetail}
          />
        </section>
      </div>

      <DetailModal
        open={isBlockDetailOpen}
        title={
          selectedBlock
            ? `Blok Blockchain #${selectedBlock.index}`
            : "Detail Blok Blockchain"
        }
        subtitle="Hash SHA-256, nonce, dan tautan rantai blok yang tidak dapat dimanipulasi."
        badge={
          <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-fco-blue">
            Index: #{selectedBlock?.index}
          </span>
        }
        onClose={closeBlockDetail}
        fields={[
          {
            label: "Hash Blok (SHA-256)",
            value: (
              <span className="font-mono font-bold text-fco-blue break-all">
                {selectedBlock?.hash}
              </span>
            ),
            fullWidth: true,
          },
          {
            label: "Hash Blok Sebelumnya",
            value: (
              <span className="font-mono font-medium text-strong break-all">
                {selectedBlock?.previous_hash || "Genesis Block"}
              </span>
            ),
            fullWidth: true,
          },
          {
            label: "Nonce Penambangan",
            value: selectedBlock?.nonce ?? "—",
          },
          {
            label: "Waktu Penambangan",
            value: selectedBlock?.timestamp
              ? new Date(selectedBlock.timestamp).toLocaleString("id-ID")
              : "—",
          },
          {
            label: "Data Blok",
            value:
              selectedBlock?.data || "Tidak ada payload tambahan di blok ini.",
            fullWidth: true,
          },
        ]}
      />

      <DetailModal
        open={isTxDetailOpen}
        title={
          selectedTx
            ? `Transaksi: ${selectedTx.ship_registration_number}`
            : "Detail Transaksi Blockchain"
        }
        subtitle="Laporan tangkapan ikan yang tersegel permanen dalam rantai blok."
        badge={<StatusChip label="Tersegel SHA-256" />}
        onClose={closeTxDetail}
        fields={[
          {
            label: "Kapal (Nomor Registrasi)",
            value: (
              <span className="font-mono font-bold text-strong">
                {selectedTx?.ship_registration_number}
              </span>
            ),
          },
          {
            label: "Kode Area (WPP)",
            value: selectedTx?.fishing_area_code || "—",
          },
          {
            label: "Nama Ikan (Spesies)",
            value: selectedTx?.fish_name,
          },
          {
            label: "Jumlah Tangkapan",
            value: selectedTx
              ? `${selectedTx.quantity} ${selectedTx.unit}`
              : "—",
          },
          {
            label: "ID Blok",
            value: (
              <span className="font-mono font-bold text-fco-blue">
                #{selectedTx?.block_id || selectedTx?.block_data?.index || "—"}
              </span>
            ),
          },
          {
            label: "Hash Transaksi",
            value: (
              <span className="font-mono text-xs font-medium text-strong break-all">
                {selectedTx?.block_data?.hash || "—"}
              </span>
            ),
            fullWidth: true,
          },
        ]}
      />
    </div>
  );
}
