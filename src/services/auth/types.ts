export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserProfile {
  id?: number;
  owner_id?: number;
  type?: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  owner_type?: string;
  address?: string;
  license_number?: string;
  years_of_experience?: number;
}

export interface UserPermittedMenu {
  name: string;
  url: string;
  icon?: string;
  can_view?: boolean;
  can_create?: boolean;
  can_edit?: boolean;
  can_delete?: boolean;
}

export interface LoginResponse {
  token: string;
  refresh_token?: string;
  user_id: number;
  username: string;
  user_as: "superadmin" | "admin" | "owner" | "captain" | "regulator" | "user";
  roles: string[];
  profile?: UserProfile;
  menus?: UserPermittedMenu[];
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  role?: "owner" | "captain" | "admin" | string;
  full_name?: string;
  phone?: string;
  contact_info?: string;
  address?: string;
  ship_code?: string;
  owner_type?: "individual" | "company";
}

export interface RegisterResponse {
  token: string;
  user_id: number;
  username: string;
  role: string;
  profile?: UserProfile;
}

export interface StoredUser {
  id: number;
  username: string;
  role: string;
  roles?: string[];
  is_superuser?: boolean;
  profile?: UserProfile;
  menus?: UserPermittedMenu[];
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
}

export interface PasswordResetRequestPayload {
  identifier: string;
}

export interface PasswordResetRequestResponse {
  success: boolean;
  message: string;
  identifier: string;
  masked_email?: string;
  otp_preview?: string;
}

export interface PasswordResetVerifyPayload {
  identifier: string;
  otp: string;
}

export interface PasswordResetVerifyResponse {
  success: boolean;
  message: string;
  reset_token: string;
}

export interface PasswordResetConfirmPayload {
  identifier?: string;
  otp?: string;
  reset_token?: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetConfirmResponse {
  success: boolean;
  message: string;
}

