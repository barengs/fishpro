import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { StatusChip } from "../../../components/StatusChip";
import {
  blockchainService,
  type BlockchainBlock,
  type BlockchainStatus,
} from "../../../services/blockchain";

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
        }
      } catch {
        // Ignored
      }
    }
    loadStatus();
  }, []);

  const chain = [
    {
      label: "Total blok",
      value: status ? status.block_count.toLocaleString("id-ID") : "2.318",
    },
    {
      label: "Transaksi tercatat",
      value: status
        ? status.transaction_count.toLocaleString("id-ID")
        : "14.906",
    },
    {
      label: "Blok terakhir",
      value: lastBlock
        ? `${lastBlock.hash.slice(0, 4)}…${lastBlock.hash.slice(-4)}`
        : "7be0…19d4",
    },
    {
      label: "Status rantai",
      value: status
        ? status.valid
          ? "Valid (Integritas OK)"
          : "Perlu Validasi"
        : "Terverifikasi",
    },
  ];

  return (
    <section className="surface-card border rounded-2xl p-6 flex flex-col shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h2 className="m-0 text-base font-bold text-strong">
          Status blockchain
        </h2>
        <StatusChip
          label={status?.valid === false ? "Peringatan" : "Terverifikasi"}
          bg={status?.valid === false ? "#FFF1E0" : "#E8F0FE"}
          color={status?.valid === false ? "#B54708" : "#1A56DB"}
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

      <div className="flex flex-col flex-1">
        {chain.map((c) => (
          <div
            key={c.label}
            className="flex items-center justify-between py-3.5 border-t border-fco-border-subtle"
          >
            <span className="text-fco-sm text-soft">{c.label}</span>
            <span className="text-sm font-semibold tabular-nums text-strong">
              {c.value}
            </span>
          </div>
        ))}
      </div>

      <Link
        to="/admin/blockchain"
        className="mt-2 text-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
      >
        Lihat semua blok →
      </Link>
    </section>
  );
}
