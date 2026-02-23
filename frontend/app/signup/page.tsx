"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Music, Eye, EyeOff, ArrowLeft, User, Mic } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type UserRole = "client" | "performer"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [verifyCode, setVerifyCode] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signup, verifyEmail } = useAuth()

  // Get role from URL params if provided
  useState(() => {
    const roleParam = searchParams.get("role") as UserRole
    if (roleParam && ["client", "performer"].includes(roleParam)) {
      setSelectedRole(roleParam)
    }
  })

  const roles = [
    {
      id: "client" as UserRole,
      name: "Client",
      description: "Book artists for events",
      icon: User,
      features: ["Browse artists", "Book events", "Manage bookings", "Leave reviews"],
    },
    {
      id: "performer" as UserRole,
      name: "Performer",
      description: "Showcase your talent",
      icon: Mic,
      features: ["Create profile", "Receive bookings", "Manage calendar", "Earn money"],
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long!")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { needsVerification } = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: selectedRole,
      })

      if (needsVerification) {
        setVerifying(true)
      } else {
        const destination = selectedRole === 'performer' ? '/performer/dashboard' : '/client/search'
        router.replace(destination)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    setIsLoading(true)
    setError(null)
    try {
      await verifyEmail(verifyCode, selectedRole)
      const destination = selectedRole === 'performer' ? '/performer/dashboard' : '/client/search'
      router.replace(destination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid verification code.")
    } finally {
      setIsLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card className="glass-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
                <Music className="w-8 h-8 text-gray" />
              </div>
              <h1 className="text-2xl font-bold gradient-text mb-2">Verify your email</h1>
              <p className="text-gray-600">We sent a 6-digit code to <strong>{formData.email}</strong></p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verifyCode}
                  onChange={setVerifyCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div id="clerk-captcha" />

              <Button
                type="submit"
                disabled={isLoading || verifyCode.length < 6}
                className="w-full glow-button text-lg py-3"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Didn&apos;t get it?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => { setVerifying(false); setVerifyCode(""); setError(null) }}
              >
                Go back
              </button>
            </p>
          </Card>
        </div>
      </div>
    )
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          <Link href="/" className="inline-flex items-center text-gray-800 hover:text-gray-900 mb-8 smooth-transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
              <Music className="w-8 h-8 text-gray" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">Join ArtistLK</h1>
            <p className="text-xl text-gray-800">Choose your account type to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {roles.map((role) => (
              <Card
                key={role.id}
                className="glass-card p-8 text-center cursor-pointer group hover:scale-105"
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <role.icon className="w-8 h-8 text-gray" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-shadow">{role.name}</h3>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <ul className="space-y-2 text-sm text-gray-500">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 glow-button">Continue as {role.name}</Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium smooth-transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentRole = roles.find((role) => role.id === selectedRole)!

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back to Role Selection */}
        <button
          onClick={() => setSelectedRole(null)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 smooth-transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </button>

        <Card className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
              <currentRole.icon className="w-8 h-8 text-gray" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Create {currentRole.name} Account</h1>
            <p className="text-gray-600">{currentRole.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-900 font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="glass-card bg-white/5 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-900 font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="glass-card bg-white/5 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-card bg-white/5 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  placeholder="Create a strong password"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="glass-card bg-white/5 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary/50 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 smooth-transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input type="checkbox" className="mt-1 rounded border-gray-300 bg-white/5" required />
              <label className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 smooth-transition">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 smooth-transition">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div id="clerk-captcha" />

            <Button type="submit" disabled={isLoading} className="w-full glow-button text-lg py-3">
              {isLoading ? "Creating Account..." : `Create ${currentRole.name} Account`}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium smooth-transition">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}