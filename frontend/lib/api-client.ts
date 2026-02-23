/**
 * API client for backend calls.
 * Uses Clerk session tokens for authentication.
 * Usage: const api = createApiClient(getToken)
 *        await api.get('/users/me')
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export type GetTokenFn = () => Promise<string | null>

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'client' | 'performer' | 'admin'
  imageUrl?: string
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { getToken?: GetTokenFn } = {}
): Promise<T> {
  const { getToken, ...fetchOptions } = options
  const url = `${API_BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (getToken) {
    const token = await getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, { ...fetchOptions, headers })
  const data = await response.json()

  if (!response.ok) {
    const errorMessage =
      data.message || `Request failed with status ${response.status}`
    throw new Error(errorMessage)
  }

  return data as T
}

export function createApiClient(getToken: GetTokenFn) {
  return {
    get: <T>(endpoint: string, options?: RequestInit) =>
      apiRequest<T>(endpoint, { ...options, method: 'GET', getToken }),

    post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
      apiRequest<T>(endpoint, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
        getToken,
      }),

    put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
      apiRequest<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
        getToken,
      }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
      apiRequest<T>(endpoint, { ...options, method: 'DELETE', getToken }),
  }
}
