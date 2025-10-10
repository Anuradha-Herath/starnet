"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface RedirectGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectAuthenticated?: boolean
}

export function RedirectGuard({ 
  children, 
  allowedRoles = [],
  redirectAuthenticated = false 
}: RedirectGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return // Wait for auth to load

    // If redirectAuthenticated is true and user is authenticated, redirect to dashboard
    if (redirectAuthenticated && isAuthenticated && user) {
      console.log('[RedirectGuard] Redirecting authenticated user to dashboard')
      const dashboardPath = getDashboardPath(user.role)
      router.replace(dashboardPath)
      return
    }

    // If allowedRoles is specified and user is not authenticated, redirect to login
    if (allowedRoles.length > 0 && !isAuthenticated) {
      console.log('[RedirectGuard] User not authenticated, redirecting to login')
      router.replace('/auth/login')
      return
    }

    // If allowedRoles is specified and user doesn't have the right role
    if (allowedRoles.length > 0 && isAuthenticated && user) {
      if (!allowedRoles.includes(user.role)) {
        console.log('[RedirectGuard] User role not allowed, redirecting to dashboard')
        const dashboardPath = getDashboardPath(user.role)
        router.replace(dashboardPath)
        return
      }
    }
  }, [isAuthenticated, user, isLoading, router, allowedRoles, redirectAuthenticated])

  // Don't render anything while loading or during redirect
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If redirectAuthenticated is true and user is authenticated, don't render children
  if (redirectAuthenticated && isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If allowedRoles is specified and user doesn't have access, don't render children
  if (allowedRoles.length > 0 && isAuthenticated && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If allowedRoles is specified and user is not authenticated, don't render children
  if (allowedRoles.length > 0 && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}

function getDashboardPath(role: string): string {
  switch (role) {
    case "client":
      return "/client/search"
    case "performer":
      return "/performer/dashboard"
    case "admin":
      return "/admin/dashboard"
    default:
      return "/auth/login"
  }
}
