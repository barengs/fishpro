import { useState } from "react";

export function useDetailModal<T = unknown>() {
  const [selected, setSelected] = useState<T | null>(null);
  const open = selected !== null;

  const openDetail = (item: T) => setSelected(item);
  const closeDetail = () => setSelected(null);

  return {
    selected,
    open,
    openDetail,
    closeDetail,
  };
}
