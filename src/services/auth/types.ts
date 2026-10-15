export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserProfile {
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

export interface LoginResponse {
  token: string;
  refresh_token?: string;
  user_id: number;
  username: string;
  user_as: "admin" | "owner" | "captain" | "regulator" | "user";
  roles: string[];
  profile?: UserProfile;
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
  profile?: UserProfile;
}
