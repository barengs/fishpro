import { Link } from "react-router-dom";

export function FaqSection() {
  return (
    <section className="s" id="tanya">
      <div className="wrap grid md:grid-cols-[1fr_1.6fr] gap-12">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#0f172a] dark:text-[#f8fafc]">
            Pertanyaan yang sering muncul
          </h2>
          <p className="mt-3 t2">
            Seputar cara kerja timbangan, kuota kapal, dan pencatatan tangkapan.
          </p>
        </div>
        <div className="border-t bd">
          <details className="border-b bd py-5" open>
            <summary className="flex justify-between gap-4 font-medium text-[#0f172a] dark:text-[#f8fafc]">
              Bagaimana alur penimbangan ikan di pelabuhan?
              <svg
                className="chev shrink-0 mt-1 transition-transform"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 t2 leading-relaxed">
              Ikan ditimbang di timbangan dermaga yang terhubung ke sistem.
              Berat ikan otomatis terbaca, tagihan PNBP langsung terhitung, dan
              sisa kuota kapal terbarui tanpa formulir kertas.
            </p>
          </details>

          <details className="border-b bd py-5">
            <summary className="flex justify-between gap-4 font-medium text-[#0f172a] dark:text-[#f8fafc]">
              Apakah angka hasil timbangan bisa diubah setelah disimpan?
              <svg
                className="chev shrink-0 mt-1 transition-transform"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 t2 leading-relaxed">
              Tidak. Tiap catatan disegel dengan blockchain dan terkait dengan
              data sebelumnya, sehingga tidak bisa diedit atau dihapus
              diam-diam.
            </p>
          </details>

          <details className="border-b bd py-5">
            <summary className="flex justify-between gap-4 font-medium text-[#0f172a] dark:text-[#f8fafc]">
              Bagaimana cara sistem memperkirakan kuota tangkapan?
              <svg
                className="chev shrink-0 mt-1 transition-transform"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 t2 leading-relaxed">
              Perkiraan dihitung dari tren tangkapan bulan-bulan sebelumnya.
            </p>
          </details>

          <details className="border-b bd py-5">
            <summary className="flex justify-between gap-4 font-medium text-[#0f172a] dark:text-[#f8fafc]">
              Bagaimana cara mendaftar ke sistem?
              <svg
                className="chev shrink-0 mt-1 transition-transform"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 t2 leading-relaxed">
              Pilih Daftar, lalu pilih peran Anda: nahkoda, pemilik kapal, atau
              pengawas. Belum punya akun?{" "}
              <Link to="/register" className="lnk">
                Daftar di sini
              </Link>
              .
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
