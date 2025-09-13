const API_BASE_URL = 'http://localhost:8080/api'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'client' | 'performer' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string // JWT token
  refreshToken: string // Refresh token for renewal
  user: User
}

export interface ErrorResponse {
  message: string
  code: number
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: 'client' | 'performer'
}

export interface LoginData {
  email: string
  password: string
}

class AuthAPI {
  private static instance: AuthAPI
  
  public static getInstance(): AuthAPI {
    if (!AuthAPI.instance) {
      AuthAPI.instance = new AuthAPI()
    }
    return AuthAPI.instance
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    let token = this.getToken()
    
    // Check if token is expired and try to refresh it
    if (token && this.isTokenExpired() && endpoint !== '/auth/refresh' && endpoint !== '/auth/login' && endpoint !== '/auth/signup') {
      console.log('[AuthAPI] Token expired, attempting refresh...')
      token = await this.refreshAccessToken()
      if (!token) {
        throw new Error('Authentication failed: Unable to refresh token')
      }
    }

    if (token && !config.headers) {
      config.headers = {}
    }
    if (token) {
      ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    console.log('[AuthAPI] REQUEST DETAILS:')
    console.log('- URL:', url)
    console.log('- JWT Token used:', token ? `${token.substring(0, 50)}...` : 'null')
    console.log('- Headers:', config.headers)

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      console.log('[AuthAPI] RESPONSE DETAILS:')
      console.log('- Status:', response.status)
      console.log('- Response data:', data)

      if (!response.ok) {
        const errorMessage = data.message || `HTTP error! status: ${response.status}`
        const error = new Error(errorMessage)
        // Add status code to error for better handling
        ;(error as Error & { status: number }).status = response.status
        throw error
      }

      return data
    } catch (error) {
      throw error
    }
  }

  public async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    this.setToken(response.token)
    this.setRefreshToken(response.refreshToken)
    this.setCachedUser(response.user)
    return response
  }

  public async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    this.setToken(response.token)
    this.setRefreshToken(response.refreshToken)
    this.setCachedUser(response.user)
    return response
  }

  public async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  public async logout(): Promise<void> {
    // Clean up local storage (no backend call needed for JWT)
    this.removeToken()
    this.removeRefreshToken()
    this.removeCachedUser()
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('artistlk_token') // JWT token
    }
    return null
  }

  public setToken(token: string): void { // JWT token
    if (typeof window !== 'undefined') {
      localStorage.setItem('artistlk_token', token)
    }
  }

  public removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('artistlk_token')
    }
  }

  public getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('artistlk_refresh_token')
    }
    return null
  }

  public setRefreshToken(refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('artistlk_refresh_token', refreshToken)
    }
  }

  public removeRefreshToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('artistlk_refresh_token')
    }
  }

  // Token validation and refresh
  public isTokenExpired(): boolean {
    const token = this.getToken()
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch {
      return true
    }
  }

  public async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await this.request<{ token: string }>('/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      })

      this.setToken(response.token)
      return response.token
    } catch (error) {
      // Refresh token is invalid, clear everything
      this.removeToken()
      this.removeRefreshToken()
      this.removeCachedUser()
      return null
    }
  }

  // -------- Cached user helpers (improves UX on refresh) --------
  private userCacheKey = 'artistlk_user'

  public setCachedUser(user: User) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.userCacheKey, JSON.stringify(user))
      } catch {}
    }
  }

  public getCachedUser(): User | null {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.userCacheKey)
        if (raw) return JSON.parse(raw) as User
      } catch {}
    }
    return null
  }

  public removeCachedUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.userCacheKey)
    }
  }

  // -------- JWT decode (lightweight, no validation, for optimistic hydration) --------
  public decodeToken(): { email?: string; role?: string; userId?: string } | null {
    const token = this.getToken()
    if (!token) return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    try {
      const payload = JSON.parse(atob(parts[1]))
      return {
        email: payload.email,
        role: payload.role,
        userId: payload.userId,
      }
    } catch {
      return null
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false
    
    // Check if token is expired
    if (this.isTokenExpired()) {
      return false
    }
    
    return true
  }

  public async checkHealth(): Promise<{ status: string; timestamp: number }> {
    return this.request<{ status: string; timestamp: number }>('/health')
  }
}

export const authAPI = AuthAPI.getInstance()
