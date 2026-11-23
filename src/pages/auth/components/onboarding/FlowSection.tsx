import { useEffect, useRef } from "react";

export function FlowSection() {
  const flowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) return;

    const flow = flowRef.current;
    const track = trackRef.current;
    const ship = shipRef.current;
    if (!flow || !track || !ship) return;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    let ftop = 0;
    let fh = 1;
    let fw = 1;

    const measure = () => {
      const f = flow.getBoundingClientRect();
      ftop = f.top + window.scrollY;
      fh = f.height || 1;
      fw = Math.max(0, track.clientWidth - 44);
      updateShip();
    };

    const updateShip = () => {
      const vh = window.innerHeight;
      const fp = clamp((window.scrollY + vh * 0.75 - ftop) / (fh + vh * 0.3));
      ship.style.transform = `translate3d(${(fp * fw).toFixed(1)}px,0,0)`;
    };

    let tick = false;
    const handleScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        updateShip();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measure);

    measure();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="s" id="alur">
      <div className="wrap">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl text-[#0f172a] dark:text-[#f8fafc]">
          Dari timbangan sampai terverifikasi, tiga langkah
        </h2>
        <p className="mt-4 max-w-xl t2">
          Setiap kali ikan ditimbang, datanya langsung disegel di sistem. Berat
          ikan, kapal pembongkar, dan tagihan PNBP terkunci permanen.
        </p>

        <div className="mt-14" ref={flowRef} id="flow">
          <div className="relative h-8 mb-6" ref={trackRef} id="flowtrack">
            <div className="absolute left-0 right-0 top-1/2 border-t bd"></div>
            <svg
              ref={shipRef}
              id="flowship"
              className="absolute left-0 top-0 mv"
              width="44"
              height="26"
              viewBox="0 0 44 26"
              role="img"
              aria-label="Kapal kecil bergerak dari langkah 1 ke langkah 3"
              style={{
                willChange: "transform",
                background: "var(--bg, #f8fafc)",
              }}
            >
              <path
                d="M3 14h38l-5 8H8z"
                fill="var(--pr, #0f3562)"
                className="dark:fill-[#2f6fd6]"
              />
              <rect
                x="18"
                y="6"
                width="12"
                height="8"
                fill="var(--pr, #0f3562)"
                className="dark:fill-[#2f6fd6]"
              />
              <rect
                x="14"
                y="2"
                width="2"
                height="12"
                fill="var(--pr, #0f3562)"
                className="dark:fill-[#2f6fd6]"
              />
            </svg>
          </div>
          <ol className="grid md:grid-cols-3 gap-10 md:gap-14 list-none p-0 m-0">
            <li>
              <p className="text-sm ac font-medium">1</p>
              <h3 className="mt-1 text-xl font-medium text-[#0f172a] dark:text-[#f8fafc]">
                Timbang di dermaga
              </h3>
              <p className="mt-2 t2 leading-relaxed">
                Ikan ditimbang di timbangan dermaga. Angkanya masuk ke sistem
                otomatis dari sensor, tanpa dicatat manual.
              </p>
            </li>
            <li>
              <p className="text-sm ac font-medium">2</p>
              <h3 className="mt-1 text-xl font-medium text-[#0f172a] dark:text-[#f8fafc]">
                Tercatat dan terhitung
              </h3>
              <p className="mt-2 t2 leading-relaxed">
                Sisa kuota kapal diperbarui. Tarif PNBP dihitung dari berat ikan
                dan ukuran GT kapal.
              </p>
            </li>
            <li>
              <p className="text-sm ac font-medium">3</p>
              <h3 className="mt-1 text-xl font-medium text-[#0f172a] dark:text-[#f8fafc]">
                Terkunci dan bisa dicek
              </h3>
              <p className="mt-2 t2 leading-relaxed">
                Catatan disegel dengan blockchain sehingga tidak bisa diubah
                atau dihapus diam-diam. Petugas dinas dan pemilik kapal bisa
                memeriksanya.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
