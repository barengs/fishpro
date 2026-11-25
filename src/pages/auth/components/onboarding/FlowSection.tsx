import { useEffect, useRef, useState } from "react";

export function FlowSection() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const st = stepsRef.current;
      if (!st) return;
      const b = st.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.8 - b.top) / (b.height * 1.1)));
      setProgress(p);
      st.style.setProperty("--p", p.toFixed(3));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section className="onboarding-section" id="alur">
      <div className="onboarding-wrap">
        <h2 className="rv">Dari timbangan sampai terverifikasi, tiga langkah</h2>
        <p className="lead rv" style={{ "--d": "0.08s" } as React.CSSProperties}>
          Setiap kali ikan ditimbang, datanya langsung disegel di sistem. Berat ikan, kapal pembongkar,
          dan tagihan PNBP terkunci permanen.
        </p>

        <div className="steps" id="steps" ref={stepsRef}>
          <div className="steps-line">
            <svg className="steps-boat" width="28" height="18" viewBox="0 0 28 18">
              <path d="M2 11h24l-4 6H6z" fill="#2563eb" />
              <rect x="9" y="5" width="9" height="6" fill="#2563eb" />
              <line x1="21" y1="1" x2="21" y2="11" stroke="#2563eb" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="steps-cols">
            <div className={`rv ${progress >= 0.04 ? "on" : ""}`}>
              <div className="steps-num">1</div>
              <h3>Timbang di dermaga</h3>
              <p>
                Ikan ditimbang di timbangan dermaga. Angkanya masuk ke sistem otomatis dari sensor, tanpa
                dicatat manual.
              </p>
            </div>
            <div className={`rv ${progress >= 1 / 3 + 0.04 ? "on" : ""}`} style={{ "--d": "0.1s" } as React.CSSProperties}>
              <div className="steps-num">2</div>
              <h3>Tercatat dan terhitung</h3>
              <p>
                Sisa kuota kapal diperbarui. Tarif PNBP dihitung dari berat ikan dan ukuran GT kapal.
              </p>
            </div>
            <div className={`rv ${progress >= 2 / 3 + 0.04 ? "on" : ""}`} style={{ "--d": "0.2s" } as React.CSSProperties}>
              <div className="steps-num">3</div>
              <h3>Terkunci dan bisa dicek</h3>
              <p>
                Catatan disegel dengan blockchain sehingga tidak bisa diubah atau dihapus diam-diam. Petugas
                dinas dan pemilik kapal bisa memeriksanya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
