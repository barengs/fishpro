import { useEffect, useRef, useState } from "react";
import { usePageTransition } from "../../../../components/PageTransitionContext";

function buildWaveD(y: number, a: number) {
  let s = `M0 ${y} q50 ${-a} 100 0`;
  for (let i = 1; i < 14; i++) {
    s += " t100 0";
  }
  return `${s} V600 H0 Z`;
}

export function HeroSection() {
  const { navigateWithTransition } = usePageTransition();
  const [kgText, setKgText] = useState("38,2 kg");
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) return;

    let t0: number | null = null;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const t = (ts - t0) % 6500;
      const v = t < 2600 ? 38.2 * (1 - Math.pow(1 - t / 2600, 3)) : 38.2;
      setKgText(v.toFixed(1).replace(".", ",") + " kg");
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="hero" id="top">
      <div className="onboarding-wrap">
        <h1 className="rv in">Catat hasil tangkapan langsung dari dermaga</h1>
        <p className="hero-desc rv in" style={{ "--d": "0.1s" } as React.CSSProperties}>
          Ikan ditimbang di dermaga, angkanya langsung masuk ke sistem. Sisa kuota kapal dan tarif PNBP
          dihitung otomatis, tanpa catat manual.
        </p>
        <div className="hero-cta rv in" style={{ "--d": "0.2s" } as React.CSSProperties}>
          <button
            type="button"
            className="onboarding-btn pri"
            onClick={() => navigateWithTransition("/register")}
          >
            Daftar akun
          </button>
          <button
            type="button"
            className="onboarding-btn"
            onClick={() => navigateWithTransition("/login")}
          >
            Sudah punya akun? Masuk ke portal
          </button>
        </div>
      </div>

      <svg
        className="hero-scene"
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMax slice"
        role="img"
        aria-label="Kapal nelayan bersandar di dekat dermaga tempat ikan ditimbang"
      >
        <defs>
          <g id="hero-dock-person">
            <rect x="-9" y="-28" width="7" height="28" fill="#0a1535" />
            <rect x="2" y="-28" width="7" height="28" fill="#0a1535" />
            <rect x="-13" y="-72" width="26" height="46" rx="9" fill="currentColor" />
            <circle cy="-84" r="11" fill="#d99b7a" />
            <path d="M-12 -86a12 12 0 0 1 24 0z" fill="#e8eefc" />
          </g>
        </defs>

        <g className="w1">
          <path d={buildWaveD(236, 5)} fill="#1b3a78" opacity="0.9" />
        </g>
        <g className="w2">
          <path d={buildWaveD(248, 7)} fill="#17316b" />
        </g>

        {/* Dermaga */}
        <rect x="700" y="196" width="520" height="10" fill="#2f4f98" />
        <rect x="700" y="196" width="520" height="3" fill="#5b86d6" />
        <g fill="#0a1a44">
          <rect x="740" y="206" width="16" height="200" />
          <rect x="880" y="206" width="16" height="200" />
          <rect x="1020" y="206" width="16" height="200" />
          <rect x="1160" y="206" width="16" height="200" />
        </g>

        <use href="#hero-dock-person" x="800" y="196" style={{ color: "#4f78c7" }} />
        <use href="#hero-dock-person" x="990" y="196" style={{ color: "#e8eefc" }} />
        <use href="#hero-dock-person" x="1100" y="196" style={{ color: "#3b5fa8" }} />

        <line
          className="arm"
          x1="808"
          y1="134"
          x2="846"
          y2="152"
          stroke="#4f78c7"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line
          x1="982"
          y1="134"
          x2="960"
          y2="150"
          stroke="#e8eefc"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <rect
          className="tab"
          x="944"
          y="142"
          width="22"
          height="15"
          rx="2"
          fill="#9ec3ff"
          transform="rotate(-18 955 150)"
        />
        <rect x="1086" y="148" width="28" height="18" rx="3" fill="#2563eb" />
        <rect x="842" y="178" width="96" height="18" rx="3" fill="#2c3f6e" />
        <rect x="884" y="126" width="12" height="54" fill="#3a4f7f" />

        <g fill="#8fb0e8">
          <ellipse cx="862" cy="168" rx="16" ry="6" />
          <ellipse cx="890" cy="165" rx="17" ry="6" />
          <ellipse cx="916" cy="168" rx="15" ry="6" />
          <path d="M876 168l-8-5v10zM906 165l-8-5v10zM930 168l-7-5v10z" />
        </g>

        <rect x="842" y="90" width="96" height="38" rx="7" fill="#0a1535" stroke="#2563eb" strokeWidth="2" />
        <text
          id="kg"
          x="890"
          y="116"
          textAnchor="middle"
          fontFamily="ui-monospace,Menlo,monospace"
          fontSize="17"
          fontWeight="700"
          fill="#e8f0ff"
        >
          {kgText}
        </text>

        <g className="wf" fill="none" stroke="#7db0ff" strokeWidth="2.5" strokeLinecap="round">
          <path d="M878 76a16 16 0 0 1 24 0" style={{ animationDelay: ".4s" }} />
          <path d="M870 68a28 28 0 0 1 40 0" style={{ animationDelay: ".8s" }} />
          <path d="M862 60a40 40 0 0 1 56 0" style={{ animationDelay: "1.2s" }} />
        </g>
        <circle cx="890" cy="82" r="2.5" fill="#7db0ff" />

        {/* Kapal Nelayan */}
        <g transform="translate(120 -284)">
          <g className="ship">
            <line x1="335" y1="496" x2="335" y2="380" stroke="#222a44" strokeWidth="4" strokeLinecap="round" />
            <path className="flag" d="M335 381q13-5 27 2L335 393z" fill="#e5483b" />
            <circle className="lamp" cx="335" cy="398" r="11" fill="#ffd78a" />
            <circle cx="335" cy="398" r="3" fill="#ffe7b0" />
            <g stroke="#a9b9d8" strokeWidth="0.9" opacity="0.8">
              <line x1="335" y1="384" x2="262" y2="428" />
              <line x1="335" y1="384" x2="424" y2="478" />
            </g>
            <line x1="335" y1="436" x2="412" y2="478" stroke="#222a44" strokeWidth="3" strokeLinecap="round" />
            <path d="M345 497Q352 474 372 478Q392 474 399 497z" fill="#35557f" />
            <g stroke="#6f93c4" strokeWidth="0.8" fill="none">
              <path d="M356 496Q362 484 368 496M370 496Q376 482 382 496M384 496Q388 486 394 496M350 488H396" />
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
            <path d="M200 496H388Q408 494 424 478L406 524Q398 546 372 546H236Q214 546 208 522z" fill="#d23a30" />
            <path d="M207 524L407 524Q398 546 372 546H236Q214 546 208 524z" fill="#161c33" />
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
        </g>

        <ellipse className="fm" cx="334" cy="262" rx="22" ry="3" fill="#e8f0ff" />
        <ellipse className="fm" cx="535" cy="261" rx="16" ry="2.5" fill="#e8f0ff" style={{ animationDelay: "0.7s" }} />

        <g className="w3">
          <path d={buildWaveD(260, 8)} fill="#112c62" />
        </g>
        <g className="w4">
          <path d={buildWaveD(300, 11)} fill="#0a1d48" />
        </g>
        <g className="w5">
          <path className="bgw" d={buildWaveD(372, 9)} />
        </g>
      </svg>
    </div>
  );
}
