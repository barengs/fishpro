import { apiClient, API_ENDPOINTS } from './api'

export interface LoginCredentials {
  username: string
  password: string
}

export interface UserProfile {
  type?: string
  full_name?: string
  name?: string
  email?: string
  phone?: string
  department?: string
  position?: string
  owner_type?: string
  address?: string
  license_number?: string
  years_of_experience?: number
}

export interface LoginResponse {
  token: string
  refresh_token?: string
  user_id: number
  username: string
  user_as: 'admin' | 'owner' | 'captain' | 'regulator' | 'user'
  roles: string[]
  profile?: UserProfile
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  password_confirm: string
  role?: 'owner' | 'captain' | 'admin' | string
  full_name?: string
  phone?: string
  contact_info?: string
  address?: string
  ship_code?: string
  owner_type?: 'individual' | 'company'
}

export interface RegisterResponse {
  token: string
  user_id: number
  username: string
  role: string
  profile?: UserProfile
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const data = await apiClient<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('auth_token', data.token)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      localStorage.setItem('user_as', data.user_as)
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user_id,
          username: data.username,
          role: data.user_as,
          roles: data.roles || [data.user_as],
          profile: data.profile,
        })
      )
    }

    return data
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const data = await apiClient<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_as', data.role)
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user_id,
          username: data.username,
          role: data.role,
          roles: [data.role],
          profile: data.profile,
        })
      )
    }

    return data
  },

  async logout(): Promise<void> {
    try {
      await apiClient(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      })
    } catch {
      // Ignored: cleanup locally even if server token is already expired
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_as')
      localStorage.removeItem('user')
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token') || localStorage.getItem('auth_token')
  },

  getUserRole(): string | null {
    return localStorage.getItem('user_as')
  },

  getStoredUser(): { id: number; username: string; role: string; profile?: UserProfile } | null {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken())
  },
}
