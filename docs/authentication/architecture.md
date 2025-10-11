# Authentication System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   User Interface Layer                    │  │
│  │  - Login Page (app/login/page.tsx)                       │  │
│  │  - Signup Page (app/signup/page.tsx)                     │  │
│  │  - Protected Routes (client/performer/admin dashboards)  │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │ useAuth() hook                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Context Layer (contexts/auth-context.tsx)      │  │
│  │                                                           │  │
│  │  - Manages global authentication state                   │  │
│  │  - Provides useAuth() hook                               │  │
│  │  - Handles login, signup, logout                         │  │
│  │  - Auto-initializes auth on app load                     │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │ calls authAPI methods                      │
│                     ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Core Auth Module (lib/auth/)                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  index.ts - Public API exports                     │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  types.ts - TypeScript definitions                 │ │  │
│  │  │  - User, AuthResponse, LoginData, SignupData       │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  token-manager.ts - Token operations               │ │  │
│  │  │  - localStorage management                          │ │  │
│  │  │  - Token validation & expiry checks                │ │  │
│  │  │  - User caching for optimistic UI                  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  api-client.ts - HTTP client                       │ │  │
│  │  │  - Handles all API requests                        │ │  │
│  │  │  - Automatic token refresh                         │ │  │
│  │  │  - Error handling & retry logic                    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  └───────────────────┬───────────────────────────────────────┘  │
│                      │ HTTP requests with JWT                    │
└──────────────────────┼───────────────────────────────────────────┘
                       │
                       ▼ localhost:8081/api
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Controller Layer                            │  │
│  │  (src/auth/auth.controller.ts)                          │  │
│  │                                                           │  │
│  │  POST /api/auth/signup    - Register new user           │  │
│  │  POST /api/auth/login     - Login user                  │  │
│  │  GET  /api/auth/me        - Get current user [Auth]     │  │
│  │  POST /api/auth/refresh   - Refresh token [RT Guard]    │  │
│  │  POST /api/auth/logout    - Logout user [Auth]          │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Service Layer                               │  │
│  │  (src/auth/auth.service.ts)                             │  │
│  │                                                           │  │
│  │  - Business logic for authentication                     │  │
│  │  - Password hashing with bcrypt                         │  │
│  │  - JWT token generation                                 │  │
│  │  - User validation                                      │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Security Layer (Guards & Strategies)           │  │
│  │                                                           │  │
│  │  jwt.strategy.ts        - Validates JWT tokens          │  │
│  │  jwt-auth.guard.ts      - Protects routes               │  │
│  │  refresh-token.strategy - Validates refresh tokens      │  │
│  │  refresh-token.guard    - Protects refresh endpoint     │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Data Layer (Supabase)                       │  │
│  │                                                           │  │
│  │  Tables:                                                 │  │
│  │    - users: User profiles & roles                       │  │
│  │    - user_auth: Password hashes & refresh tokens        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### 1. Login Flow
```
User enters credentials
         ↓
Login Page → useAuth().login()
         ↓
authAPI.login() → POST /api/auth/login
         ↓
Backend validates credentials
         ↓
Backend generates JWT + refresh token
         ↓
Tokens stored in localStorage
         ↓
User data cached for optimistic UI
         ↓
AuthContext updates state
         ↓
User redirected to dashboard
```

### 2. Auto-initialization Flow (Page Refresh)
```
App loads
         ↓
AuthProvider initializes
         ↓
Check for token in localStorage
         ↓
Token exists? ──No──> User stays logged out
         │
        Yes
         ↓
Token expired? ──Yes──> Refresh token
         │                    │
         No                   │
         ↓                    ↓
Use cached user ──────────────┘
         ↓
Validate with server in background
         ↓
Update user data if needed
```

### 3. Token Refresh Flow
```
API request initiated
         ↓
Check token expiry
         ↓
Token expired? ──No──> Proceed with request
         │
        Yes
         ↓
Refresh token exists?
         │
        Yes
         ↓
POST /api/auth/refresh
         ↓
Get new JWT + refresh token
         ↓
Update localStorage
         ↓
Retry original request
         ↓
Success
```

### 4. Logout Flow
```
User clicks logout
         ↓
useAuth().logout()
         ↓
authAPI.logout() → POST /api/auth/logout
         ↓
Backend clears refresh token from DB
         ↓
Clear all tokens from localStorage
         ↓
Clear cached user data
         ↓
Update AuthContext state
         ↓
Redirect to login page
```

## Data Storage (localStorage)

```
┌─────────────────────────────────────┐
│         Browser localStorage         │
├─────────────────────────────────────┤
│                                      │
│  artistlk_token                     │
│  └─ JWT access token (1 hour TTL)  │
│                                      │
│  artistlk_refresh_token             │
│  └─ Refresh token (7 days TTL)     │
│                                      │
│  artistlk_user                      │
│  └─ Cached user data (JSON)        │
│     {                                │
│       id, firstName, lastName,       │
│       email, phone, role,            │
│       createdAt, updatedAt           │
│     }                                │
│                                      │
└─────────────────────────────────────┘
```

## Security Features

### Token Security
- ✅ JWT tokens signed with secret key
- ✅ Short-lived access tokens (1 hour)
- ✅ Refresh tokens for seamless renewal (7 days)
- ✅ Tokens invalidated on logout (server-side)
- ✅ Automatic token refresh before expiry

### Password Security
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ Passwords never stored in plain text
- ✅ Passwords never sent in GET requests
- ✅ Password strength validation on frontend

### Request Security
- ✅ HTTPS in production (recommended)
- ✅ CORS configured on backend
- ✅ JWT included in Authorization header
- ✅ Input validation with class-validator
- ✅ XSS protection with React

### Session Security
- ✅ Tokens stored in localStorage (required for Next.js)
- ✅ Automatic logout on token expiry
- ✅ Server-side session invalidation
- ✅ Role-based access control

## Role-Based Access Control

```
┌──────────────────────────────────────────────────┐
│                    User Roles                     │
├──────────────────────────────────────────────────┤
│                                                   │
│  CLIENT                                          │
│  └─ Can browse performers                        │
│  └─ Can make bookings                            │
│  └─ Can view own bookings                        │
│  └─ Can leave reviews                            │
│                                                   │
│  PERFORMER                                       │
│  └─ Can create profile                           │
│  └─ Can receive bookings                         │
│  └─ Can manage calendar                          │
│  └─ Can view earnings                            │
│                                                   │
│  ADMIN                                           │
│  └─ Full system access                           │
│  └─ Can manage all users                         │
│  └─ Can view analytics                           │
│  └─ Can moderate content                         │
│                                                   │
└──────────────────────────────────────────────────┘
```

## File Dependencies

```
app/layout.tsx
    └─ contexts/auth-context.tsx
           └─ lib/auth/api-client.ts
                  └─ lib/auth/token-manager.ts
                         └─ lib/auth/types.ts

All import from:
    lib/auth/index.ts (central export)
```

## Error Handling

```
┌─────────────────────────────────────┐
│          Error Categories            │
├─────────────────────────────────────┤
│                                      │
│  Network Errors                     │
│  └─ Fetch failed                    │
│  └─ Connection timeout              │
│  └─ CORS issues                     │
│                                      │
│  Authentication Errors              │
│  └─ Invalid credentials (401)       │
│  └─ Token expired (401)             │
│  └─ Invalid token (401)             │
│  └─ Refresh failed (401)            │
│                                      │
│  Validation Errors                  │
│  └─ Missing fields (400)            │
│  └─ Invalid email format (400)      │
│  └─ Password too short (400)        │
│                                      │
│  Server Errors                      │
│  └─ Internal server error (500)     │
│  └─ Database error (500)            │
│                                      │
└─────────────────────────────────────┘

All errors are:
  - Caught and logged
  - Converted to user-friendly messages
  - Displayed in UI
  - Reported to console for debugging
```

This architecture ensures:
- ✅ **Separation of concerns**: Each layer has a specific responsibility
- ✅ **Maintainability**: Easy to update and debug
- ✅ **Security**: Multiple layers of protection
- ✅ **Performance**: Optimistic UI with caching
- ✅ **User Experience**: Seamless authentication flow