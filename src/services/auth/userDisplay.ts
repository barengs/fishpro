import { authService } from "./authService";

export interface UserDisplayInfo {
  name: string;
  initials: string;
  roleLabel: string;
  username: string;
}

export function getUserDisplayInfo(): UserDisplayInfo {
  const user = authService.getStoredUser();

  if (!user) {
    return {
      name: "Tamu",
      initials: "TM",
      roleLabel: "Belum Masuk",
      username: "guest",
    };
  }

  const profile = user.profile;
  const fullName =
    profile?.full_name || profile?.name || user.username || "Pengguna";

  // Calculate initials from name
  const words = fullName.trim().split(/\s+/);
  let initials = "US";
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length > 0) {
    initials = words[0].slice(0, 2).toUpperCase();
  }

  // Format human-friendly role label
  let roleLabel = "Pengguna FCO";
  const rawRole = (user.role || "").toLowerCase();
  const rawRoles = (user.roles || []).map((r) => r.toLowerCase());
  const usernameLower = (user.username || "").toLowerCase();

  const isRegulator =
    rawRole === "regulator" ||
    rawRoles.includes("regulator") ||
    usernameLower.includes("regulator");

  const isAdmin =
    rawRole === "admin" ||
    rawRoles.includes("admin") ||
    usernameLower.startsWith("admin");

  const isCaptain =
    rawRole === "captain" ||
    rawRoles.includes("captain") ||
    usernameLower.includes("captain");

  const isOwner = rawRole === "owner" || rawRoles.includes("owner");

  if (isAdmin) {
    roleLabel = profile?.department
      ? `Admin · ${profile.department}`
      : "Admin KKP";
  } else if (isRegulator) {
    roleLabel = profile?.department
      ? `Pengawas · ${profile.department}`
      : "Pengawas Kuota KKP";
  } else if (isCaptain) {
    roleLabel = profile?.license_number
      ? `Nahkoda (${profile.license_number})`
      : "Nahkoda Kapal";
  } else if (isOwner) {
    roleLabel =
      profile?.owner_type === "company"
        ? "Pemilik (Perusahaan)"
        : "Pemilik Kapal";
  }

  return {
    name: fullName,
    initials,
    roleLabel,
    username: user.username,
  };
}
