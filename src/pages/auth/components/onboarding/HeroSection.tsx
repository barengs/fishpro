import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./heroScene.css";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) return;

    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;

    const fine = window.matchMedia("(pointer:fine)").matches;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      sp = 0,
      csp = 0,
      vis = true,
      raf = 0,
      top = 0,
      h = 1,
      vw = 1,
      mob = false;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    const measure = () => {
      const r = hero.getBoundingClientRect();
      top = r.top + window.scrollY;
      h = r.height || 1;
      vw = window.innerWidth;
      mob = vw < 768;
      scrollUpdate();
    };

    const render = () => {
      const k = mob ? 0.5 : 1;
      stage.style.transform = `rotateY(${(cx * 4).toFixed(2)}deg) rotateX(${(-cy * 4).toFixed(2)}deg)`;

      const depths = [0.2, 0.4, 0.6, 0.8, 1.0];
      layerRefs.current.forEach((el, index) => {
        if (!el) return;
        const d = depths[index] ?? 1;
        let x = cx * 20 * d;
        let y = cy * 10 * d;
        const z = (d - 1) * 60;

        if (index === 2) {
          // Kapal mendekati dermaga, maks 120px
          x += csp * 120 * k;
        }
        if (index === 3) {
          // Ombak depan naik sedikit
          y -= csp * 14 * k;
        }

        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z}px)`;
      });
    };

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      csp += (sp - csp) * 0.1;
      render();
      raf =
        vis &&
        (Math.abs(tx - cx) > 0.001 ||
          Math.abs(ty - cy) > 0.001 ||
          Math.abs(sp - csp) > 0.001)
          ? requestAnimationFrame(loop)
          : 0;
    };

    const kick = () => {
      if (!raf && vis) raf = requestAnimationFrame(loop);
    };

    let tick = false;
    const scrollUpdate = () => {
      sp = clamp((window.scrollY - top) / h);
      kick();
    };

    const handleScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        scrollUpdate();
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (mob) return;
      tx = (e.clientX / vw) * 2 - 1;
      ty = ((e.clientY - (top - window.scrollY)) / h) * 2 - 1;
      kick();
    };

    const handlePointerLeave = () => {
      tx = ty = 0;
      kick();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measure);

    if (fine) {
      hero.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      hero.addEventListener("pointerleave", handlePointerLeave);
    }

    const observer = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting;
      hero.classList.toggle("paused", !vis);
      if (vis) kick();
    });
    observer.observe(hero);

    measure();
    render();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measure);
      if (fine) {
        hero.removeEventListener("pointermove", handlePointerMove);
        hero.removeEventListener("pointerleave", handlePointerLeave);
      }
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero-bg">
      <div className="hero mv" id="hero" ref={heroRef}>
        {/* Animated Background Scene with 5 Layers */}
        <div className="scene">
          <div className="stage" id="stage" ref={stageRef}>
            {/* 1. Langit: paling jauh, 0.2x. Awan melayang pelan, tiga camar terbang */}
            <svg
              ref={(el) => {
                layerRefs.current[0] = el;
              }}
              className="layer"
              data-d="0.2"
              viewBox="0 0 1200 620"
              width="1200"
              height="620"
              preserveAspectRatio="xMidYMax slice"
              aria-hidden="true"
            >
              <rect width="1200" height="620" fill="#CFDCEA" />
              <rect y="200" width="1200" height="240" fill="#DCE5EF" />
              <rect y="340" width="1200" height="110" fill="#E8EEF5" />
              <g className="cl" fill="#F1F5F9">
                <rect x="140" y="110" width="200" height="14" rx="7" />
                <rect x="190" y="92" width="120" height="14" rx="7" />
                <rect x="820" y="70" width="240" height="14" rx="7" />
                <rect x="880" y="52" width="130" height="14" rx="7" />
                <rect x="520" y="190" width="150" height="12" rx="6" />
                <rect x="980" y="250" width="180" height="12" rx="6" />
                <rect x="60" y="270" width="150" height="12" rx="6" />
              </g>
              <g
                fill="none"
                stroke="#5B7BA3"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <g
                  className="drift"
                  style={{ animationDuration: "36s", animationDelay: "-6s" }}
                >
                  <g transform="translate(0,170)">
                    <path className="flap" d="M0 0q7-8 14 0q7-8 14 0" />
                  </g>
                </g>
                <g
                  className="drift"
                  style={{ animationDuration: "48s", animationDelay: "-30s" }}
                >
                  <g transform="translate(0,230)">
                    <path
                      className="flap"
                      d="M0 0q7-8 14 0q7-8 14 0"
                      style={{ animationDelay: "-0.2s" }}
                    />
                  </g>
                </g>
                <g
                  className="drift"
                  style={{ animationDuration: "42s", animationDelay: "-18s" }}
                >
                  <g transform="translate(0,205)">
                    <path
                      className="flap"
                      d="M0 0q5-6 10 0q5-6 10 0"
                      style={{ animationDelay: "-0.35s" }}
                    />
                  </g>
                </g>
              </g>
            </svg>

            {/* 2. Ombak belakang: 0.4x. Dua lapis ombak bergulir, dua perahu kecil, ikan melompat */}
            <svg
              ref={(el) => {
                layerRefs.current[1] = el;
              }}
              className="layer"
              data-d="0.4"
              viewBox="0 0 1200 620"
              width="1200"
              height="620"
              preserveAspectRatio="xMidYMax slice"
              aria-hidden="true"
            >
              <g transform="translate(0,100)">
                <path
                  className="wv"
                  style={
                    {
                      "--w": "300px",
                      animationDuration: "26s",
                    } as React.CSSProperties
                  }
                  d="M-300 340q150 -14 300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0V620H-300z"
                  fill="#8AA3C0"
                />
                <g transform="translate(90,452)">
                  <g
                    className="sail"
                    style={
                      {
                        "--w": "180px",
                        animationDuration: "50s",
                      } as React.CSSProperties
                    }
                  >
                    <path d="M0 0h34l-6 9H6z" fill="#0F3562" opacity=".75" />
                    <path d="M17-24V-2L31-2z" fill="#F8FAFC" />
                  </g>
                </g>
                <g transform="translate(610,462)">
                  <g
                    className="sail"
                    style={
                      {
                        "--w": "60px",
                        animationDuration: "34s",
                      } as React.CSSProperties
                    }
                  >
                    <path d="M0 0h30l-5 8H5z" fill="#0F3562" opacity=".75" />
                    <path d="M15-20V-2L27-2z" fill="#F8FAFC" />
                  </g>
                </g>
                <path
                  className="wv"
                  style={
                    {
                      "--w": "400px",
                      animationDuration: "30s",
                    } as React.CSSProperties
                  }
                  d="M-400 388q200 -14 400 0t400 0t400 0t400 0t400 0t400 0t400 0t400 0t400 0t400 0V620H-400z"
                  fill="#6B88AB"
                />
                <g transform="translate(60,402)">
                  <g className="jump">
                    <ellipse rx="9" ry="4" fill="#0F3562" />
                    <path d="M8 0l9-5v10z" fill="#0F3562" />
                  </g>
                </g>
              </g>
            </svg>

            {/* 3. Kapal: 0.6x. Naik-turun pelan; saat scroll bergeser maks 120px ke dermaga */}
            <svg
              ref={(el) => {
                layerRefs.current[2] = el;
              }}
              className="layer"
              data-d="0.6"
              data-ship
              viewBox="0 0 1200 620"
              width="1200"
              height="620"
              preserveAspectRatio="xMidYMax slice"
              role="img"
              aria-label="Kapal penangkap ikan sandar mendekati dermaga"
            >
              <g transform="translate(0,100)">
                <g className="bob">
                  <rect x="324" y="285" width="6" height="112" fill="#0F3562" />
                  <path
                    d="M330 300L268 388"
                    stroke="#0F3562"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M330 300L400 336"
                    stroke="#0F3562"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect x="394" y="328" width="106" height="8" fill="#0F3562" />
                  <rect x="400" y="336" width="94" height="60" fill="#F8FAFC" />
                  <rect x="412" y="350" width="22" height="18" fill="#0F3562" />
                  <rect x="450" y="350" width="22" height="18" fill="#0F3562" />
                  <path d="M250 395h310l-35 52H285z" fill="#0F3562" />
                  <path d="M257 410h296" stroke="#F8FAFC" strokeWidth="4" />
                </g>
              </g>
            </svg>

            {/* 4. Ombak depan: 0.8x. Bergulir lebih cepat, dua pelampung */}
            <svg
              ref={(el) => {
                layerRefs.current[3] = el;
              }}
              className="layer"
              data-d="0.8"
              data-wave
              viewBox="0 0 1200 620"
              width="1200"
              height="620"
              preserveAspectRatio="xMidYMax slice"
              aria-hidden="true"
            >
              <g transform="translate(0,100)">
                <g
                  className="wv"
                  style={
                    {
                      "--w": "240px",
                      animationDuration: "10s",
                    } as React.CSSProperties
                  }
                >
                  <path
                    d="M-240 455q120 -16 240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0V620H-240z"
                    fill="#0F3562"
                  />
                  <path
                    d="M-240 455q120 -16 240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0"
                    fill="none"
                    stroke="#9FB4CC"
                    strokeWidth="2"
                    opacity=".6"
                  />
                </g>
                <g transform="translate(130,458)">
                  <g className="bobb">
                    <circle r="8" fill="#F8FAFC" />
                    <path d="M-8 0h16" stroke="#0F3562" strokeWidth="3" />
                  </g>
                </g>
                <g transform="translate(650,462)">
                  <g
                    className="bobb"
                    style={{ animationDelay: "-1.2s" }}
                  >
                    <circle r="7" fill="#F8FAFC" />
                    <path d="M-7 0h14" stroke="#0F3562" strokeWidth="3" />
                  </g>
                </g>
              </g>
            </svg>

            {/* 5. Dermaga + staf + timbangan IoT: 1.0x */}
            <svg
              ref={(el) => {
                layerRefs.current[4] = el;
              }}
              className="layer"
              data-d="1"
              viewBox="0 0 1200 620"
              width="1200"
              height="620"
              preserveAspectRatio="xMidYMax slice"
              role="img"
              aria-label="Staf dermaga menimbang ikan hasil tangkapan nelayan dengan timbangan digital IoT"
            >
              <g transform="translate(0,100)">
                <g fill="#1E3A5F">
                  <rect x="720" y="411" width="14" height="110" />
                  <rect x="830" y="411" width="14" height="110" />
                  <rect x="940" y="411" width="14" height="110" />
                  <rect x="1050" y="411" width="14" height="110" />
                  <rect x="1160" y="411" width="14" height="110" />
                </g>
                <rect x="700" y="395" width="520" height="16" fill="#CBD5E1" />
                <path d="M700 403h520" stroke="#94A3B8" />
                <rect
                  x="770"
                  y="375"
                  width="120"
                  height="20"
                  rx="3"
                  fill="#475569"
                />
                <rect
                  x="770"
                  y="371"
                  width="120"
                  height="6"
                  rx="2"
                  fill="#94A3B8"
                />
                <rect x="879" y="332" width="8" height="44" fill="#475569" />
                <rect
                  x="852"
                  y="302"
                  width="64"
                  height="38"
                  rx="4"
                  fill="#0F172A"
                />
                <text
                  x="884"
                  y="326"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="14"
                  fill="#F8FAFC"
                >
                  38,2 kg
                </text>
                <g
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path className="pulse" d="M872 292q12-10 24 0" />
                  <path
                    className="pulse"
                    style={{ animationDelay: "0.3s" }}
                    d="M866 285q18-16 36 0"
                  />
                </g>
                <circle cx="884" cy="297" r="2" fill="#2563EB" />
                <defs>
                  <g id="fishg">
                    <path d="M-14 0L-25-7V7Z" fill="#7F9CBB" />
                    <ellipse rx="16" ry="6.5" fill="#B7C9DB" />
                    <path
                      d="M-16-1Q-4-7.5 12-4Q-2-2 -16-1Z"
                      fill="#5B7BA3"
                    />
                    <path d="M-2-6Q3-12 7-6Z" fill="#7F9CBB" />
                    <path
                      d="M-3-4Q0 0 -3 4"
                      stroke="#5B7BA3"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M4 2Q7 3 9 1"
                      stroke="#7F9CBB"
                      strokeWidth="1"
                      fill="none"
                    />
                    <circle cx="9" cy="-1.5" r="1.5" fill="#0F172A" />
                  </g>
                </defs>
                <rect
                  x="788"
                  y="349"
                  width="84"
                  height="24"
                  rx="3"
                  fill="#5B7BA3"
                />
                <use
                  href="#fishg"
                  transform="translate(806,343) rotate(-4) scale(1.1)"
                />
                <use
                  href="#fishg"
                  transform="translate(834,341) rotate(3) scale(1.1)"
                />
                <use
                  href="#fishg"
                  transform="translate(857,345) rotate(-2) scale(1)"
                />

                {/* Nelayan: lengan mengayun menata ikan */}
                <circle cx="745" cy="338" r="10" fill="#C98F6E" />
                <path d="M734 336q11-14 22 0z" fill="#1E3A5F" />
                <rect
                  x="733"
                  y="349"
                  width="24"
                  height="34"
                  rx="6"
                  fill="#6B88AB"
                />
                <rect x="735" y="383" width="8" height="12" fill="#1E3A5F" />
                <rect x="747" y="383" width="8" height="12" fill="#1E3A5F" />
                <path
                  className="swing"
                  d="M754 358l32 10"
                  stroke="#6B88AB"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Staf: mengetuk tablet, mengangguk */}
                <g className="nod">
                  <circle cx="960" cy="336" r="10" fill="#D9A98A" />
                  <path d="M950 333q10-12 20 0z" fill="#0F3562" />
                </g>
                <rect
                  x="948"
                  y="347"
                  width="24"
                  height="36"
                  rx="6"
                  fill="#0F3562"
                />
                <rect
                  x="954"
                  y="347"
                  width="12"
                  height="36"
                  fill="#F8FAFC"
                  opacity=".85"
                />
                <rect x="950" y="383" width="8" height="12" fill="#334155" />
                <rect x="962" y="383" width="8" height="12" fill="#334155" />
                <g className="tap">
                  <path
                    d="M948 358l-22 6"
                    stroke="#0F3562"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="908"
                    y="356"
                    width="22"
                    height="16"
                    rx="2"
                    fill="#F8FAFC"
                    stroke="#0F3562"
                    strokeWidth="2"
                    transform="rotate(-8 919 364)"
                  />
                </g>

                {/* Nelayan kedua: berjalan membawa peti ikan */}
                <g className="walk">
                  <circle cx="1040" cy="336" r="10" fill="#C98F6E" />
                  <path d="M1030 334q10-12 20 0z" fill="#334155" />
                  <rect
                    x="1028"
                    y="347"
                    width="24"
                    height="36"
                    rx="6"
                    fill="#5B7BA3"
                  />
                  <rect
                    className="leg"
                    x="1030"
                    y="383"
                    width="8"
                    height="12"
                    fill="#1E3A5F"
                  />
                  <rect
                    className="leg r"
                    x="1042"
                    y="383"
                    width="8"
                    height="12"
                    fill="#1E3A5F"
                  />
                  <path
                    d="M1030 358l-14 6"
                    stroke="#5B7BA3"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="990"
                    y="352"
                    width="30"
                    height="20"
                    rx="3"
                    fill="#5B7BA3"
                    stroke="#0F3562"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="1005" cy="352" rx="11" ry="4" fill="#E2E8F0" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Hero copy: exactly as in sample HTML */}
        <div className="hero-copy text-center px-5 pt-14 md:pt-16">
          <h1
            className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-[#0f172a] dark:text-[#f8fafc]"
          >
            Catat hasil tangkapan langsung dari dermaga
          </h1>
          <p
            className="mx-auto mt-5 max-w-xl text-base md:text-lg text-[#334155] dark:text-[#cbd5e1]"
          >
            Ikan ditimbang di dermaga, angkanya langsung masuk ke sistem. Sisa
            kuota kapal dan tarif PNBP dihitung otomatis, tanpa catat manual.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            <Link
              to="/register"
              className="btn no-underline"
              style={{ background: "#0f3562" }}
            >
              Daftar akun
            </Link>
            <Link
              to="/login"
              className="lnk text-sm"
              style={{ color: "#0f3562" }}
            >
              Sudah punya akun? Masuk ke portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
