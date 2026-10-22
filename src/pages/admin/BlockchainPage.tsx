import { PageHeader } from "../../components/PageHeader";
import { DataTable, type Column } from "../../components/DataTable";
import { DetailModal } from "../../components/DetailModal";
import { StatusChip } from "../../components/StatusChip";
import { AlertBanner } from "../../components/ui";
import type { FishCatchTransaction } from "../../services/blockchain";
import { formatShortHash } from "../../utils";
import { Check, Link2, ShieldCheck } from "lucide-react";
import { useBlockchainViewer } from "./hooks/useBlockchainViewer";

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
        </div>
      ),
    },
    {
      key: "fish",
      header: "Spesies Ikan",
      flex: 3,
      render: (r) => (
        <span className="text-sm font-semibold text-strong">{r.fish_name}</span>
      ),
    },
    {
      key: "qty",
      header: "Bobot",
      flex: 2,
      align: "right",
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

      {/* 2. Visualisasi Rantai Blok (Block Sequence Chain) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xs bg-blue-500/10 text-fco-blue flex items-center justify-center shrink-0">
              <Link2 size={15} aria-hidden="true" />
            </div>
            <h2 className="m-0 text-base font-bold text-strong">
              Alur Rantai Blok
            </h2>
          </div>
          <span className="text-xs text-soft font-medium">
            {blocks.length} blok terhubung berurutan
          </span>
        </div>

        {/* Horizontal Scrollable Chain */}
        <div className="overflow-x-auto pb-2 pt-1">
          <div className="flex items-center gap-2.5 min-w-max">
            {blocks.length === 0 ? (
              <div className="p-6 text-sm text-soft border border-fco-border-subtle surface-card rounded-xs w-full text-center">
                Belum ada blok tersambung di jaringan blockchain.
              </div>
            ) : (
              blocks.map((block, idx) => {
                const isGenesis = block.index === 0;
                const isSelected = selectedBlock?.index === block.index;

                return (
                  <div key={block.index} className="flex items-center gap-2.5">
                    {/* Block Card */}
                    <div
                      onClick={() => openBlockDetail(block)}
                      className={`p-3.5 rounded-xs border surface-card shadow-2xs hover:border-fco-blue transition-all cursor-pointer w-72 flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? "border-fco-blue ring-1 ring-fco-blue"
                          : "border-fco-border-subtle"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-strong">
                            Blok #{block.index}
                          </span>
                          <span className="text-2xs text-soft">
                            {isGenesis ? "(Genesis)" : ""}
                          </span>
                        </div>
                        <StatusChip
                          label={isGenesis ? "Genesis" : "Valid"}
                          bg={isGenesis ? "#E8F0FE" : "#ECFDF5"}
                          color={isGenesis ? "#1A56DB" : "#059669"}
                        />
                      </div>

                      {/* Inset Hash Box */}
                      <div className="p-2.5 rounded-xs surface-inset border border-fco-border-subtle space-y-1.5 font-mono text-xs">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-2xs font-sans text-soft uppercase tracking-wider">
                            Hash
                          </span>
                          <span
                            className="text-fco-blue font-bold truncate max-w-44 text-right"
                            title={block.hash}
                          >
                            {formatShortHash(block.hash, 8, 6)}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-2xs font-sans text-soft uppercase tracking-wider">
                            Sebelumnya
                          </span>
                          <span
                            className="text-soft truncate max-w-44 text-right"
                            title={block.previous_hash || "0"}
                          >
                            {isGenesis
                              ? "0 (Awal)"
                              : formatShortHash(block.previous_hash, 8, 6)}
                          </span>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-2xs text-soft font-mono">
                        <span>
                          Nonce:{" "}
                          <strong className="text-strong font-bold">
                            {block.nonce}
                          </strong>
                        </span>
                        <span>
                          {new Date(block.timestamp).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            },
                          )}{" "}
                          WIB
                        </span>
                      </div>
                    </div>

                    {/* Cryptographic Linkage Connector */}
                    {idx < blocks.length - 1 && (
                      <div
                        className="flex items-center shrink-0 px-1 select-none"
                        title="Terkunci hash sebelumnya"
                      >
                        <div className="w-3.5 h-0.5 bg-fco-blue/40" />
                        <div className="w-6 h-6 rounded-xs bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-fco-blue flex items-center justify-center shrink-0 shadow-2xs">
                          <Link2 size={12} strokeWidth={2.4} />
                        </div>
                        <div className="w-3.5 h-0.5 bg-fco-blue/40" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
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
            value:
              selectedBlock?.data || "Tidak ada data tambahan di blok ini.",
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
