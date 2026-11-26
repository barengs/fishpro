import { useId } from "react";
import "./shipScene.css";

interface ShipSceneProps {
  className?: string;
}

export function ShipScene({ className = "" }: ShipSceneProps) {
  const baseId = useId().replace(/:/g, "");
  const skyId = `${baseId}-sky`;
  const sunId = `${baseId}-sun`;
  const haloId = `${baseId}-halo`;
  const seaId = `${baseId}-sea`;

  return (
    <svg
      className={`scene ${className}`.trim()}
      viewBox="0 0 600 800"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Kapal nelayan berlayar di atas ombak"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1740" />
          <stop offset="0.45" stopColor="#1d3a7d" />
          <stop offset="0.62" stopColor="#e08a5a" />
          <stop offset="0.66" stopColor="#f5b36b" />
        </linearGradient>
        <radialGradient id={sunId}>
          <stop offset="0" stopColor="#fff1c9" />
          <stop offset="0.6" stopColor="#ffc878" />
          <stop offset="1" stopColor="#f59a4f" />
        </radialGradient>
        <radialGradient id={haloId}>
          <stop offset="0" stopColor="#ffb56b" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffb56b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={seaId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a4f94" />
          <stop offset="1" stopColor="#071433" />
        </linearGradient>
      </defs>

      {/* Latar belakang solid navy sesuai tema panel */}
      <rect x="-300" y="0" width="1200" height="900" fill="#0e1f4d" />

      <g className="w1">
        <path
          d="M0 524 q50 -5 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V900 H0 Z"
          fill="#1b3a78"
          opacity="0.9"
        />
      </g>

      <g className="w2">
        <path
          d="M0 536 q50 -7 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V900 H0 Z"
          fill="#17316b"
        />
      </g>

      <g className="ship">
        <line x1="335" y1="496" x2="335" y2="380" stroke="#222a44" strokeWidth="4" strokeLinecap="round" />
        <path className="flag" d="M335 381 q13 -5 27 2 L335 393 Z" fill="#e5483b" />
        <circle className="lamp" cx="335" cy="398" r="11" fill="#ffd78a" />
        <circle cx="335" cy="398" r="3" fill="#ffe7b0" />
        <g stroke="#a9b9d8" strokeWidth="0.9" opacity="0.8">
          <line x1="335" y1="384" x2="262" y2="428" />
          <line x1="335" y1="384" x2="424" y2="478" />
        </g>
        <line x1="335" y1="436" x2="412" y2="478" stroke="#222a44" strokeWidth="3" strokeLinecap="round" />
        <line x1="412" y1="478" x2="412" y2="490" stroke="#a9b9d8" strokeWidth="1" />
        <path d="M345 497 Q352 474 372 478 Q392 474 399 497 Z" fill="#35557f" />
        <g stroke="#6f93c4" strokeWidth="0.8" fill="none">
          <path d="M356 496 Q362 484 368 496M370 496 Q376 482 382 496M384 496 Q388 486 394 496M350 488 H396" />
        </g>
        <rect x="312" y="484" width="14" height="12" rx="1" fill="#e0a93e" />
        <rect x="327" y="486" width="14" height="10" rx="1" fill="#c98f2c" />
        <rect x="296" y="448" width="15" height="48" fill="#243764" />
        <rect x="296" y="456" width="15" height="7" fill="#e5483b" />
        <circle className="smoke" cx="303" cy="446" r="6" fill="#cfd8ea" />
        <circle className="smoke" cx="303" cy="446" r="6" fill="#cfd8ea" style={{ animationDelay: "1.3s" }} />
        <circle className="smoke" cx="303" cy="446" r="6" fill="#cfd8ea" style={{ animationDelay: "2.6s" }} />
        <rect x="230" y="454" width="64" height="42" fill="#f1f4fa" />
        <rect x="240" y="430" width="48" height="25" fill="#f1f4fa" />
        <rect x="235" y="425" width="58" height="6" rx="1" fill="#243764" />
        <g fill="#8fc0ff">
          <rect x="245" y="436" width="10" height="9" />
          <rect x="259" y="436" width="10" height="9" />
          <rect x="273" y="436" width="10" height="9" />
          <rect x="238" y="466" width="14" height="10" />
          <rect x="258" y="466" width="14" height="10" />
        </g>
        <rect x="278" y="474" width="10" height="22" fill="#243764" />
        <circle cx="248" cy="487" r="5" fill="none" stroke="#e5483b" strokeWidth="3" />
        <line x1="264" y1="425" x2="264" y2="402" stroke="#222a44" strokeWidth="2" />
        <rect className="radar" x="252" y="398" width="24" height="4" rx="2" fill="#222a44" />
        <path d="M200 496 H388 Q408 494 424 478 L406 524 Q398 546 372 546 H236 Q214 546 208 522 Z" fill="#d23a30" />
        <path d="M207 524 L407 524 Q398 546 372 546 H236 Q214 546 208 524 Z" fill="#161c33" />
        <rect x="200" y="493" width="190" height="5" fill="#eef2fa" />
        <g fill="#ffd78a">
          <circle cx="232" cy="509" r="4" />
          <circle cx="250" cy="509" r="4" />
          <circle cx="268" cy="509" r="4" />
        </g>
        <text
          x="340"
          y="515"
          textAnchor="middle"
          fontFamily="Inter,sans-serif"
          fontSize="10"
          fontWeight="700"
          fill="#fff"
          letterSpacing="1"
        >
          FISHPRO-01
        </text>
      </g>

      <ellipse className="fm" cx="214" cy="546" rx="22" ry="3" fill="#e8f0ff" />
      <ellipse className="fm" cx="415" cy="545" rx="16" ry="2.5" fill="#e8f0ff" style={{ animationDelay: "0.7s" }} />

      <g className="w3">
        <path
          d="M0 549 q50 -8 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V900 H0 Z"
          fill="#112c62"
        />
      </g>

      <g className="w4">
        <path
          d="M0 610 q50 -11 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V900 H0 Z"
          fill="#0a1d48"
        />
      </g>
    </svg>
  );
}
