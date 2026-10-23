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
    category: "Di Pelabuhan",
    title: "Timbangan Otomatis",
    desc: "Timbang ikan langsung di dermaga. Angka tercatat otomatis di sistem tanpa perlu dicatat manual.",
    badge: "Alat Timbang",
    gradient: "from-blue-600 to-indigo-700",
    accentColor: "#1A56DB",
    icon: Cpu,
    metric: "0.2 detik",
    metricLabel: "Langsung tersimpan",
  },
  {
    id: "blockchain",
    category: "Keamanan Catatan",
    title: "Catatan Anti-Ubah",
    desc: "Semua laporan tangkapan terkunci aman. Data tidak bisa diedit atau dihapus sepihak.",
    badge: "Keamanan Data",
    gradient: "from-emerald-600 to-teal-700",
    accentColor: "#059669",
    icon: Link2,
    metric: "100%",
    metricLabel: "Asli & terpercaya",
  },
  {
    id: "ai-quota",
    category: "Kelestarian Laut",
    title: "Perkiraan Kuota Cerdas",
    desc: "Bantuan hitungan pintar untuk memperkirakan batas tangkapan yang aman agar stok ikan tetap terjaga.",
    badge: "Hitungan Cerdas",
    gradient: "from-purple-600 to-fuchsia-700",
    accentColor: "#7C3AED",
    icon: BarChart3,
    metric: "94.5%",
    metricLabel: "Tingkat ketepatan",
  },
  {
    id: "pnbp",
    category: "Pungutan Resmi",
    title: "Hitung PNBP Otomatis",
    desc: "Tagihan penerimaan negara langsung dihitung otomatis sesuai ukuran kapal dan jenis ikan.",
    badge: "Otomatis",
    gradient: "from-amber-500 to-orange-600",
    accentColor: "#D97706",
    icon: Zap,
    metric: "Praktis",
    metricLabel: "Tanpa hitung manual",
  },
  {
    id: "fleet",
    category: "Operasional",
    title: "Pantau Semua Kapal",
    desc: "Cek izin berlayar, nahkoda yang bertugas, dan riwayat tangkapan kapal dalam satu layar.",
    badge: "Kapal & Nahkoda",
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
    subtitle: "Untuk yang Berlayar di Laut",
    summary:
      "Cek sisa kuota kapal tahun ini, lihat riwayat timbangan di dermaga, dan cek surat izin kapal langsung dari HP.",
    icon: Anchor,
    tag: "Di Laut",
    features: [
      "Pantau sisa kuota yang masih boleh ditangkap",
      "Lihat catatan hasil timbangan yang sudah masuk",
      "Cek surat izin dan ukuran kapal",
    ],
  },
  {
    role: "Pemilik",
    slug: "owner",
    title: "Pemilik Kapal",
    subtitle: "Untuk Pengelola Armada",
    summary:
      "Pantau semua kapal milik Anda, atur nahkoda yang bertugas, dan ketahui perkiraan biaya resmi PNBP.",
    icon: Building2,
    tag: "Usaha Kapal",
    features: [
      "Pantau kapal yang sedang melaut atau sandar",
      "Perkiraan biaya resmi yang perlu disiapkan",
      "Atur penugasan nahkoda untuk setiap kapal",
    ],
  },
  {
    role: "Pengawas",
    slug: "regulator",
    title: "Pengawas Perikanan",
    subtitle: "Untuk Petugas Lapangan & Dinas",
    summary:
      "Pantau kepatuhan kuota kapal di pelabuhan, cek timbangan dermaga secara langsung, dan sesuaikan kuota bila perlu.",
    icon: ShieldCheck,
    tag: "Pengawasan",
    features: [
      "Deteksi kapal yang kuotanya hampir habis",
      "Pantau timbangan pelabuhan secara langsung",
      "Bantuan rekomendasi batas kuota yang aman",
    ],
  },
];

export const onboardingFaqs = [
  {
    q: "Bagaimana cara mencatat tangkapan di pelabuhan?",
    a: "Ikan cukup ditimbang di timbangan pelabuhan yang sudah terhubung. Beratnya langsung masuk ke sistem, biaya resminya otomatis terhitung, dan catatannya tersimpan aman.",
  },
  {
    q: "Apakah data hasil tangkapan bisa diubah atau dihapus?",
    a: "Tidak bisa. Catatan yang sudah masuk langsung terkunci di sistem. Tidak ada yang bisa mengubah angka berat atau data kapal secara sepihak.",
  },
  {
    q: "Bagaimana sistem membantu menentukan kuota tangkapan?",
    a: "Sistem membaca kebiasaan hasil tangkapan di bulan-bulan sebelumnya dan kondisi perairan, lalu memberi saran batas aman agar ikan tidak habis.",
  },
  {
    q: "Bagaimana cara mendaftarkan kapal atau akun baru?",
    a: "Klik tombol 'Mulai Sekarang' atau 'Daftar' di bagian atas. Cukup ikuti langkah pendaftaran dan siapkan nomor izin kapal atau nomor lisensi nahkoda.",
  },
];
