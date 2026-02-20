"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth as useClerkAuth } from '@clerk/nextjs'
import { authAPI } from '@/lib/auth/api-client'
import type { User, AuthContextType, SignupData } from '@/lib/auth/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authAPI.setTokenGetter(() => getToken())
  }, [getToken])

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      setUser(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    authAPI
      .getCurrentUser()
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn])

  const login = useCallback(async (_email: string, _password: string) => {
    // Clerk handles login; redirect to sign-in if needed
    if (typeof window !== 'undefined') window.location.href = '/auth/login'
  }, [])

  const signup = useCallback(async (_userData?: SignupData) => {
    if (typeof window !== 'undefined') window.location.href = '/auth/signup'
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
    if (typeof window !== 'undefined') window.location.href = '/'
  }, [signOut])

  const value: AuthContextType = {
    user,
    isLoading: !isLoaded || isLoading,
    isAuthenticated: !!user && isSignedIn,
    hasValidToken: isSignedIn,
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
