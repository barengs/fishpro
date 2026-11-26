import { usePageTransition } from "../../../../components/PageTransitionContext";

export function RolesSection() {
  const { navigateWithTransition } = usePageTransition();

  return (
    <section className="onboarding-section section-alt" id="peran">
      <div className="onboarding-wrap">
        <h2 className="rv">Setiap peran melihat data yang ia perlukan</h2>
        <div className="roles-container">
          <div className="role-row rv">
            <div>
              <h3>Nahkoda</h3>
              <small>Nahkoda dan awak kapal</small>
            </div>
            <ul>
              <li>Cek sisa kuota ikan yang masih boleh ditangkap</li>
              <li>Lihat rincian hasil timbangan setiap kali bongkar muat</li>
              <li>Periksa nomor izin dan masa berlaku dokumen kapal</li>
            </ul>
            <button
              type="button"
              className="role-link"
              onClick={() => navigateWithTransition("/login")}
            >
              Masuk sebagai nahkoda
            </button>
          </div>

          <div className="role-row rv">
            <div>
              <h3>Pemilik kapal</h3>
              <small>Pengusaha dan pengelola kapal</small>
            </div>
            <ul>
              <li>Lihat status kapal yang sedang melaut atau sandar</li>
              <li>Hitung estimasi tagihan PNBP secara transparan</li>
              <li>Atur penugasan nahkoda untuk setiap unit kapal</li>
            </ul>
            <button
              type="button"
              className="role-link"
              onClick={() => navigateWithTransition("/login")}
            >
              Masuk sebagai pemilik
            </button>
          </div>

          <div className="role-row rv">
            <div>
              <h3>Pengawas perikanan</h3>
              <small>Syahbandar dan dinas kelautan</small>
            </div>
            <ul>
              <li>Peringatan dini saat kuota kapal mendekati batas habis</li>
              <li>Terima data sensor timbangan dermaga secara langsung</li>
              <li>Validasi keaslian laporan dengan bukti segel blockchain</li>
            </ul>
            <button
              type="button"
              className="role-link"
              onClick={() => navigateWithTransition("/login")}
            >
              Masuk sebagai pengawas
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
