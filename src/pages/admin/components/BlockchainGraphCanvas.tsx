import {
  useState,
  useRef,
  useEffect,
  type PointerEvent,
  type WheelEvent,
} from "react";
import {
  Link2,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { formatShortHash } from "../../../utils";
import type { BlockchainBlock } from "../../../services/blockchain";

interface BlockchainGraphCanvasProps {
  blocks: BlockchainBlock[];
  selectedBlock: BlockchainBlock | null;
  onSelectBlock: (block: BlockchainBlock) => void;
}

export function BlockchainGraphCanvas({
  blocks,
  selectedBlock,
  onSelectBlock,
}: BlockchainGraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan & Zoom state
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset to initial centered view
  const handleReset = () => {
    setScale(1);
    setPan({ x: 40, y: 40 });
  };

  const handleZoom = (delta: number) => {
    setScale((prev) =>
      Math.min(2, Math.max(0.5, Number((prev + delta).toFixed(2)))),
    );
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".block-node")
    ) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setScale((prev) =>
      Math.min(2, Math.max(0.5, Number((prev + zoomFactor).toFixed(2)))),
    );
  };

  // Toggle fullscreen container mode
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        setIsFullscreen(!isFullscreen);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Compute node coordinates (stepped wave layout matching flow graph)
  const NODE_WIDTH = 290;
  const NODE_HEIGHT = 145;
  const GAP_X = 140;

  const nodePositions = blocks.map((_, i) => {
    const x = 60 + i * (NODE_WIDTH + GAP_X);
    const y = 90 + (i % 2 === 0 ? 0 : 80);
    return { x, y };
  });

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className={`relative w-full rounded-xs border border-fco-border-subtle bg-[#0c1017] text-white overflow-hidden select-none transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none h-screen w-screen"
          : "h-105 sm:h-115"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        backgroundImage:
          "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Top Bar Overlay Info */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-xs bg-[#161d2a]/90 backdrop-blur-md border border-white/10 text-xs font-mono flex items-center gap-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/90 font-sans font-semibold">
            Diagram Interaktif Rantai Blok
          </span>
          <span className="text-white/40">·</span>
          <span className="text-emerald-400">
            {blocks.length} Blok Tersambung
          </span>
        </div>
      </div>

      {/* Floating Canvas World */}
      <div
        className="absolute inset-0 origin-top-left pointer-events-auto"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.08s ease-out",
        }}
      >
        {/* SVG Bezier Curves for Chain Connectors */}
        <svg
          className="absolute inset-0 overflow-visible pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="chainGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a56db" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {nodePositions.map((pos, i) => {
            if (i >= nodePositions.length - 1) return null;
            const nextPos = nodePositions[i + 1];

            // Start at right edge of current block
            const x1 = pos.x + NODE_WIDTH;
            const y1 = pos.y + NODE_HEIGHT / 2;

            // End at left edge of next block
            const x2 = nextPos.x;
            const y2 = nextPos.y + NODE_HEIGHT / 2;

            // Control points for smooth S-curve
            const dx = (x2 - x1) * 0.55;
            const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

            return (
              <g key={`chain-${i}`}>
                {/* 1. Outer Glow Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#chainGlow)"
                  strokeWidth="5"
                  opacity="0.35"
                  filter="url(#neonGlow)"
                />
                {/* 2. Solid Bridge Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#1a56db"
                  strokeWidth="2.5"
                  opacity="0.6"
                />
                {/* 3. Animated Dashed Chain Line (Simulating linked chain) */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  className="animate-dash"
                />
                {/* 4. Midpoint Floating Chain Link Icon */}
                <g
                  transform={`translate(${(x1 + x2) / 2 - 12}, ${(y1 + y2) / 2 - 12})`}
                  className="pointer-events-none"
                >
                  <rect
                    width="24"
                    height="24"
                    rx="3"
                    fill="#0f172a"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  <foreignObject width="24" height="24">
                    <div className="w-full h-full flex items-center justify-center text-cyan-400">
                      <Link2 size={13} strokeWidth={2.5} />
                    </div>
                  </foreignObject>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Render Block Node Cards */}
        {blocks.map((block, i) => {
          const pos = nodePositions[i] || { x: 60, y: 90 };
          const isGenesis = block.index === 0;
          const isSelected = selectedBlock?.index === block.index;

          return (
            <div
              key={block.index}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBlock(block);
              }}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                width: `${NODE_WIDTH}px`,
              }}
              className={`block-node absolute top-0 left-0 p-4 rounded-xs border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#131b29] border-cyan-400 ring-2 ring-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                  : isGenesis
                    ? "bg-[#111722]/95 border-amber-500/70 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    : "bg-[#111722]/95 border-blue-500/60 hover:border-cyan-400 shadow-[0_0_20px_rgba(26,86,219,0.25)]"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-xs flex items-center justify-center text-xs font-bold font-mono ${
                      isGenesis
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "bg-blue-500/20 text-cyan-400 border border-blue-500/40"
                    }`}
                  >
                    #{block.index}
                  </div>
                  <span className="text-xs font-bold tracking-tight text-white/95">
                    {isGenesis ? "Genesis Block" : "Blok Tangkapan"}
                  </span>
                </div>

                <span
                  className={`text-2xs font-semibold px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider ${
                    isGenesis
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {isGenesis ? "Genesis" : "Valid"}
                </span>
              </div>

              {/* Inset Hash Box */}
              <div className="my-2.5 p-2 rounded-xs bg-[#090d14] border border-white/5 space-y-1 text-xs font-mono">
                <div className="flex items-baseline justify-between gap-1.5">
                  <span className="text-2xs text-white/40 uppercase font-sans">
                    Hash
                  </span>
                  <span
                    className="text-cyan-400 font-bold truncate max-w-44 text-right"
                    title={block.hash}
                  >
                    {formatShortHash(block.hash, 7, 5)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-1.5">
                  <span className="text-2xs text-white/40 uppercase font-sans">
                    Prev
                  </span>
                  <span
                    className="text-white/60 truncate max-w-44 text-right"
                    title={block.previous_hash || "0"}
                  >
                    {isGenesis
                      ? "0 (Awal)"
                      : formatShortHash(block.previous_hash, 7, 5)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-2xs text-white/50 font-mono">
                <span>
                  Nonce:{" "}
                  <strong className="text-white/80">{block.nonce}</strong>
                </span>
                <span>
                  {new Date(block.timestamp).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}{" "}
                  WIB
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Controls (Bottom-Left toolbar matching screenshot) */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 flex flex-col gap-1 p-1 rounded-xs bg-[#161d2a]/90 backdrop-blur-md border border-white/10 shadow-lg">
        <button
          type="button"
          onClick={() => handleZoom(0.15)}
          title="Zoom In (+)"
          className="w-8 h-8 rounded-xs bg-white/5 hover:bg-white/15 text-white/90 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer border-none"
        >
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-0.15)}
          title="Zoom Out (-)"
          className="w-8 h-8 rounded-xs bg-white/5 hover:bg-white/15 text-white/90 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer border-none"
        >
          <Minus size={15} />
        </button>
        <button
          type="button"
          onClick={handleReset}
          title="Reset Tampilan"
          className="w-8 h-8 rounded-xs bg-white/5 hover:bg-white/15 text-white/90 flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer border-none"
        >
          <RotateCcw size={13} />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          title={
            isFullscreen ? "Kecilkan (Minimize)" : "Perbesar Penuh (Maximize)"
          }
          className="w-8 h-8 rounded-xs bg-white/5 hover:bg-white/15 text-white/90 flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer border-none"
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>

      {/* Canvas Hint (Bottom-Right) */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 pointer-events-none text-2xs text-white/40 font-mono hidden sm:flex items-center gap-2">
        <span>Geser kanvas (drag)</span>
        <span>·</span>
        <span>Scroll untuk zoom</span>
      </div>
    </div>
  );
}
