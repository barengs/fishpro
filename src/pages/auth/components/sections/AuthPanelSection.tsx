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
        <p className="quote">Timbangan dermaga, armada, dan perizinan dalam satu alur.</p>
        <p className="sub">
          Laporkan hasil bongkar muat dari pelabuhan, pantau masa berlaku izin kapal, dan siapkan rekap tangkapan tanpa tulis ulang.
        </p>
      </div>

      <div className={`copy ${currentView === "daftar" ? "" : "off"}`} id="copy-daftar">
        <p className="quote">Akun aktif begitu data kapal selesai diverifikasi.</p>
        <p className="sub">
          Setelah mendaftar, lengkapi data kapal dan dokumen perizinan dari dashboard. Sudah terdaftar?
        </p>
        <button className="btn-ghost" type="button" onClick={() => onNavigateTo("/login")}>
          Masuk
        </button>
      </div>

      <div className={`copy ${currentView === "lupa" ? "" : "off"}`} id="copy-lupa">
        <p className="quote">Jaga keamanan akses akun dan data armada Anda.</p>
        <p className="sub">
          Demi keamanan operasional kapal, tautan pemulihan hanya berlaku untuk waktu terbatas.
        </p>
        <button className="btn-ghost" type="button" onClick={() => onNavigateTo("/login")}>
          Kembali ke Masuk
        </button>
      </div>
    </aside>
  );
}
