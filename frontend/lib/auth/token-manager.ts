/**
 * Token Management Utility
 * 
 * Handles JWT token storage, retrieval, and validation
 * Uses localStorage for persistence across browser sessions
 */

import type { User } from './types'

const TOKEN_KEY = 'artistlk_token'
const REFRESH_TOKEN_KEY = 'artistlk_refresh_token'
const USER_CACHE_KEY = 'artistlk_user'

/**
 * Token storage operations
 */
export const tokenStorage = {
  // Access Token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
  },

  // Refresh Token
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  removeRefreshToken: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  // User Cache (for optimistic UI)
  getCachedUser: (): User | null => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(USER_CACHE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (error) {
      console.error('[TokenManager] Failed to parse cached user:', error)
      return null
    }
  },

  setCachedUser: (user: User): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user))
    } catch (error) {
      console.error('[TokenManager] Failed to cache user:', error)
    }
  },

  removeCachedUser: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(USER_CACHE_KEY)
  },

  // Clear all auth data
  clearAll: (): void => {
    tokenStorage.removeToken()
    tokenStorage.removeRefreshToken()
    tokenStorage.removeCachedUser()
  }
}

/**
 * Decode JWT token payload without validation
 * For client-side optimistic rendering only
 */
export const decodeToken = (token: string): { email?: string; role?: string; userId?: string; exp?: number } | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (error) {
    console.error('[TokenManager] Failed to decode token:', error)
    return null
  }
}

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true

  try {
    const decoded = decodeToken(token)
    if (!decoded?.exp) return true

    // Check if token expires in next 30 seconds
    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()
    return currentTime >= expirationTime - 30000
  } catch {
    return true
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const token = tokenStorage.getToken()
  return token !== null && !isTokenExpired(token)
}
