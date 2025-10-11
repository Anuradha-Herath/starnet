# 🚀 Quick Reference - Authentication System

## Import Everything From One Place

```typescript
import {
  // Hooks
  useAuth,
  AuthProvider,

  // API Client
  authAPI,

  // Token Management
  tokenStorage,
  isAuthenticated,
  isTokenExpired,
  decodeToken,

  // Types
  User,
  AuthResponse,
  SignupData,
  LoginData,
  AuthContextType,
  APIError
} from '@/lib/auth'
```

## Common Patterns

### 1. Use Auth in Component
```typescript
function MyComponent() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please login</div>

  return <div>Welcome {user.firstName}!</div>
}
```

### 2. Protect a Route
```typescript
function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading])

  if (isLoading || !isAuthenticated) return null
  return <div>Protected Content</div>
}
```

### 3. Role-Based Access
```typescript
function AdminOnly() {
  const { user } = useAuth()

  if (user?.role !== 'admin') {
    return <div>Access Denied</div>
  }

  return <div>Admin Dashboard</div>
}
```

### 4. Login User
```typescript
try {
  await login(email, password)
  router.push('/dashboard')
} catch (error) {
  setError(error.message)
}
```

### 5. Signup User
```typescript
try {
  await signup({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: 'client'
  })
  router.push('/login')
} catch (error) {
  setError(error.message)
}
```

### 6. Logout User
```typescript
await logout()
router.push('/login')
```

### 7. Check Token Status
```typescript
const hasToken = tokenStorage.getToken() !== null
const isValid = isAuthenticated()
const willExpireSoon = isTokenExpired(tokenStorage.getToken())
```

### 8. Get Token for API Call
```typescript
const token = tokenStorage.getToken()

fetch('/api/some-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### 9. Direct API Calls
```typescript
// Get current user
const user = await authAPI.getCurrentUser()

// Refresh token manually
const newToken = await authAPI.refreshAccessToken()

// Check health
const health = await authAPI.checkHealth()
```

### 10. Error Handling
```typescript
import { APIError } from '@/lib/auth'

try {
  await login(email, password)
} catch (error) {
  if (error instanceof APIError) {
    console.log(error.status) // HTTP status code
    console.log(error.code)   // Error code
    console.log(error.message) // Error message
  }
}
```

## User Object Structure

```typescript
{
  id: string              // UUID
  firstName: string       // User's first name
  lastName: string        // User's last name
  email: string          // Email address
  phone: string          // Phone number
  role: 'client' | 'performer' | 'admin'
  createdAt: string      // ISO timestamp
  updatedAt: string      // ISO timestamp
}
```

## useAuth Hook Returns

```typescript
{
  user: User | null           // Current user or null if not logged in
  isLoading: boolean          // True while checking auth status
  isAuthenticated: boolean    // True if user is logged in
  hasValidToken: boolean      // True if valid token exists
  login: (email, password) => Promise<void>
  signup: (userData) => Promise<void>
  logout: () => Promise<void>
}
```

## Token Storage Keys

```typescript
localStorage:
  - artistlk_token          // JWT access token
  - artistlk_refresh_token  // Refresh token
  - artistlk_user          // Cached user data
```

## API Endpoints

```
POST   /api/auth/signup    - Register new user
POST   /api/auth/login     - Login user
GET    /api/auth/me        - Get current user [requires JWT]
POST   /api/auth/refresh   - Refresh token [requires refresh token]
POST   /api/auth/logout    - Logout [requires JWT]
```

## Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
```

## Console Logging

All auth operations log to console:
- `[AuthContext]` - React context operations
- `[AuthAPI]` - API client operations
- `[TokenManager]` - Token management operations

## Debugging

1. Open browser DevTools (F12)
2. Check Console for detailed logs
3. Check Application → Local Storage for tokens
4. Use `/debug-auth` page for real-time debugging

## Common Issues & Solutions

### "Session expired" error
```typescript
// Clear storage and login again
tokenStorage.clearAll()
window.location.href = '/login'
```

### Token not persisting
```typescript
// Check if localStorage is available
if (typeof window !== 'undefined') {
  console.log('Token:', tokenStorage.getToken())
}
```

### Unauthorized errors
```typescript
// Verify token exists and is valid
const token = tokenStorage.getToken()
console.log('Token exists:', !!token)
console.log('Token expired:', isTokenExpired(token))
```

## File Locations

```
Authentication files:
  frontend/lib/auth/          - Core auth logic
  frontend/contexts/          - React context
  frontend/app/login/         - Login page
  frontend/app/signup/        - Signup page

Documentation:
  docs/authentication/        - All auth docs
```

## Testing Checklist

```
□ Login works
□ Signup works
□ Logout works
□ Session persists on refresh
□ Token auto-refreshes
□ Protected routes redirect
□ Role-based access works
□ Error messages display
```

## Best Practices

1. ✅ Always use `useAuth()` hook for auth state
2. ✅ Check `isLoading` before checking `isAuthenticated`
3. ✅ Handle errors with try-catch
4. ✅ Never store sensitive data in user object
5. ✅ Use `tokenStorage` for token operations
6. ✅ Import from `@/lib/auth` for consistency
7. ✅ Test protected routes thoroughly
8. ✅ Log errors for debugging

---

**Quick Start**: Import from `@/lib/auth`, use `useAuth()` hook, profit! 🎉