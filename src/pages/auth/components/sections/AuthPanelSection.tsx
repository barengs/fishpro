import { ShipScene } from "../ShipScene";

interface AuthPanelSectionProps {
  currentView: "masuk" | "daftar" | "lupa";
  onNavigateTo: (path: string) => void;
}

export function AuthPanelSection({ currentView, onNavigateTo }: AuthPanelSectionProps) {
  return (
    <aside
      className="panel"
      id="panel"
      aria-label="Tentang FishPro"
    >
      <ShipScene />

      <div className={`copy ${currentView === "masuk" ? "" : "off"}`} id="copy-masuk">
        <p className="quote">Data timbangan, armada, dan izin laut dalam satu tempat.</p>
        <p className="sub">
          Catat hasil tangkapan di pelabuhan, pantau status izin kapal, dan siapkan laporan tanpa rekap manual.
        </p>
      </div>

      <div className={`copy ${currentView === "daftar" ? "" : "off"}`} id="copy-daftar">
        <p className="quote">Akun baru siap dipakai begitu data kapal Anda terverifikasi.</p>
        <p className="sub">
          Setelah mendaftar, tambahkan kapal dan dokumen perizinan dari dashboard. Sudah punya akun? Masuk di sini.
        </p>
        <button className="btn-ghost" type="button" onClick={() => onNavigateTo("/login")}>
          Masuk
        </button>
      </div>

      <div className={`copy ${currentView === "lupa" ? "" : "off"}`} id="copy-lupa">
        <p className="quote">Keamanan akun dan data armada Anda adalah prioritas kami.</p>
        <p className="sub">
          Tautan pemulihan hanya berlaku terbatas untuk memastikan akses operasional kapal Anda tetap terlindungi.
        </p>
        <button className="btn-ghost" type="button" onClick={() => onNavigateTo("/login")}>
          Kembali ke Masuk
        </button>
      </div>
    </aside>
  );
}
