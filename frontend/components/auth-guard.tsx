"use client"

import type React from "react"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "client" | "performer" | "admin"
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo = "/login" }: AuthGuardProps) {
  const { user, isLoading, hasValidToken } = useAuth()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Wait for auth to complete loading
    if (isLoading) {
      console.log('AuthGuard: Still loading auth state...')
      return
    }

    console.log('AuthGuard: Auth loading completed', { user: !!user, requiredRole, hasValidToken })

    // If there's no valid token, redirect to login
    if (!hasValidToken || !user) {
      console.log('AuthGuard: No valid token or user, redirecting to login')
      if (!hasRedirected.current) {
        hasRedirected.current = true
        router.push(redirectTo)
      }
      return
    }

    // Check role requirement
    if (requiredRole && user.role !== requiredRole) {
      console.log('AuthGuard: Role mismatch', { userRole: user.role, requiredRole })
      if (!hasRedirected.current) {
        hasRedirected.current = true
        router.push('/unauthorized')
      }
      return
    }

    // All checks passed, allow rendering
    console.log('AuthGuard: All checks passed, rendering content')
    setShouldRender(true)
  }, [user, isLoading, requiredRole, redirectTo, router, hasValidToken])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Only render children if all checks have passed
  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
