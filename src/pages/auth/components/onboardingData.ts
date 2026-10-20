export const reportFields = [
  "Kapal + REG",
  "Tanggal",
  "Jenis (pelagis/demersal/karang)",
  "Lat/Lng GPS",
  "WPP",
  "Spesies",
  "Jumlah (kg)",
  "Nilai (Rp)",
];

export const howItWorks = [
  {
    step: "Lapor",
    who: "Nahkoda, dari kapal",
    body: "8 kolom, 1 menit, dari HP. Terkirim langsung.",
  },
  {
    step: "Hitung",
    who: "Sistem, otomatis",
    body: "PNBP dihitung dari GT kapal dan harga acuan.",
  },
  {
    step: "Segel",
    who: "Blockchain, permanen",
    body: "Tercatat dan tidak bisa diubah diam-diam.",
  },
];

export const roleRows = [
  { name: "Nahkoda", sees: "Kuota kapal · form lapor · riwayat", to: "/login" },
  {
    name: "Pemilik",
    sees: "Armada · nahkoda · sisa kuota · PNBP",
    to: "/login",
  },
  {
    name: "Regulator",
    sees: "Audit kuota · verifikasi · override",
    to: "/login",
  },
  { name: "Admin", sees: "Master kapal · spesies · WPP · peran", to: "/login" },
];

export const faqs = [
  {
    q: "Bagaimana PNBP dihitung?",
    a: "Otomatis dari GT kapal dan harga acuan spesies. Nahkoda tidak menghitung manual.",
  },
  {
    q: "Siapa yang bisa mengubah laporan?",
    a: "Tidak ada. Koreksi hanya lewat laporan baru yang tercatat terpisah.",
  },
  {
    q: "Apa yang terjadi saat kuota menipis?",
    a: "Kapal ditandai di dashboard. Regulator bisa menyesuaikan kuota dengan alasan tercatat.",
  },
];
