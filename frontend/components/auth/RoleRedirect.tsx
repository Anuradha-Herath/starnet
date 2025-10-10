"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RoleRedirectProps {
  children: React.ReactNode
}

export function RoleRedirect({ children }: RoleRedirectProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role after successful authentication
      switch (user.role) {
        case 'client':
          router.push('/client/search')
          break
        case 'performer':
          router.push('/performer/dashboard')
          break
        case 'admin':
          router.push('/admin/dashboard')
          break
        default:
          router.push('/')
      }
    }
  }, [user, isLoading, router])

  return <>{children}</>
}
