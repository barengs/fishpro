import { useCallback, useEffect, useState } from "react";
import { useDetailModal } from "../../../components/useDetailModal";
import {
  blockchainService,
  type BlockchainBlock,
  type FishCatchTransaction,
} from "../../../services/blockchain";

export function useBlockchainViewer() {
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

  const loadBlockchainData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    let ignore = false;
    async function initData() {
      try {
        const [blocksData, txData, statusData] = await Promise.all([
          blockchainService.getBlocks().catch(() => []),
          blockchainService.getTransactions().catch(() => []),
          blockchainService.getStatus().catch(() => null),
        ]);
        if (!ignore) {
          setBlocks(blocksData);
          setTransactions(txData);
          if (statusData) setStatusValid(statusData.valid);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMsg(
            err instanceof Error ? err.message : "Gagal memuat data blockchain",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    initData();
    return () => {
      ignore = true;
    };
  }, []);

  return {
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
    loadBlockchainData,
  };
}
