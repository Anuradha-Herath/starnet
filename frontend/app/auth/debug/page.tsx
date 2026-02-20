"use client"

import { useState, useEffect } from "react"
import { useAuth as useAppAuth } from "@/lib/auth"
import { useAuth as useClerkAuth } from "@clerk/nextjs"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api"

export default function AuthDebugPage() {
  const { user, isLoading, hasValidToken } = useAppAuth()
  const { isSignedIn, getToken } = useClerkAuth()
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({})
  const [testResults, setTestResults] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const gather = () => {
      setDebugInfo({
        hasValidToken,
        isSignedIn,
        user,
        isLoading,
        timestamp: new Date().toISOString(),
      })
    }
    gather()
    const t = setInterval(gather, 2000)
    return () => clearInterval(t)
  }, [user, isLoading, hasValidToken, isSignedIn])

  const testTokenValidation = async () => {
    try {
      setTestResults({ testing: true })
      const token = await getToken()
      if (!token) {
        setTestResults({ error: "No Clerk token" })
        return
      }
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTestResults({ status: res.status, ok: res.ok, data, timestamp: new Date().toISOString() })
    } catch (err) {
      setTestResults({ error: err instanceof Error ? err.message : "Unknown error" })
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Auth Debug (Clerk)</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Auth State</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Backend /auth/me test</h2>
          <button
            onClick={testTokenValidation}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Test token with backend
          </button>
          {Object.keys(testResults).length > 0 && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <a href="/auth/login" className="text-primary hover:underline">Login</a>
          {" · "}
          <a href="/" className="text-primary hover:underline">Home</a>
        </div>
      </div>
    </div>
  )
}
