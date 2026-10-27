import { PageHeader } from "../../components/PageHeader";
import { DataTable, type Column } from "../../components/DataTable";
import { DetailModal } from "../../components/DetailModal";
import { StatusChip } from "../../components/StatusChip";
import { AlertBanner } from "../../components/ui";
import { BlockchainGraphCanvas } from "./components/BlockchainGraphCanvas";
import type { FishCatchTransaction } from "../../services/blockchain";
import { formatShortHash } from "../../utils";
import { Check, ShieldCheck } from "lucide-react";
import { useBlockchainViewer } from "./hooks/useBlockchainViewer";

function formatJsonPayload(data: unknown): React.ReactNode {
  if (!data) {
    return (
      <span className="text-soft italic text-xs">
        Tidak ada data tambahan di blok ini.
      </span>
    );
  }

  let formatted: string;
  let isJson = false;

  try {
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    if (typeof parsed === "object" && parsed !== null) {
      formatted = JSON.stringify(parsed, null, 2);
      isJson = true;
    } else {
      formatted = String(data);
    }
  } catch {
    formatted = String(data);
  }

  if (!isJson) {
    return (
      <span className="font-mono text-xs font-semibold text-strong">
        {formatted}
      </span>
    );
  }

  return (
    <div className="mt-1 p-3.5 rounded-xs bg-[#090d16] border border-white/10 text-cyan-300 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed select-all shadow-inner">
      <pre className="m-0 font-mono text-xs whitespace-pre">
        <code>{formatted}</code>
      </pre>
    </div>
  );
}

export function BlockchainPage() {
  const {
    blocks,
    transactions,
    loading,
    statusValid,
    errorMsg,
    selectedBlock,
    isBlockDetailOpen,
    openBlockDetail,
    closeBlockDetail,
    selectedTx,
    isTxDetailOpen,
    openTxDetail,
    closeTxDetail,
  } = useBlockchainViewer();

  const txCols: Column<FishCatchTransaction>[] = [
    {
      key: "ship",
      header: "Kapal / Registrasi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold tabular-nums text-strong">
            {r.ship_registration_number}
          </div>
          <div className="text-xs text-soft">
            {r.fishing_area_code && r.fishing_area_code !== "N/A"
              ? `WPP ${r.fishing_area_code.replace(/^WPP\s*/i, "")}`
              : "WPP Belum Tercatat"}
          </div>
          <div className="sm:hidden text-2xs text-soft mt-0.5 font-medium">
            {r.fish_name} · {r.quantity} {r.unit}
          </div>
        </div>
      ),
    },
    {
      key: "fish",
      header: "Spesies Ikan",
      flex: 3,
      hideOnMobile: true,
      render: (r) => (
        <span className="text-sm font-semibold text-strong">{r.fish_name}</span>
      ),
    },
    {
      key: "qty",
      header: "Bobot",
      flex: 2,
      align: "right",
      hideOnMobile: true,
      render: (r) => (
        <span className="text-sm font-bold tabular-nums text-strong">
          {r.quantity} {r.unit}
        </span>
      ),
    },
    {
      key: "block",
      header: "Blok",
      flex: 2,
      align: "center",
      hideOnMobile: true,
      render: (r) => {
        const blkId = r.block_id ?? r.block_data?.index;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const found = blocks.find((b) => b.index === blkId);
              if (found) openBlockDetail(found);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-blue-500/10 text-fco-blue hover:bg-blue-500/20 text-xs font-bold font-mono transition-colors cursor-pointer border-none"
            title="Buka detail blok"
          >
            <span>Blok #{blkId ?? "—"}</span>
          </button>
        );
      },
    },
    {
      key: "hash",
      header: "Hash Transaksi",
      flex: 3,
      hideOnMobile: true,
      render: (r) => {
        const hash = r.block_data?.hash;
        return (
          <span
            className="text-xs font-mono text-fco-blue truncate block max-w-56"
            title={hash || "Tidak ada hash"}
          >
            {formatShortHash(hash, 8, 6)}
          </span>
        );
      },
    },
    {
      key: "st",
      header: "Status",
      flex: 2,
      align: "center",
      render: () => (
        <StatusChip
          label="Terverifikasi"
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
    <div className="flex flex-col gap-6">
      {/* 1. Header */}
      <PageHeader
        title="Buku Besar Blockchain"
        desc="Pencatatan riwayat penangkapan ikan terdesentralisasi dengan enkripsi SHA-256 yang aman dan transparan."
        actions={
          statusValid !== null ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ShieldCheck size={15} aria-hidden="true" />
              <span>Rantai Blok Valid</span>
            </div>
          ) : null
        }
      />

      {errorMsg && (
        <AlertBanner variant="error" message={errorMsg} onDismiss={() => {}} />
      )}

      {/* 2. Visualisasi Graf Interaktif Rantai Blok */}
      <section className="flex flex-col gap-2.5">
        <BlockchainGraphCanvas
          blocks={blocks}
          selectedBlock={selectedBlock}
          onSelectBlock={openBlockDetail}
        />
      </section>

      {/* 3. Full-Width Table: Transaksi Tangkapan */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-base font-bold text-strong">
            Daftar Transaksi Tangkapan ({transactions.length})
          </h2>
          <span className="text-xs text-soft font-medium">
            Tersimpan dalam rantai blok
          </span>
        </div>

        <DataTable
          columns={txCols}
          rows={transactions}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada transaksi tangkapan di jaringan blockchain."
          onRowClick={openTxDetail}
        />
      </section>

      {/* 4. Modal Detail Blok */}
      <DetailModal
        open={isBlockDetailOpen}
        title={
          selectedBlock
            ? `Detail Blok #${selectedBlock.index}`
            : "Detail Blok Blockchain"
        }
        subtitle="Informasi hash SHA-256, nonce, dan verifikasi tautan blok."
        badge={
          <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-xs bg-blue-500/10 text-fco-blue">
            Index: #{selectedBlock?.index}
          </span>
        }
        onClose={closeBlockDetail}
        fields={[
          {
            label: "Hash Blok",
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
                {selectedBlock?.previous_hash || "0 (Genesis Block)"}
              </span>
            ),
            fullWidth: true,
          },
          {
            label: "Nonce",
            value: selectedBlock?.nonce ?? "—",
          },
          {
            label: "Waktu Pencatatan",
            value: selectedBlock?.timestamp
              ? new Date(selectedBlock.timestamp).toLocaleString("id-ID")
              : "—",
          },
          {
            label: "Payload Data",
            value: formatJsonPayload(selectedBlock?.data),
            fullWidth: true,
          },
        ]}
      />

      {/* 5. Modal Detail Transaksi */}
      <DetailModal
        open={isTxDetailOpen}
        title={
          selectedTx
            ? `Transaksi: ${selectedTx.ship_registration_number}`
            : "Detail Transaksi Blockchain"
        }
        subtitle="Laporan tangkapan ikan yang tervalidasi dan tersimpan di dalam buku besar."
        badge={<StatusChip label="Terverifikasi" />}
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
            label: "Wilayah (WPP)",
            value:
              selectedTx?.fishing_area_code &&
              selectedTx.fishing_area_code !== "N/A"
                ? `WPP ${selectedTx.fishing_area_code.replace(/^WPP\s*/i, "")}`
                : "—",
          },
          {
            label: "Spesies Ikan",
            value: selectedTx?.fish_name,
          },
          {
            label: "Bobot Tangkapan",
            value: selectedTx
              ? `${selectedTx.quantity} ${selectedTx.unit}`
              : "—",
          },
          {
            label: "Blok Terkait",
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
