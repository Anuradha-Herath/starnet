/**
 * Authentication API Client
 * 
 * Handles all HTTP requests to the authentication backend
 * Includes automatic token refresh and error handling
 */

import type { User, AuthResponse, SignupData, LoginData } from './types'
import { tokenStorage, isTokenExpired } from './token-manager'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api'

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Authentication API Client
 */
class AuthAPIClient {
  private static instance: AuthAPIClient
  private isRefreshing = false
  private refreshPromise: Promise<string | null> | null = null

  private constructor() {}

  static getInstance(): AuthAPIClient {
    if (!AuthAPIClient.instance) {
      AuthAPIClient.instance = new AuthAPIClient()
    }
    return AuthAPIClient.instance
  }

  /**
   * Make an authenticated HTTP request
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Handle token refresh for authenticated requests
    let token = tokenStorage.getToken()
    
    if (
      token && 
      isTokenExpired(token) && 
      endpoint !== '/auth/refresh' && 
      endpoint !== '/auth/login' && 
      endpoint !== '/auth/signup'
    ) {
      console.log('[AuthAPI] Token expired, refreshing...')
      token = await this.refreshAccessToken()
      
      if (!token) {
        throw new APIError('Session expired. Please login again.', 401, 'TOKEN_EXPIRED')
      }
    }

    // Add authorization header
    if (token) {
      ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new APIError(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data.code
        )
      }

      return data as T
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      
      // Network or parsing errors
      console.error('[AuthAPI] Request failed:', error)
      throw new APIError(
        'Network error. Please check your connection.',
        0,
        'NETWORK_ERROR'
      )
    }
  }

  /**
   * User signup
   */
  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    // Store tokens and user data
    tokenStorage.setToken(response.token)
    tokenStorage.setRefreshToken(response.refreshToken)
    tokenStorage.setCachedUser(response.user)
    
    return response
  }

  /**
   * User login
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    // Store tokens and user data
    tokenStorage.setToken(response.token)
    tokenStorage.setRefreshToken(response.refreshToken)
    tokenStorage.setCachedUser(response.user)
    
    return response
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this._performRefresh()

    try {
      const token = await this.refreshPromise
      return token
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async _performRefresh(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken()
    
    if (!refreshToken) {
      console.log('[AuthAPI] No refresh token available')
      this.clearAuthData()
      return null
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      const data = await response.json()
      
      // Update stored tokens
      tokenStorage.setToken(data.token)
      tokenStorage.setRefreshToken(data.refreshToken)
      
      console.log('[AuthAPI] Token refreshed successfully')
      return data.token
    } catch (error) {
      console.error('[AuthAPI] Token refresh failed:', error)
      this.clearAuthData()
      return null
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('[AuthAPI] Logout request failed:', error)
      // Continue with local cleanup even if request fails
    } finally {
      this.clearAuthData()
    }
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    tokenStorage.clearAll()
  }

  /**
   * Health check endpoint (for testing)
   */
  async checkHealth(): Promise<{ status: string; timestamp: number }> {
    return this.request<{ status: string; timestamp: number }>('/health')
  }
}

// Export singleton instance
export const authAPI = AuthAPIClient.getInstance()
