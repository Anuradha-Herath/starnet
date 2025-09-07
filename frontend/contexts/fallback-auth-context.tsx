"use client"

import React, { createContext, useContext, ReactNode, useState } from 'react'

// Fallback auth context for when Asgardio is not configured
interface FallbackAuthContextType {
  user: any | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => Promise<string | undefined>
}

const FallbackAuthContext = createContext<FallbackAuthContextType | undefined>(undefined)

export function FallbackAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async () => {
    setIsLoading(true)
    // Mock login for demo purposes
    setTimeout(() => {
      setUser({
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com',
        groups: ['client']
      })
      setIsLoading(false)
    }, 1000)
  }

  const logout = async () => {
    setUser(null)
  }

  const getAccessToken = async () => {
    return 'demo-token'
  }

  const value: FallbackAuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    getAccessToken,
  }

  return (
    <FallbackAuthContext.Provider value={value}>
      <div className="border-t-4 border-yellow-500 bg-yellow-50 p-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> Asgardio not configured. Using fallback authentication.
            <a href="/asgardeo-login" className="ml-2 underline">Configure Asgardio</a>
          </p>
        </div>
      </div>
      {children}
    </FallbackAuthContext.Provider>
  )
}

export function useFallbackAuth() {
  const context = useContext(FallbackAuthContext)
  if (context === undefined) {
    throw new Error('useFallbackAuth must be used within a FallbackAuthProvider')
  }
  return context
}
