/**
 * Authentication Type Definitions
 * 
 * Centralized type definitions for authentication-related data structures
 */

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
  token: string       // JWT access token
  refreshToken: string // Refresh token for renewal
  user: User
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

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  hasValidToken: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: SignupData) => Promise<void>
  logout: () => void
}
