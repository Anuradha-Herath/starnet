"use client"

import React, { createContext, useContext } from 'react'
import { useAuthContext, AuthProvider } from '@asgardeo/auth-react'

interface AsgardeoAuthContextType {
  user: any
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AsgardeoAuthContext = createContext<AsgardeoAuthContextType | undefined>(undefined)

export function AsgardeoAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider
      config={{
        signInRedirectURL: process.env.NEXT_PUBLIC_ASGARDEO_SIGN_IN_REDIRECT_URL || "http://localhost:3000",
        signOutRedirectURL: process.env.NEXT_PUBLIC_ASGARDEO_SIGN_OUT_REDIRECT_URL || "http://localhost:3000",
        clientID: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID || "",
        baseUrl: process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL || "",
        scope: ["openid", "profile", "groups"],
      }}
    >
      {children}
    </AuthProvider>
  )
}

export function useAuth() {
  const asgardeoAuth = useAuthContext()

  // Return Asgardeo context directly
  return {
    user: asgardeoAuth.state as any as Record<string, unknown>,
    isAuthenticated: asgardeoAuth.state.isAuthenticated,
    logout: asgardeoAuth.signOut,
  }
}
