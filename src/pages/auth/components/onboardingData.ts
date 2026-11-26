import {
  Anchor,
  BarChart3,
  Building2,
  Cpu,
  Link2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface PillarCard {
  id: string;
  category: string;
  title: string;
  desc: string;
  badge: string;
  gradient: string;
  accentColor: string;
  icon: typeof ShieldCheck;
  metric: string;
  metricLabel: string;
}

export const pillarCards: PillarCard[] = [
  {
    id: "iot",
    category: "Dermaga Pelabuhan",
    title: "Timbangan Digital Terhubung",
    desc: "Setiap kali ikan ditimbang saat bongkar muat, angka berat langsung masuk ke FishPro tanpa perlu rekap manual di kertas.",
    badge: "IoT Dermaga",
    gradient: "from-blue-600 to-indigo-700",
    accentColor: "#1A56DB",
    icon: Cpu,
    metric: "0.2 detik",
    metricLabel: "Waktu pencatatan",
  },
  {
    id: "blockchain",
    category: "Keamanan Data",
    title: "Catatan Terjaga Anti-Ubah",
    desc: "Setiap laporan timbangan dilindungi rantai blok sehingga angka bobot dan tanggalnya tidak bisa diubah maupun dihapus sepihak.",
    badge: "Blockchain",
    gradient: "from-emerald-600 to-teal-700",
    accentColor: "#059669",
    icon: Link2,
    metric: "100%",
    metricLabel: "Bebas manipulasi",
  },
  {
    id: "ai-quota",
    category: "Kelestarian Laut",
    title: "Rekomendasi Kuota Kapal",
    desc: "Perhitungan kuota membaca tren tangkapan sebelumnya untuk menjaga batas tangkap tetap aman dan berkelanjutan.",
    badge: "Prediksi Cerdas",
    gradient: "from-purple-600 to-fuchsia-700",
    accentColor: "#7C3AED",
    icon: BarChart3,
    metric: "94.5%",
    metricLabel: "Akurasi model",
  },
  {
    id: "pnbp",
    category: "Keuangan Resmi",
    title: "Perhitungan PNBP Seketika",
    desc: "Tarif pungutan negara langsung dihitung berdasarkan berat tangkapan dan ukuran GT kapal mengikuti regulasi KKP.",
    badge: "PNBP Resmi",
    gradient: "from-amber-500 to-orange-600",
    accentColor: "#D97706",
    icon: Zap,
    metric: "Otomatis",
    metricLabel: "Dari berat timbangan",
  },
  {
    id: "fleet",
    category: "Manajemen Armada",
    title: "Kelola Kapal & Nahkoda",
    desc: "Pantau sisa kuota tangkap, masa berlaku izin berlayar, dan riwayat bongkar muat seluruh armada dari satu layar.",
    badge: "Armada Kapal",
    gradient: "from-cyan-600 to-blue-700",
    accentColor: "#0891B2",
    icon: Anchor,
    metric: "1.280+",
    metricLabel: "Kapal terdaftar",
  },
];

export const roleCards = [
  {
    role: "Nahkoda",
    slug: "captain",
    title: "Nahkoda",
    subtitle: "Untuk Nahkoda & Awak Kapal",
    summary:
      "Cek sisa kuota tangkap tahun ini, lihat bukti timbangan pelabuhan, dan pastikan izin berlayar kapal masih aktif langsung dari ponsel.",
    icon: Anchor,
    tag: "Di Laut",
    features: [
      "Pantau sisa kuota ikan yang masih boleh ditangkap",
      "Lihat rincian hasil timbangan tiap selesai bongkar muat",
      "Cek nomor izin dan masa berlaku dokumen kapal",
    ],
  },
  {
    role: "Pemilik",
    slug: "owner",
    title: "Pemilik Kapal",
    subtitle: "Untuk Pengusaha & Pengelola Armada",
    summary:
      "Pantau pergerakan seluruh armada, atur nahkoda yang bertugas, dan ketahui perkiraan tagihan PNBP sebelum kapal bersandar.",
    icon: Building2,
    tag: "Usaha Kapal",
    features: [
      "Pantau kapal yang sedang melaut maupun bersandar",
      "Lihat perkiraan tagihan PNBP secara jelas sebelum pelunasan",
      "Atur penugasan nahkoda untuk tiap kapal",
    ],
  },
  {
    role: "Pengawas",
    slug: "regulator",
    title: "Pengawas Perikanan",
    subtitle: "Untuk Syahbandar & Dinas Kelautan",
    summary:
      "Awasi kepatuhan kuota kapal di pelabuhan, verifikasi hasil timbangan langsung di dermaga, dan cegah pelanggaran batas muatan.",
    icon: ShieldCheck,
    tag: "Pengawasan",
    features: [
      "Terima peringatan saat kuota kapal mendekati batas habis",
      "Baca data bobot langsung dari timbangan di dermaga",
      "Pastikan keaslian laporan lewat verifikasi rantai blok",
    ],
  },
];

export const onboardingFaqs = [
  {
    q: "Bagaimana alur penimbangan ikan di pelabuhan?",
    a: "Hasil tangkapan ditimbang di dermaga dengan perangkat digital yang terhubung ke FishPro. Bobot ikan langsung terbaca, tagihan PNBP ikut dihitung, dan sisa kuota kapal terbarui tanpa formulir kertas.",
  },
  {
    q: "Apakah data timbangan bisa diubah setelah tersimpan?",
    a: "Tidak bisa. Setelah tersimpan, catatan langsung dilindungi blockchain agar bobot, data kapal, dan waktunya tidak bisa diubah atau dihapus sepihak.",
  },
  {
    q: "Bagaimana cara sistem memperkirakan kuota tangkapan?",
    a: "FishPro membaca riwayat tangkapan bulan-bulan sebelumnya bersama batas wilayah tangkap (WPP) untuk menyusun rekomendasi kuota yang seimbang antara hasil tangkap dan kelestarian laut.",
  },
  {
    q: "Bagaimana cara mendaftar akun FishPro?",
    a: "Pilih Daftar di bagian atas halaman, tentukan peran akun Anda (Pemilik Kapal atau Nahkoda), lalu isi formulir singkat. Untuk pengawas dan petugas pelabuhan, akun disiapkan langsung oleh administrator.",
  },
];
