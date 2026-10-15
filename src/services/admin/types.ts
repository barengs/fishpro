// 1. Roles & Permissions
export interface Permission {
  id: number
  name: string
  codename: string
  content_type: number
}

export interface Role {
  id: number
  name: string
  description?: string | null
  permissions?: Permission[]
  permissions_ids?: number[]
  created_at?: string
  updated_at?: string
}

export interface CreateRolePayload {
  name: string
  description?: string
  permissions_ids?: number[]
}

// 2. User Roles
export interface UserRole {
  id: number
  user: string
  role: string
  assigned_at?: string
}

// 3. Menus
export interface Menu {
  id: number
  name: string
  url?: string | null
  icon?: string | null
  parent?: number | null
  order: number
  is_active: boolean
  children?: Menu[]
  created_at?: string
  updated_at?: string
}

export interface CreateMenuPayload {
  name: string
  url?: string
  icon?: string
  parent?: number | null
  order?: number
  is_active?: boolean
}

// 4. Role Menus
export interface RoleMenu {
  id: number
  role: string
  menu: string
  can_view: boolean
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
  assigned_at?: string
}

export interface AssignMenuPayload {
  role_id: number
  menu_id: number
  permissions?: {
    can_view?: boolean
    can_create?: boolean
    can_edit?: boolean
    can_delete?: boolean
  }
}

// 5. Admin Users
export interface AdminUserProfile {
  full_name?: string
  email?: string
  phone?: string
  department?: string
  position?: string
}

export interface AdminUser {
  id: number
  username: string
  email?: string
  first_name?: string
  last_name?: string
  is_active: boolean
  date_joined?: string
  admin_profile?: AdminUserProfile | null
}

export interface RegisterAdminPayload {
  username: string
  password: string
  email?: string
  full_name?: string
  phone?: string
  department?: string
  position?: string
  role?: number | null
}

export interface RegisterRegulatorPayload {
  username: string
  email: string
  password: string
  full_name: string
  phone?: string
  department?: string
  position?: string
}
