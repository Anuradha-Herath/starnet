"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Music, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { RedirectGuard } from "@/components/auth/RedirectGuard"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const router = useRouter()
  const { login, user, isLoading: authLoading } = useAuth()

  // Debug: Log auth state
  useEffect(() => {
    console.log('Login Page - Auth State:', { user, authLoading, isAuthenticated: !!user })
  }, [user, authLoading])

  // Handle redirect after successful login - only if login was successful
  useEffect(() => {
    if (user && shouldRedirect) {
      // Show success message based on user role
      const dashboardName = user.role === 'admin' ? 'Admin Dashboard' : 
                           user.role === 'performer' ? 'Performer Dashboard' : 
                           user.role === 'client' ? 'Client Dashboard' : 'Dashboard'
      
      setSuccessMessage(`Login successful! Redirecting to ${dashboardName}...`)
      
      // Redirect after showing success message
      const timer = setTimeout(() => {
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
      }, 2000) // 2 second delay to show success message

      return () => clearTimeout(timer)
    }
  }, [user, router, shouldRedirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(formData.email, formData.password)
      setShouldRedirect(true) // Only set redirect flag after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while auth context is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is already authenticated and we're about to redirect, show loading
  if (user && shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <RedirectGuard redirectAuthenticated={true}>
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 smooth-transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
              <Music className="w-8 h-8 text-gray" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your ArtistLK account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-600 font-medium">{successMessage}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-card bg-white/5 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="glass-card bg-white/5 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary/50 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 smooth-transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 bg-white/5" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 smooth-transition">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading || !!successMessage} className="w-full glow-button text-lg py-3">
              {successMessage ? "Redirecting..." : isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium smooth-transition">
                Sign up here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
    </RedirectGuard>
  )
}
