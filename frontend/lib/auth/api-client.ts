/**
 * Authentication API Client (Clerk-backed)
 *
 * Uses Clerk session token for backend requests. Set the token getter from AuthProvider.
 */

import type { User } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api'

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

type TokenGetter = () => Promise<string | null>

class AuthAPIClient {
  private static instance: AuthAPIClient
  private tokenGetter: TokenGetter | null = null

  private constructor() {}

  static getInstance(): AuthAPIClient {
    if (!AuthAPIClient.instance) {
      AuthAPIClient.instance = new AuthAPIClient()
    }
    return AuthAPIClient.instance
  }

  setTokenGetter(getter: TokenGetter): void {
    this.tokenGetter = getter
  }

  private async getToken(): Promise<string | null> {
    if (!this.tokenGetter) return null
    return this.tokenGetter()
  }

  async requestWithToken<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = await this.getToken()

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
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
      if (error instanceof APIError) throw error
      console.error('[AuthAPI] Request failed:', error)
      throw new APIError('Network error. Please check your connection.', 0, 'NETWORK_ERROR')
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.requestWithToken<User>('/auth/me')
  }

  async updateProfile(data: { role?: 'client' | 'performer'; phone?: string }): Promise<User> {
    return this.requestWithToken<User>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async checkHealth(): Promise<{ status: string; timestamp: number }> {
    const res = await fetch(`${API_BASE_URL}/health`)
    return res.json()
  }
}

export const authAPI = AuthAPIClient.getInstance()
