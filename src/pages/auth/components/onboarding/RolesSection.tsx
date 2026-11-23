import { Link } from "react-router-dom";

export function RolesSection() {
  return (
    <section className="s" id="peran">
      <div className="wrap">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl text-[#0f172a] dark:text-[#f8fafc]">
          Setiap peran melihat data yang ia perlukan
        </h2>
        <div className="mt-12 border-t bd">
          {/* Row 1: Nahkoda */}
          <div className="grid md:grid-cols-[240px_1fr_auto] gap-6 py-8 border-b bd items-start">
            <div>
              <h3 className="text-xl font-medium text-[#0f172a] dark:text-[#f8fafc]">
                Nahkoda
              </h3>
              <p className="text-sm t2 mt-1">Nahkoda dan awak kapal</p>
            </div>
            <ul className="space-y-2 t2">
              <li>Cek sisa kuota ikan yang masih boleh ditangkap</li>
              <li>Lihat rincian hasil timbangan setiap kali bongkar muat</li>
              <li>Periksa nomor izin dan masa berlaku dokumen kapal</li>
            </ul>
            <Link to="/login" className="lnk text-sm">
              Masuk sebagai nahkoda
            </Link>
          </div>

          {/* Row 2: Pemilik kapal */}
          <div className="grid md:grid-cols-[240px_1fr_auto] gap-6 py-8 border-b bd items-start">
            <div>
              <h3 className="text-xl font-medium text-[#0f172a] dark:text-[#f8fafc]">
                Pemilik kapal
              </h3>
              <p className="text-sm t2 mt-1">Pengusaha dan pengelola kapal</p>
            </div>
            <ul className="space-y-2 t2">
              <li>Lihat status kapal yang sedang melaut atau sandar</li>
              <li>Hitung estimasi tagihan PNBP secara transparan</li>
              <li>Atur penugasan nahkoda untuk setiap unit kapal</li>
            </ul>
            <Link to="/login" className="lnk text-sm">
              Masuk sebagai pemilik
            </Link>
          </div>

          {/* Row 3: Pengawas perikanan */}
          <div className="grid md:grid-cols-[240px_1fr_auto] gap-6 py-8 border-b bd items-start">
            <div>
              <h3 className="text-xl font-medium text-[#0f172a] dark:text-[#f8fafc]">
                Pengawas perikanan
              </h3>
              <p className="text-sm t2 mt-1">Syahbandar dan dinas kelautan</p>
            </div>
            <ul className="space-y-2 t2">
              <li>Peringatan dini saat kuota kapal mendekati batas habis</li>
              <li>Terima data sensor timbangan dermaga secara langsung</li>
              <li>Validasi keaslian laporan dengan bukti segel blockchain</li>
            </ul>
            <Link to="/login" className="lnk text-sm">
              Masuk sebagai pengawas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
