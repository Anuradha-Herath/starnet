"use client"

import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 smooth-transition self-start"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <SignUp
        fallbackRedirectUrl="/"
        signInUrl="/auth/login"
      />
    </div>
  )
}
