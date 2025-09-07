"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, type User } from '@/lib/auth-api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  hasValidToken: boolean // New flag to indicate if there's a token in storage
  login: (email: string, password: string) => Promise<void>
  signup: (userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    role: 'client' | 'performer'
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Clean initial state - let useEffect handle token recovery
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[AuthContext] Starting auth initialization')
      
      const token = authAPI.getToken()
      const cachedUser = authAPI.getCachedUser()
      
      console.log('[AuthContext] TOKEN STATE CHECK:')
      console.log('- JWT Token exists:', !!token)
      console.log('- Cached user exists:', !!cachedUser)
      console.log('- Cached user email:', cachedUser?.email || 'none')
      
      if (!token) {
        console.log('[AuthContext] No token found, clearing auth state')
        authAPI.removeCachedUser()
        setUser(null)
        setIsLoading(false)
        return
      }

      // Check if token is expired
      if (authAPI.isTokenExpired()) {
        console.log('[AuthContext] Token is expired, attempting refresh...')
        const newToken = await authAPI.refreshAccessToken()
        
        if (!newToken) {
          console.log('[AuthContext] Token refresh failed, clearing auth state')
          setUser(null)
          setIsLoading(false)
          return
        }
        
        console.log('[AuthContext] Token refreshed successfully')
      }

      // If we have a cached user and valid token, use it
      if (cachedUser) {
        console.log('[AuthContext] Using cached user data')
        setUser(cachedUser)
        setIsLoading(false)
        return
      }
      
      // Validate token by fetching current user
      try {
        console.log('[AuthContext] Fetching current user from server...')
        const currentUser = await authAPI.getCurrentUser()
        console.log('[AuthContext] User verified successfully:', currentUser.email)
        setUser(currentUser)
        authAPI.setCachedUser(currentUser)
      } catch (error: any) {
        console.error('[AuthContext] Token validation failed:', error)
        authAPI.removeToken()
        authAPI.removeRefreshToken()
        authAPI.removeCachedUser()
        setUser(null)
      }
      
      setIsLoading(false)
    }
    
    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password })
    const newToken = authAPI.getToken()
    
    console.log('[AuthContext] LOGIN SUCCESS:')
    console.log('- JWT Token after login:', newToken ? `${newToken.substring(0, 50)}...` : 'null')
    console.log('- Token length:', newToken ? newToken.length : 0)
    console.log('- User data:', response.user.email)
    
    setUser(response.user)
    authAPI.setCachedUser(response.user)
  }

  const signup = async (userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    role: 'client' | 'performer'
  }) => {
    const response = await authAPI.signup(userData)
    // We intentionally do NOT log the user in after signup
    authAPI.removeToken()
    authAPI.removeRefreshToken()
    authAPI.removeCachedUser()
    setUser(null)
  }

  const logout = async () => {
    console.log('[AuthContext] Logging out user, clearing all auth state')
    try {
      await authAPI.logout()
    } catch (error) {
      console.warn('[AuthContext] Logout failed:', error)
    }
    setUser(null)
  }

  const value = {
    user,
    isLoading,
  isAuthenticated: !!user,
  hasValidToken: authAPI.isAuthenticated(),
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
