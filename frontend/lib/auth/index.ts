/**
 * Authentication Exports
 * 
 * Central export point for all authentication-related functionality
 */

// Type definitions
export type { User, AuthResponse, SignupData, LoginData, AuthContextType } from './types'

// API client
export { authAPI, APIError } from './api-client'

// Token management
export { tokenStorage, isAuthenticated, isTokenExpired, decodeToken } from './token-manager'

// Context (re-exported from contexts folder)
export { AuthProvider, useAuth } from '../../contexts/auth-context'
