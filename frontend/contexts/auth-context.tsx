"use client"

import React, { createContext, useContext } from 'react'
import {
  useUser,
  useSignIn,
  useSignUp,
  useClerk,
  useAuth as useClerkAuth,
} from '@clerk/nextjs'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'client' | 'performer' | 'admin'
  imageUrl?: string
}

interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: 'client' | 'performer'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  hasValidToken: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: SignupData) => Promise<{ needsVerification: boolean }>
  verifyEmail: (code: string, role: 'client' | 'performer') => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn()
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp()
  const { signOut } = useClerk()
  const { getToken } = useClerkAuth()

  // Transform Clerk user to our User interface
  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        phone: clerkUser.primaryPhoneNumber?.phoneNumber,
        role:
          (clerkUser.publicMetadata?.role as 'client' | 'performer' | 'admin') ||
          'client',
        imageUrl: clerkUser.imageUrl,
      }
    : null

  const login = async (email: string, password: string): Promise<void> => {
    if (!signIn || !setSignInActive) throw new Error('Auth not ready')

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId })
      } else {
        throw new Error('Login failed. Please check your credentials.')
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message
      throw new Error(msg || 'Login failed. Please check your credentials.')
    }
  }

  const signup = async (userData: SignupData): Promise<{ needsVerification: boolean }> => {
    if (!signUp || !setSignUpActive) throw new Error('Auth not ready')

    try {
      const result = await signUp.create({
        emailAddress: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      })

      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId })
        await setRoleInBackend(userData.role)
        return { needsVerification: false }
      }

      // Email verification required
      if (
        result.status === 'missing_requirements' &&
        result.unverifiedFields.includes('email_address')
      ) {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        return { needsVerification: true }
      }

      throw new Error('Signup incomplete. Please try again.')
    } catch (err: any) {
      if (err?.errors) {
        const msg = err.errors[0]?.longMessage || err.errors[0]?.message
        throw new Error(msg || 'Signup failed. Please try again.')
      }
      throw err
    }
  }

  const verifyEmail = async (code: string, role: 'client' | 'performer'): Promise<void> => {
    if (!signUp || !setSignUpActive) throw new Error('Auth not ready')

    try {
      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId })
        await setRoleInBackend(role)
      } else {
        throw new Error('Verification failed. Please try again.')
      }
    } catch (err: any) {
      if (err?.errors) {
        const msg = err.errors[0]?.longMessage || err.errors[0]?.message
        throw new Error(msg || 'Verification failed. Please try again.')
      }
      throw err
    }
  }

  const setRoleInBackend = async (role: string): Promise<void> => {
    try {
      const token = await getToken()
      await fetch(`${API_BASE_URL}/users/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      })
    } catch (err) {
      console.error('[AuthContext] Failed to set role:', err)
    }
  }

  const logout = async (): Promise<void> => {
    await signOut()
  }

  const isAuthenticated = !!clerkUser
  const isLoading = !userLoaded || !signInLoaded || !signUpLoaded

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        hasValidToken: isAuthenticated,
        login,
        signup,
        verifyEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
