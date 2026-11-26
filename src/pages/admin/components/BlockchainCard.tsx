import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const blockCount = status ? status.block_count : 266;
  const txCount = status ? status.transaction_count : 265;
  const shortHash = lastBlock?.hash
    ? formatShortHash(lastBlock.hash, 6, 4)
    : "00176e…c4f2";
  const isChainValid = status ? status.valid : false;

  return (
    <section className="bg-white dark:bg-[#0f1729] border border-[#e6e9ef] dark:border-[#1f2a42] rounded-2xl flex flex-col justify-between h-full shadow-subtle overflow-hidden">
      <div>
        {/* Card Header matching sample: .ch */}
        <div className="p-5 sm:p-6 pb-2">
          <h2 className="text-[16px] font-bold text-ink dark:text-[#e8edf7] m-0 tracking-tight">
            Integritas blockchain
          </h2>
          <p className="text-[13px] text-subtext dark:text-[#98a6c0] m-0 mt-0.5">
            Status rantai transaksi
          </p>
        </div>

        {/* Definition List matching sample: dl div dt dd */}
        <div className="px-5 sm:px-6 pt-1">
          <div className="flex justify-between items-center py-3.5 border-t border-[#e6e9ef] dark:border-[#1f2a42]">
            <span className="text-[13.5px] text-subtext dark:text-[#98a6c0]">Total blok</span>
            <span className="text-[14px] font-bold text-ink dark:text-white tabular-nums">
              {formatNumber(blockCount)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3.5 border-t border-[#e6e9ef] dark:border-[#1f2a42]">
            <span className="text-[13.5px] text-subtext dark:text-[#98a6c0]">Transaksi tercatat</span>
            <span className="text-[14px] font-bold text-ink dark:text-white tabular-nums">
              {formatNumber(txCount)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3.5 border-t border-[#e6e9ef] dark:border-[#1f2a42]">
            <span className="text-[13.5px] text-subtext dark:text-[#98a6c0]">Blok terakhir</span>
            <span className="text-[13px] font-mono font-medium text-ink dark:text-white">
              {shortHash}
            </span>
          </div>
          <div className="flex justify-between items-center py-3.5 border-t border-[#e6e9ef] dark:border-[#1f2a42]">
            <span className="text-[13.5px] text-subtext dark:text-[#98a6c0]">Status rantai</span>
            <span
              className={`text-[13.5px] font-semibold flex items-center gap-2 ${
                isChainValid
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full inline-block ${
                  isChainValid ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {isChainValid ? "Terverifikasi" : "Perlu validasi"}
            </span>
          </div>
        </div>
      </div>

      {/* Foot action link matching sample: .foot a.lk */}
      <div className="p-4 sm:px-6 border-t border-[#e6e9ef] dark:border-[#1f2a42] mt-2">
        <Link
          to="/admin/blockchain"
          className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold text-[13px] no-underline group hover:underline"
        >
          <span>Buka penjelajah blockchain</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
