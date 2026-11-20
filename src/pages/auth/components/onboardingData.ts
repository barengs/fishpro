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
    desc: "Ikan ditimbang di dermaga, angkanya langsung masuk ke sistem detik itu juga tanpa perlu dicatat manual pakai kertas.",
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
    title: "Segel Catatan Anti-Ubah",
    desc: "Setiap laporan hasil timbang langsung disegel dengan kriptografi rantai blok. Angka berat dan tanggal tidak bisa diedit atau dihapus sepihak.",
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
    desc: "Kalkulasi berbasis tren tangkapan bulan-bulan sebelumnya untuk memperkirakan batas aman agar populasi ikan tetap terjaga.",
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
    title: "Kalkulasi PNBP Otomatis",
    desc: "Tarif pungutan resmi negara langsung dihitung dari berat bersih (netto) dan ukuran GT kapal, sesuai acuan resmi KKP.",
    badge: "PNBP Resmi",
    gradient: "from-amber-500 to-orange-600",
    accentColor: "#D97706",
    icon: Zap,
    metric: "Otomatis",
    metricLabel: "Berdasarkan berat netto",
  },
  {
    id: "fleet",
    category: "Manajemen Armada",
    title: "Kelola Kapal & Nahkoda",
    desc: "Periksa sisa kuota tangkapan, masa berlaku izin berlayar, dan riwayat penimbangan seluruh armada di satu layar.",
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
      "Cek sisa kuota kapal tahun ini, lihat bukti timbangan dari dermaga, dan pastikan masa berlaku dokumen kapal masih aman langsung lewat HP.",
    icon: Anchor,
    tag: "Di Laut",
    features: [
      "Cek sisa kuota ikan yang masih boleh ditangkap",
      "Lihat rincian hasil timbangan setiap kali bongkar muat",
      "Periksa nomor izin dan masa berlaku dokumen kapal",
    ],
  },
  {
    role: "Pemilik",
    slug: "owner",
    title: "Pemilik Kapal",
    subtitle: "Untuk Pengusaha & Pengelola Kapal",
    summary:
      "Pantau operasional seluruh armada, tentukan nahkoda yang bertugas, dan ketahui estimasi biaya resmi PNBP sebelum kapal sandar.",
    icon: Building2,
    tag: "Usaha Kapal",
    features: [
      "Lihat status kapal yang sedang melaut atau sandar",
      "Hitung estimasi tagihan PNBP secara transparan",
      "Atur penugasan nahkoda untuk setiap unit kapal",
    ],
  },
  {
    role: "Pengawas",
    slug: "regulator",
    title: "Pengawas Perikanan",
    subtitle: "Untuk Syahbandar & Dinas Kelautan",
    summary:
      "Awasi kepatuhan kuota kapal di pelabuhan, verifikasi hasil timbangan secara langsung di dermaga, dan cegah pelanggaran batas muatan.",
    icon: ShieldCheck,
    tag: "Pengawasan",
    features: [
      "Peringatan dini saat kuota kapal mendekati batas habis",
      "Terima data sensor timbangan dermaga secara langsung",
      "Validasi keaslian laporan dengan bukti segel blockchain",
    ],
  },
];

export const onboardingFaqs = [
  {
    q: "Bagaimana alur penimbangan ikan di pelabuhan?",
    a: "Ikan ditimbang di timbangan dermaga yang terhubung ke sistem. Berat kotor dan tara wadah otomatis terbaca, tarif PNBP langsung muncul, dan kuota kapal terpotong otomatis tanpa perlu formulir kertas.",
  },
  {
    q: "Apakah angka hasil timbangan bisa diubah setelah disimpan?",
    a: "Sama sekali tidak bisa. Begitu disimpan, catatan langsung disegel dengan blockchain. Berat ikan, nama kapal, dan waktu timbang terkunci permanen demi keadilan nelayan dan kepatuhan pelabuhan.",
  },
  {
    q: "Bagaimana cara sistem memperkirakan kuota tangkapan?",
    a: "Sistem membaca data historis tangkapan bulan-bulan sebelumnya serta batas wilayah tangkap (WPP), lalu memberikan rekomendasi kuota yang seimbang antara hasil tangkapan dan kelestarian laut.",
  },
  {
    q: "Bagaimana cara mendaftar ke sistem?",
    a: "Klik tombol 'Daftar' di bagian atas halaman, pilih jenis peran akun Anda (Nahkoda, Pemilik Kapal, atau Pengawas), lalu ikuti formulir pendaftaran singkat dengan melampirkan nomor izin resmi.",
  },
];
