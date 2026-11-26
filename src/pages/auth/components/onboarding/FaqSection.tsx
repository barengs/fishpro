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
          <h2 className="rv">Pertanyaan yang sering muncul</h2>
          <p className="lead rv" style={{ "--d": "0.08s" } as React.CSSProperties}>
            Seputar cara kerja timbangan, kuota kapal, dan pencatatan tangkapan.
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
                  Ikan ditimbang di timbangan dermaga yang terhubung ke sistem. Berat ikan otomatis terbaca,
                  tagihan PNBP langsung terhitung, dan sisa kuota kapal terbarui tanpa formulir kertas.
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
              Apakah angka hasil timbangan bisa diubah setelah disimpan?
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
                  Tidak. Setiap catatan disegel dengan blockchain sehingga tidak bisa diubah atau dihapus
                  diam-diam. Kalau ada koreksi, perubahannya tercatat sebagai entri baru lengkap dengan waktu dan
                  petugasnya.
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
              Bagaimana cara sistem memperkirakan kuota tangkapan?
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
                  Kuota kapal dikurangi otomatis dari berat ikan yang ditimbang di dermaga. Sisa kuota bisa
                  dilihat nahkoda, pemilik, dan pengawas setiap kali ada timbangan baru.
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
              Bagaimana cara mendaftar ke sistem?
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
                  Pilih Daftar akun, isi nomor registrasi kapal atau data petugas, lalu tunggu verifikasi dari
                  dinas setempat. Setelah disetujui, Anda bisa masuk ke portal. Belum punya akun?{" "}
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
