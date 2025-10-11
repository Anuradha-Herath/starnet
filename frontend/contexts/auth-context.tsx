"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, APIError } from '@/lib/auth/api-client'
import { tokenStorage, isTokenExpired } from '@/lib/auth/token-manager'
import type { User, AuthContextType, SignupData } from '@/lib/auth/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[AuthContext] Initializing authentication...')
      
      const token = tokenStorage.getToken()
      const cachedUser = tokenStorage.getCachedUser()
      
      if (!token) {
        console.log('[AuthContext] No token found')
        tokenStorage.clearAll()
        setUser(null)
        setIsLoading(false)
        return
      }

      if (isTokenExpired(token)) {
        console.log('[AuthContext] Token expired, attempting refresh...')
        const newToken = await authAPI.refreshAccessToken()
        
        if (!newToken) {
          console.log('[AuthContext] Token refresh failed')
          setUser(null)
          setIsLoading(false)
          return
        }
        
        console.log('[AuthContext] Token refreshed successfully')
      }

      if (cachedUser) {
        console.log('[AuthContext] Using cached user data')
        setUser(cachedUser)
        setIsLoading(false)
        return
      }
      
      try {
        console.log('[AuthContext] Validating session...')
        const currentUser = await authAPI.getCurrentUser()
        console.log('[AuthContext] Session valid:', currentUser.email)
        setUser(currentUser)
        tokenStorage.setCachedUser(currentUser)
      } catch (error: any) {
        console.error('[AuthContext] Session validation failed:', error)
        tokenStorage.clearAll()
        setUser(null)
      }
      
      setIsLoading(false)
    }
    
    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      
      console.log('[AuthContext] Login successful:', response.user.email)
      setUser(response.user)
      tokenStorage.setCachedUser(response.user)
    } catch (error: any) {
      console.error('[AuthContext] Login failed:', error)
      
      // Transform API errors to user-friendly messages
      if (error instanceof APIError) {
        if (error.isNetworkError) {
          throw new Error('Unable to connect. Please check your internet connection and try again.')
        }
        if (error.isServerError) {
          throw new Error('Server error. Please try again later.')
        }
        // For auth errors, use the user-friendly message
        throw new Error(error.userMessage)
      }
      
      throw error
    }
  }

  const signup = async (userData: SignupData) => {
    try {
      await authAPI.signup(userData)
      console.log('[AuthContext] Signup successful')
      
      tokenStorage.clearAll()
      setUser(null)
    } catch (error: any) {
      console.error('[AuthContext] Signup failed:', error)
      
      // Transform API errors
      if (error instanceof APIError) {
        if (error.isNetworkError) {
          throw new Error('Unable to connect. Please check your internet connection and try again.')
        }
        if (error.isServerError) {
          throw new Error('Server error. Please try again later.')
        }
        // Use user-friendly message for validation/conflict errors
        throw new Error(error.userMessage)
      }
      
      throw error
    }
  }

  const logout = async () => {
    console.log('[AuthContext] Logging out...')
    
    try {
      await authAPI.logout()
    } catch (error) {
      console.warn('[AuthContext] Logout request failed:', error)
    }
    
    setUser(null)
    tokenStorage.clearAll()
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasValidToken: tokenStorage.getToken() !== null && !isTokenExpired(tokenStorage.getToken()),
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
