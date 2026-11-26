import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Isi nama pengguna atau nomor registrasi.")
    .min(3, "Nama pengguna minimal 3 karakter."),
  password: z
    .string()
    .min(1, "Isi kata sandi Anda.")
    .min(6, "Kata sandi minimal 6 karakter."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const shipFormSchema = z.object({
  name: z.string().trim().min(2, "Nama kapal minimal 2 karakter."),
  registration_number: z
    .string()
    .trim()
    .min(3, "Nomor registrasi kapal minimal 3 karakter."),
  gross_tonnage: z
    .string()
    .trim()
    .min(1, "Isi kapasitas Gross Tonnage (GT) kapal.")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Gross Tonnage (GT) harus lebih besar dari 0.",
    }),
});

export type ShipInput = z.infer<typeof shipFormSchema>;

export const catchStep1Schema = z.object({
  catch_date: z.string().min(1, "Pilih tanggal penangkapan."),
  catch_type: z.enum(["pelagic", "demersal", "reef"], {
    message: "Pilih jenis tangkapan yang sesuai.",
  }),
  location_latitude: z
    .string()
    .min(1, "Isi koordinat latitude.")
    .refine(
      (v) =>
        !isNaN(parseFloat(v)) && parseFloat(v) >= -90 && parseFloat(v) <= 90,
      {
        message: "Latitude harus berada di antara -90 dan 90 derajat.",
      },
    ),
  location_longitude: z
    .string()
    .min(1, "Isi koordinat longitude.")
    .refine(
      (v) =>
        !isNaN(parseFloat(v)) && parseFloat(v) >= -180 && parseFloat(v) <= 180,
      {
        message: "Longitude harus berada di antara -180 dan 180 derajat.",
      },
    ),
});

export const catchStep2Schema = z.object({
  fish_species: z.string().trim().min(1, "Pilih spesies ikan terlebih dahulu."),
  wpp: z.string().trim().min(1, "Pilih wilayah tangkap (WPP)."),
  quantity: z
    .string()
    .trim()
    .min(1, "Isi berat atau volume tangkapan.")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Volume tangkapan harus lebih dari 0.",
    }),
  value: z
    .string()
    .trim()
    .min(1, "Isi perkiraan nilai tangkapan.")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: "Perkiraan nilai harus berupa angka yang valid.",
    }),
});

export const ownerSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Nama pemilik atau perusahaan minimal 2 karakter."),
  email: z.string().trim().email("Format alamat email belum valid.").or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(6, "Nomor telepon minimal 6 digit.")
    .or(z.literal("")),
});

export const captainSchema = z.object({
  full_name: z.string().trim().min(2, "Nama nahkoda minimal 2 karakter."),
  license_number: z
    .string()
    .trim()
    .min(3, "Nomor lisensi nahkoda minimal 3 karakter."),
  owner: z.number().positive("Pilih pemilik kapal terlebih dahulu."),
  email: z.string().trim().email("Format alamat email belum valid.").or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(6, "Nomor telepon minimal 6 digit.")
    .or(z.literal("")),
});

export const areaSchema = z.object({
  nama: z.string().trim().min(2, "Nama wilayah (WPP) minimal 2 karakter."),
  code: z.string().trim().min(2, "Kode wilayah minimal 2 karakter."),
});

export const speciesSchema = z.object({
  name: z.string().trim().min(2, "Nama spesies ikan minimal 2 karakter."),
  scientific_name: z.string().trim().optional(),
});

export const fishSchema = z.object({
  species: z.number().positive("Pilih spesies ikan terlebih dahulu."),
  name: z.string().trim().optional(),
  weight: z
    .string()
    .trim()
    .refine((v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) > 0), {
      message: "Berat ikan harus lebih dari 0.",
    })
    .optional(),
});

export const roleSchema = z.object({
  name: z.string().trim().min(2, "Nama peran minimal 2 karakter."),
});

export const menuSchema = z.object({
  name: z.string().trim().min(2, "Nama menu minimal 2 karakter."),
  url: z.string().trim().min(1, "Isi URL rute menu."),
});

export const adminUserSchema = z.object({
  username: z.string().trim().min(3, "Nama pengguna minimal 3 karakter."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
  email: z.string().trim().email("Format alamat email belum valid."),
  full_name: z.string().trim().min(2, "Nama lengkap minimal 2 karakter."),
});

export const registerStep1Schema = z.object({
  role: z.enum(["owner", "captain"]),
  fullName: z.string().trim().min(2, "Nama lengkap minimal 2 karakter."),
  companyName: z.string().trim().optional(),
});

export const registerStep2Schema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Nama pengguna minimal 3 karakter.")
      .regex(
        /^[a-zA-Z0-9_.-]+$/,
        "Nama pengguna hanya boleh berisi huruf, angka, titik (.), tanda hubung (-), atau garis bawah (_).",
      ),
    email: z.string().trim().email("Format alamat email belum valid."),
    phone: z.string().trim().min(8, "Nomor telepon minimal 8 digit."),
    password: z.string().min(8, "Kata sandi minimal 8 karakter."),
    passwordConfirm: z
      .string()
      .min(8, "Konfirmasi kata sandi minimal 8 karakter."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Konfirmasi kata sandi belum cocok.",
    path: ["passwordConfirm"],
  });
