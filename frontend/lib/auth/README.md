# Authentication System Documentation

## Overview

This is a clean, modular JWT-based authentication system for the StarNet application. It follows industry best practices for security, maintainability, and developer experience.

## Architecture

```
frontend/
├── lib/auth/                    # Core authentication logic
│   ├── index.ts                 # Public API exports
│   ├── types.ts                 # TypeScript type definitions
│   ├── token-manager.ts         # Token storage & validation
│   └── api-client.ts            # HTTP client for auth endpoints
├── contexts/
│   └── auth-context.tsx         # React context provider
└── app/
    ├── login/                   # Login page
    └── signup/                  # Signup page

backend/
└── src/auth/                    # NestJS authentication module
    ├── auth.controller.ts       # API endpoints
    ├── auth.service.ts          # Business logic
    ├── auth.module.ts           # Module configuration
    ├── jwt.strategy.ts          # JWT validation strategy
    ├── jwt-auth.guard.ts        # Route protection guard
    ├── refresh-token.strategy.ts# Refresh token strategy
    └── dto/
        └── auth.dto.ts          # Request/response DTOs
```

## Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **Automatic Token Refresh** - Seamless token renewal before expiration  
✅ **Persistent Sessions** - User stays logged in across browser sessions  
✅ **Optimistic UI Updates** - Fast user experience with cached data  
✅ **Role-based Access** - Support for client, performer, and admin roles  
✅ **Type-safe** - Full TypeScript support with proper types  
✅ **Error Handling** - Comprehensive error handling and logging  
✅ **Session Management** - Proper logout with server-side cleanup  

## Usage

### 1. Wrapping Your App

The `AuthProvider` should wrap your entire application:

```typescript
// app/layout.tsx
import { AuthProvider } from '@/lib/auth'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Using Authentication in Components

```typescript
import { useAuth } from '@/lib/auth'

function MyComponent() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <button onClick={() => login('email@example.com', 'password')}>
      Login
    </button>
  }

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 3. Protecting Routes

```typescript
'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null

  return <div>Protected content</div>
}
```

### 4. Role-based Access

```typescript
import { useAuth } from '@/lib/auth'

function AdminPanel() {
  const { user } = useAuth()

  if (user?.role !== 'admin') {
    return <div>Access Denied</div>
  }

  return <div>Admin Dashboard</div>
}
```

## API Reference

### useAuth Hook

Returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user or null |
| `isLoading` | `boolean` | True while checking authentication status |
| `isAuthenticated` | `boolean` | True if user is logged in |
| `hasValidToken` | `boolean` | True if a valid token exists in storage |
| `login(email, password)` | `Promise<void>` | Logs in a user |
| `signup(userData)` | `Promise<void>` | Registers a new user |
| `logout()` | `Promise<void>` | Logs out the current user |

### User Type

```typescript
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'client' | 'performer' | 'admin'
  createdAt: string
  updatedAt: string
}
```

## Token Management

Tokens are stored in `localStorage` with the following keys:
- `artistlk_token` - JWT access token (valid for 1 hour)
- `artistlk_refresh_token` - Refresh token (valid for 7 days)
- `artistlk_user` - Cached user data (for optimistic UI)

### Automatic Token Refresh

The system automatically refreshes the access token when:
1. It's expired or expires within 30 seconds
2. Before making an authenticated API request
3. On app initialization if a cached user exists

## Security Best Practices

1. **Tokens are HTTP-only**: Although stored in localStorage (required for Next.js client components), they're only used for API calls
2. **Token expiration**: Access tokens expire after 1 hour
3. **Refresh tokens**: Used to obtain new access tokens without re-login
4. **Password hashing**: Passwords are hashed with bcrypt (12 rounds) on the backend
5. **CORS protection**: Backend API has CORS configured
6. **Input validation**: All inputs are validated using class-validator

## Backend Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/signup` | Register new user | No |
| `POST` | `/api/auth/login` | Login user | No |
| `GET` | `/api/auth/me` | Get current user | Yes |
| `POST` | `/api/auth/refresh` | Refresh access token | Refresh Token |
| `POST` | `/api/auth/logout` | Logout user | Yes |

## Error Handling

The system includes comprehensive error handling:

```typescript
try {
  await login(email, password)
} catch (error) {
  if (error instanceof APIError) {
    // Handle specific API errors
    console.error(error.status, error.message)
  }
}
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
```

### Backend (.env)

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
```

## Migration from Old System

If you were using the old authentication system, here's what changed:

### ❌ Removed Files
- `contexts/asgardeo-auth-context.tsx` (Unused OAuth system)
- `contexts/fallback-auth-context.tsx` (Unused fallback system)
- `lib/asgardeo-config.ts` (Unused config)
- `lib/simple-auth-api.ts` (Unused simple auth)
- `lib/auth-api.ts` (Replaced by modular system)
- `components/asgardeo-navigation.tsx` (Unused component)

### ✅ New Structure
- `lib/auth/index.ts` - Main export point
- `lib/auth/types.ts` - Type definitions
- `lib/auth/token-manager.ts` - Token operations
- `lib/auth/api-client.ts` - HTTP client
- `contexts/auth-context.tsx` - Simplified context

### Migration Steps

1. Update imports:
```typescript
// Old
import { useAuth } from '@/contexts/auth-context'
import { authAPI } from '@/lib/auth-api'

// New (both work from same import)
import { useAuth, authAPI } from '@/lib/auth'
```

2. The `useAuth()` hook API remains the same - no code changes needed!

3. Remove any Asgardeo-related code or configurations

## Troubleshooting

### "Session expired" errors
- Check if backend is running
- Verify JWT_SECRET matches between backend restarts
- Clear localStorage and try logging in again

### Token refresh loops
- Check system clock is synchronized
- Verify backend token expiration settings
- Check console for detailed logs

### CORS errors
- Verify NEXT_PUBLIC_API_BASE_URL is correct
- Check backend CORS configuration
- Ensure credentials are being sent with requests

## Development Tips

1. **Enable detailed logging**: Auth system logs all operations with `[AuthContext]` and `[AuthAPI]` prefixes
2. **Check localStorage**: Use browser DevTools → Application → Local Storage to inspect tokens
3. **Test token expiration**: Manually modify token expiration in `token-manager.ts` for testing
4. **Monitor network**: Check Network tab for API calls and responses

## Testing

```typescript
// Test authentication flow
describe('Authentication', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toBeDefined()
  })
})
```

## Contributing

When adding authentication features:
1. Add types to `types.ts`
2. Implement API calls in `api-client.ts`
3. Update context in `auth-context.tsx` if needed
4. Document changes in this README
5. Update backend DTOs if adding new fields

## Support

For issues or questions:
1. Check the console logs (they're detailed)
2. Review this documentation
3. Check backend logs
4. Verify environment variables
5. Test with a fresh browser session (incognito)
