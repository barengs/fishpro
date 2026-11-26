import { useState } from "react";
import { usePageTransition } from "../../../../components/PageTransitionContext";

export function FaqSection() {
  const { navigateWithTransition } = usePageTransition();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="onboarding-section" id="tanya">
      <div className="onboarding-wrap faqs-layout">
        <div>
          <h2 className="rv">Pertanyaan yang sering diajukan</h2>
          <p className="lead rv" style={{ "--d": "0.08s" } as React.CSSProperties}>
            Seputar alur penimbangan, kuota kapal, dan pelaporan hasil tangkapan.
          </p>
        </div>
        <div id="faq">
          <div className={`faq-item rv ${openIndex === 0 ? "open" : ""}`}>
            <button
              type="button"
              className="faq-btn"
              aria-expanded={openIndex === 0}
              onClick={() => toggleFaq(0)}
            >
              Bagaimana alur penimbangan ikan di pelabuhan?
              <svg
                className="faq-chevron"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="ans-grid">
              <div className="ans-inner">
                <p>
                  Hasil tangkapan ditimbang di dermaga dengan perangkat digital yang terhubung ke FishPro.
                  Bobot ikan langsung terbaca, tagihan PNBP ikut dihitung, dan sisa kuota kapal terbarui
                  tanpa formulir kertas.
                </p>
              </div>
            </div>
          </div>

          <div className={`faq-item rv ${openIndex === 1 ? "open" : ""}`}>
            <button
              type="button"
              className="faq-btn"
              aria-expanded={openIndex === 1}
              onClick={() => toggleFaq(1)}
            >
              Apakah data timbangan bisa diubah setelah tersimpan?
              <svg
                className="faq-chevron"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="ans-grid">
              <div className="ans-inner">
                <p>
                  Tidak. Setiap catatan yang tersimpan dilindungi blockchain agar tidak bisa diubah atau
                  dihapus sepihak. Jika diperlukan koreksi, sistem mencatatnya sebagai entri baru lengkap
                  dengan waktu dan petugas yang memprosesnya.
                </p>
              </div>
            </div>
          </div>

          <div className={`faq-item rv ${openIndex === 2 ? "open" : ""}`}>
            <button
              type="button"
              className="faq-btn"
              aria-expanded={openIndex === 2}
              onClick={() => toggleFaq(2)}
            >
              Bagaimana sisa kuota tangkap kapal diperbarui?
              <svg
                className="faq-chevron"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="ans-grid">
              <div className="ans-inner">
                <p>
                  Kuota kapal berkurang sesuai berat ikan yang masuk dari hasil penimbangan di dermaga.
                  Sisa kuota terbaru langsung tampil untuk nahkoda, pemilik kapal, dan pengawas setiap kali
                  bongkar muat selesai.
                </p>
              </div>
            </div>
          </div>

          <div className={`faq-item rv ${openIndex === 3 ? "open" : ""}`}>
            <button
              type="button"
              className="faq-btn"
              aria-expanded={openIndex === 3}
              onClick={() => toggleFaq(3)}
            >
              Bagaimana cara mendaftar akun FishPro?
              <svg
                className="faq-chevron"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="ans-grid">
              <div className="ans-inner">
                <p>
                  Pilih Daftar akun, lengkapi nomor registrasi kapal atau data petugas, lalu tunggu
                  verifikasi dari dinas setempat. Begitu disetujui, akun bisa langsung dipakai. Belum
                  terdaftar?{" "}
                  <button
                    type="button"
                    className="role-link"
                    onClick={() => navigateWithTransition("/register")}
                  >
                    Daftar di sini
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
