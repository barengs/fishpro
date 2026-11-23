import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Link2, ShieldAlert, ShieldCheck } from "lucide-react";
import { StatusChip } from "../../../components/StatusChip";
import {
  blockchainService,
  type BlockchainBlock,
  type BlockchainStatus,
} from "../../../services/blockchain";
import { authService } from "../../../services/auth";
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
    <section className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-subtle overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* Modern Card Header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F9FAFB] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-charcoal dark:text-slate-300 flex items-center justify-center shrink-0">
              <Link2
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>
            <h2 className="m-0 text-[15px] font-bold text-ink dark:text-white">
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
                  className="text-brand-600"
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
              )
            }
          />
        </div>

        <div className="p-5 sm:p-6 flex flex-col divide-y divide-[#E5E7EB] dark:divide-slate-800">
          {chain.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <span className="text-xs text-subtext dark:text-slate-400 font-medium">{c.label}</span>
              <span className="text-xs sm:text-sm font-semibold tabular-nums text-ink dark:text-white">
                {c.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 px-5 sm:px-6 border-t border-[#E5E7EB] dark:border-slate-800 bg-[#F9FAFB] dark:bg-slate-800/40">
        {authService.isSuperAdmin() ? (
          <Link
            to="/admin/blockchain"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline block text-center"
          >
            Buka Penjelajah Blockchain →
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-subtext dark:text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>Integritas Terjaga · Dikelola Super Admin</span>
          </div>
        )}
      </div>
    </section>
  );
}
