"use client"

import { useState, useEffect } from "react"
import { useAuth, authAPI, tokenStorage, decodeToken } from "@/lib/auth"

export default function AuthDebugPage() {
  const { user, isLoading, hasValidToken } = useAuth()
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({})
  const [testResults, setTestResults] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const gatherDebugInfo = () => {
      const token = tokenStorage.getToken()
      const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('artistlk_token') : null
      
      let decodedToken = null
      if (token) {
        decodedToken = decodeToken(token)
      }

      setDebugInfo({
        hasValidToken,
        token: token ? token.substring(0, 50) + '...' : 'null',
        localStorageToken: localStorageToken ? localStorageToken.substring(0, 50) + '...' : 'null',
        decodedToken,
        user,
        isLoading,
        timestamp: new Date().toISOString()
      })
    }

    gatherDebugInfo()
    const interval = setInterval(gatherDebugInfo, 1000) // Update every second
    return () => clearInterval(interval)
  }, [user, isLoading, hasValidToken])

  const testTokenValidation = async () => {
    try {
      setTestResults({ testing: true })
      console.log('Testing token validation...')
      
      const token = tokenStorage.getToken()
      console.log('Current token:', token)
      
      if (!token) {
        setTestResults({ error: 'No token found' })
        return
      }

      // Test the /auth/me endpoint directly
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      console.log('Direct API response:', response.status, data)

      setTestResults({
        status: response.status,
        ok: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Token test failed:', error)
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const clearAllAuth = () => {
    localStorage.removeItem('artistlk_token')
    window.location.reload()
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">JWT Token Debug Center</h1>
        
        {/* Real-time Debug Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Real-time Auth State</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {/* Test Results */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Token Validation Test</h2>
          <button 
            onClick={testTokenValidation}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Test Token Validation
          </button>
          {testResults && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={clearAllAuth}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear All Auth & Reload
            </button>
            
            <a 
              href="/login" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
            >
              Go to Login
            </a>
            
            <a 
              href="/client/dashboard" 
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 inline-block"
            >
              Test Client Dashboard
            </a>
          </div>
        </div>

        {/* Console Logs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open browser console (F12) to see detailed logs</li>
            <li>Test the token validation to see if backend responds correctly</li>
            <li>Try logging in and then refreshing this page</li>
            <li>Check if the token persists and validates correctly</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
