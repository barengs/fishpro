import { useState } from "react";

export function useConfirmDelete<T = unknown>() {
  const [target, setTarget] = useState<T | null>(null);
  const open = target !== null;
  const requestDelete = (item: T) => setTarget(item);
  const cancelDelete = () => setTarget(null);

  return { target, open, requestDelete, cancelDelete };
}
