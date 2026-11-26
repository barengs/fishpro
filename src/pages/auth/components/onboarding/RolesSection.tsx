import { usePageTransition } from "../../../../components/PageTransitionContext";

export function RolesSection() {
  const { navigateWithTransition } = usePageTransition();

  return (
    <section className="onboarding-section section-alt" id="peran">
      <div className="onboarding-wrap">
        <h2 className="rv">Setiap pengguna melihat data sesuai perannya</h2>
        <div className="roles-container">
          <div className="role-row rv">
            <div>
              <h3>Nahkoda</h3>
              <small>Nahkoda &amp; awak kapal</small>
            </div>
            <ul>
              <li>Pantau sisa kuota tangkap kapal yang masih tersedia</li>
              <li>Lihat rincian hasil timbangan tiap selesai bongkar muat</li>
              <li>Cek nomor registrasi dan masa berlaku dokumen kapal</li>
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
              <small>Pengusaha &amp; pengelola armada</small>
            </div>
            <ul>
              <li>Pantau kapal yang sedang melaut maupun bersandar</li>
              <li>Lihat perkiraan tagihan PNBP secara jelas sebelum pelunasan</li>
              <li>Atur penugasan nahkoda untuk tiap kapal</li>
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
              <small>Syahbandar &amp; petugas pelabuhan</small>
            </div>
            <ul>
              <li>Terima peringatan saat kuota kapal mendekati batas habis</li>
              <li>Baca data bobot langsung dari timbangan di dermaga</li>
              <li>Pastikan keaslian laporan lewat verifikasi rantai blok</li>
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
