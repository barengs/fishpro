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
    category: "Terminal Dermaga",
    title: "Timbangan Cerdas IoT",
    desc: "Penimbangan ikan terintegrasi sensor pelabuhan. Berat terkunci real-time dan bebas manipulasi.",
    badge: "Hardware & Sensor",
    gradient: "from-blue-600 to-indigo-700",
    accentColor: "#1A56DB",
    icon: Cpu,
    metric: "0.2s",
    metricLabel: "Sinkronisasi bobot",
  },
  {
    id: "blockchain",
    category: "Audit & Imutabilitas",
    title: "Buku Besar SHA-256",
    desc: "Setiap laporan penangkapan disegel permanen ke buku besar blockchain terdistribusi nasional.",
    badge: "Keamanan Kriptografi",
    gradient: "from-emerald-600 to-teal-700",
    accentColor: "#059669",
    icon: Link2,
    metric: "100%",
    metricLabel: "Integritas tamper-proof",
  },
  {
    id: "ai-quota",
    category: "Regulasi & Kelestarian",
    title: "Prediksi Kuota AI",
    desc: "Optimasi kuota penangkapan lestari berbasis algoritma deret waktu LSTM dan NSGA-III multi-objektif.",
    badge: "Kecerdasan Buatan",
    gradient: "from-purple-600 to-fuchsia-700",
    accentColor: "#7C3AED",
    icon: BarChart3,
    metric: "94.5%",
    metricLabel: "Akurasi model",
  },
  {
    id: "pnbp",
    category: "Keuangan Negara",
    title: "Kalkulasi PNBP Instan",
    desc: "Perhitungan otomatis tarif penerimaan negara bukan pajak berdasarkan formula resmi GT kapal.",
    badge: "Otomasi Tarif",
    gradient: "from-amber-500 to-orange-600",
    accentColor: "#D97706",
    icon: Zap,
    metric: "Otomatis",
    metricLabel: "Tanpa hitung manual",
  },
  {
    id: "fleet",
    category: "Operasional Laut",
    title: "Manajemen Armada Terpadu",
    desc: "Pantau kesiapan izin berlayar SIPI, penugasan nahkoda, dan histori tangkapan dari satu pintu.",
    badge: "Armada & Nahkoda",
    gradient: "from-cyan-600 to-blue-700",
    accentColor: "#0891B2",
    icon: Anchor,
    metric: "1.280+",
    metricLabel: "Kapal terpantau",
  },
];

export const roleCards = [
  {
    role: "Nahkoda",
    slug: "captain",
    title: "Nahkoda Kapal",
    subtitle: "Operasional Melaut & Verifikasi",
    summary:
      "Pantau sisa kuota kapal tahun berjalan, cek histori penimbangan dermaga, dan akses data perizinan SIPI langsung dari ponsel.",
    icon: Anchor,
    tag: "Operasional",
    features: [
      "Pantauan sisa kuota aman penangkapan",
      "Riwayat tangkapan tersegel blockchain",
      "Detail spesifikasi & status perizinan kapal",
    ],
  },
  {
    role: "Pemilik",
    slug: "owner",
    title: "Pemilik Kapal & Badan Usaha",
    subtitle: "Armada, Nahkoda & Finansial",
    summary:
      "Kelola seluruh armada kapal, pantau penugasan nahkoda berlisensi, kalkulasi akumulasi PNBP, dan pantau proyeksi bisnis hasil laut.",
    icon: Building2,
    tag: "Bisnis Armada",
    features: [
      "Ringkasan agregat armada kapal aktif",
      "Kalkulasi estimasi kewajiban PNBP",
      "Penunjukan dan rotasi nahkoda berlisensi",
    ],
  },
  {
    role: "Regulator",
    slug: "regulator",
    title: "Pengawas & Regulator KKP",
    subtitle: "Audit Kepatuhan & AI Override",
    summary:
      "Audit kepatuhan kuota kapal nasional, monitor timbangan cerdas dermaga secara live, dan sesuaikan kuota dengan asistensi AI.",
    icon: ShieldCheck,
    tag: "Pengawasan",
    features: [
      "Radar kapal kritis & over-quota nasional",
      "Terminal timbangan pintar IoT real-time",
      "Instrumen optimasi kuota lestari (LSTM + NSGA-III)",
    ],
  },
];

export const onboardingFaqs = [
  {
    q: "Bagaimana cara kerja pencatatan tangkapan di pelabuhan?",
    a: "Keranjang hasil tangkapan ditimbang di timbangan pintar IoT dermaga. Bobot terkirim secara instan ke server, dihitung otomatis nilai PNBP-nya, dan disegel permanen ke buku besar blockchain SHA-256.",
  },
  {
    q: "Apakah data tangkapan yang sudah masuk bisa diubah atau dimanipulasi?",
    a: "Tidak bisa. Setiap transaksi penangkapan memiliki hash kriptografi unik yang terhubung dengan blok sebelumnya. Setiap upaya manipulasi data akan langsung menggagalkan validitas rantai blok secara otomatis.",
  },
  {
    q: "Bagaimana AI membantu penentuan kuota penangkapan ikan?",
    a: "Sistem memanfaatkan kombinasi algoritma LSTM (untuk menganalisis tren tangkapan musiman historis) dan NSGA-III (untuk mengoptimalkan kelestarian stok ikan di zona WPP), memberikan rekomendasi kuota aman bagi regulator.",
  },
  {
    q: "Bagaimana cara mendaftarkan kapal atau akun baru?",
    a: "Klik tombol 'Mulai Sekarang' di bagian atas. Ikuti 4 langkah registrasi terpadu dengan menyiapkan nomor izin SIPI atau lisensi nahkoda. Akun langsung aktif setelah verifikasi.",
  },
];
