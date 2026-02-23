# Clerk Frontend Integration Guide

## ✅ Setup Complete

Your frontend is now configured with Clerk. Here's what was done:

### 1. Configuration Files Created
- ✅ [.env.local](frontend/.env.local) - Environment variables
- ✅ [middleware.ts](frontend/middleware.ts) - Auth middleware
- ✅ [app/layout.tsx](frontend/app/layout.tsx) - ClerkProvider added

### 2. Clerk Login Pages Created
- ✅ [app/login/page-clerk.tsx](frontend/app/login/page-clerk.tsx) - New login with Clerk
- ✅ [app/signup/page-clerk.tsx](frontend/app/signup/page-clerk.tsx) - New signup with Clerk

## Choose Your Integration Path

### Option A: Use Clerk's UI Components (Easier)

Replace your current custom login/signup pages:

```bash
# Backup old pages
cd frontend/app
mv login/page.tsx login/page-custom-backup.tsx
mv signup/page.tsx signup/page-custom-backup.tsx

# Use Clerk pages
mv login/page-clerk.tsx login/page.tsx
mv signup/page-clerk.tsx signup/page.tsx
```

### Option B: Keep Custom UI with Clerk Auth (More Work)

Update your existing pages to use Clerk hooks instead of custom auth context:

```tsx
// Instead of:
import { useAuth } from "@/contexts/auth-context"

// Use:
import { useSignIn, useSignUp, useAuth } from "@clerk/nextjs"
```

## Testing the Integration

1. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test authentication:**
   - Visit `http://localhost:3000/login`
   - Try signing up/logging in
   - Check that you're redirected to dashboard

3. **Test protected routes:**
   - Try accessing `/client/dashboard` without login
   - Should redirect to `/login`

## Using Clerk in Your Components

### Get Current User
```tsx
import { useUser } from "@clerk/nextjs";

function MyComponent() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;
  
  return <div>Hello {user.firstName}!</div>;
}
```

### Make Authenticated API Calls
```tsx
import { useAuth } from "@clerk/nextjs";

function MyComponent() {
  const { getToken } = useAuth();
  
  const fetchData = async () => {
    const token = await getToken();
    const response = await fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  };
}
```

### Protect Components
```tsx
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

function MyComponent() {
  return (
    <>
      <SignedIn>
        <div>This content is only visible to signed-in users</div>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}
```

## Important Notes

### User Roles
Your current app uses `client`, `performer`, and `admin` roles. With Clerk, you'll need to:

1. Store role in Clerk's `publicMetadata`:
   - In Clerk Dashboard → Users → Select user → Metadata
   - Add: `{ "role": "client" }`

2. Or store role in your MongoDB and sync with webhooks

### Migration from Custom Auth
You'll need to decide:
- Migrate existing users to Clerk, OR
- Run dual auth systems temporarily, OR
- Fresh start with Clerk only

## Next Steps

1. Choose Option A or B above
2. Test login/signup flow
3. Update navigation components to use Clerk's `<UserButton />`
4. Add role management
5. Update all API calls to use Clerk tokens

## Resources
- [Clerk Next.js Docs](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Clerk Hooks](https://clerk.com/docs/references/nextjs/overview)
