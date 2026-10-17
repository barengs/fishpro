import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Link2, ShieldAlert } from "lucide-react";
import { StatusChip } from "../../../components/StatusChip";
import {
  blockchainService,
  type BlockchainBlock,
  type BlockchainStatus,
} from "../../../services/blockchain";
import { formatNumber, formatShortHash } from "../../../utils";

export function BlockchainCard() {
  const [status, setStatus] = useState<BlockchainStatus | null>(null);
  const [lastBlock, setLastBlock] = useState<BlockchainBlock | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const [statusData, blocksData] = await Promise.all([
          blockchainService.getStatus().catch(() => null),
          blockchainService.getBlocks().catch(() => []),
        ]);
        if (statusData) setStatus(statusData);
        if (blocksData.length > 0) {
          setLastBlock(blocksData[blocksData.length - 1]);
        } else {
          setLastBlock(null);
        }
      } catch {
        // Ignored
      }
    }
    loadStatus();
  }, []);

  const blockCount = status ? status.block_count : 0;
  const txCount = status ? status.transaction_count : 0;

  const chain = [
    {
      label: "Total blok",
      value: formatNumber(blockCount),
    },
    {
      label: "Transaksi tercatat",
      value: formatNumber(txCount),
    },
    {
      label: "Blok terakhir",
      value: formatShortHash(lastBlock?.hash, 6, 4),
    },
    {
      label: "Status rantai",
      value: status
        ? blockCount === 0
          ? "Rantai Siap (0 blok)"
          : status.valid
            ? "Valid (Integritas OK)"
            : "Perlu Validasi"
        : "—",
    },
  ];

  return (
    <section className="surface-card border rounded-lg shadow-xs overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* SB Admin Card Header */}
        <div className="px-4.5 py-3 border-b border-fco-border-subtle surface-inset flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2
              size={16}
              className="text-fco-blue shrink-0"
              aria-hidden="true"
            />
            <h2 className="m-0 text-sm font-bold text-strong">
              Integritas Blockchain
            </h2>
          </div>
          <StatusChip
            label={
              status
                ? blockCount === 0
                  ? "Rantai Siap"
                  : status.valid
                    ? "Terverifikasi"
                    : "Peringatan"
                : "—"
            }
            bg={
              status?.valid === false && blockCount > 0 ? "#FFF1E0" : "#E8F0FE"
            }
            color={
              status?.valid === false && blockCount > 0 ? "#B54708" : "#1A56DB"
            }
            icon={
              status?.valid === false && blockCount > 0 ? (
                <ShieldAlert
                  size={14}
                  className="text-amber-600"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              ) : (
                <Check
                  size={14}
                  className="text-fco-blue"
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
              )
            }
          />
        </div>

        <div className="p-5 sm:p-6 flex flex-col">
          {chain.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between py-3 border-t first:border-t-0 border-fco-border-subtle text-xs sm:text-sm"
            >
              <span className="text-soft">{c.label}</span>
              <span className="font-semibold tabular-nums text-strong font-mono">
                {c.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 px-5 sm:px-6 border-t border-fco-border-subtle surface-inset">
        <Link
          to="/admin/blockchain"
          className="text-xs font-semibold text-fco-blue hover:underline no-underline block text-center"
        >
          Buka Penjelajah Blockchain →
        </Link>
      </div>
    </section>
  );
}
