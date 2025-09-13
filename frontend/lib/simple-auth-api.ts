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
  sessionId: string
  user: User
}

export interface LoginData {
  email: string
  password: string
}

class SimpleAuthAPI {
  private static instance: SimpleAuthAPI
  
  public static getInstance(): SimpleAuthAPI {
    if (!SimpleAuthAPI.instance) {
      SimpleAuthAPI.instance = new SimpleAuthAPI()
    }
    return SimpleAuthAPI.instance
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

    // Add session ID to headers if available
    const sessionId = this.getSessionId()
    if (sessionId) {
      (config.headers as Record<string, string>)['Session-Id'] = sessionId
    }

    console.log('[SimpleAuth] Request:', url, config)

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      console.log('[SimpleAuth] Response:', response.status, data)

      if (!response.ok) {
        const error = new Error(data.message || `HTTP error! status: ${response.status}`)
        ;(error as Error & { status: number }).status = response.status
        throw error
      }

      return data
    } catch (error) {
      console.error('[SimpleAuth] Request failed:', error)
      throw error
    }
  }

  public async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    // Store session ID
    this.setSessionId(response.sessionId)
    this.setCachedUser(response.user)
    return response
  }

  public async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      this.removeSessionId()
      this.removeCachedUser()
    }
  }

  public async createDemoUser(): Promise<Record<string, unknown>> {
    return this.request('/auth/create-demo-user', { method: 'POST' })
  }

  // Session management
  public getSessionId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('simple_session_id')
    }
    return null
  }

  public setSessionId(sessionId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simple_session_id', sessionId)
    }
  }

  public removeSessionId(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('simple_session_id')
    }
  }

  // User caching for better UX
  private userCacheKey = 'simple_cached_user'

  public setCachedUser(user: User): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.userCacheKey, JSON.stringify(user))
      } catch (error) {
        console.error('Failed to cache user:', error)
      }
    }
  }

  public getCachedUser(): User | null {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.userCacheKey)
        if (raw) return JSON.parse(raw) as User
      } catch (error) {
        console.error('Failed to get cached user:', error)
      }
    }
    return null
  }

  public removeCachedUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.userCacheKey)
    }
  }

  public isAuthenticated(): boolean {
    return this.getSessionId() !== null
  }

  public async checkHealth(): Promise<{ status: string; timestamp: number }> {
    return this.request<{ status: string; timestamp: number }>('/health')
  }
}

export const simpleAuthAPI = SimpleAuthAPI.getInstance()
