# StarNet Backend - Clerk Authentication Setup

## Overview
This backend uses:
- **NestJS** - Framework
- **MongoDB Atlas** - Database
- **Clerk** - Authentication & User Management

## Setup Instructions

### 1. Clerk Account Setup

1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose your authentication methods (Email, Google, etc.)

### 2. Get Your Clerk Keys

From your Clerk Dashboard:

1. Go to **API Keys** section
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Configure Environment Variables

Update your `.env` file:

```bash
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Clerk Configuration
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Set Up Clerk Webhooks

Webhooks keep your database synced with Clerk user changes.

1. In Clerk Dashboard, go to **Webhooks**
2. Click **+ Add Endpoint**
3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/webhooks/clerk
   ```
   For local development with ngrok:
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/clerk
   ```
4. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add it to your `.env` as `CLERK_WEBHOOK_SECRET`

### 5. Install Dependencies

```bash
cd backend
npm install
```

### 6. Run the Backend

```bash
npm run start:dev
```

The server will start on `http://localhost:8080`

## API Endpoints

### Public Endpoints
- `GET /api` - Welcome message
- `GET /api/health` - Health check
- `GET /api/test-db` - Test MongoDB connection

### Protected Endpoints (Requires Authentication)
- `GET /api/users/me` - Get current user info

### Webhook Endpoints
- `POST /api/webhooks/clerk` - Clerk webhook handler

## How to Protect Routes

Use the `@UseGuards(ClerkAuthGuard)` decorator:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { CurrentUser, UserId } from './decorators/clerk.decorator';

@Controller('example')
export class ExampleController {
  
  @Get('protected')
  @UseGuards(ClerkAuthGuard)
  async getProtectedData(@UserId() userId: string, @CurrentUser() auth: any) {
    return {
      message: 'This is protected data',
      userId,
      auth,
    };
  }
}
```

## Frontend Integration

In your Next.js frontend:

1. Install Clerk:
   ```bash
   npm install @clerk/nextjs
   ```

2. Wrap your app with `ClerkProvider` in `layout.tsx`:
   ```tsx
   import { ClerkProvider } from '@clerk/nextjs'
   
   export default function RootLayout({ children }) {
     return (
       <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
         <html lang="en">
           <body>{children}</body>
         </html>
       </ClerkProvider>
     )
   }
   ```

3. Make authenticated API calls:
   ```tsx
   import { useAuth } from '@clerk/nextjs';
   
   function MyComponent() {
     const { getToken } = useAuth();
     
     const fetchData = async () => {
       const token = await getToken();
       const response = await fetch('http://localhost:8080/api/users/me', {
         headers: {
           'Authorization': `Bearer ${token}`,
         },
       });
       const data = await response.json();
       return data;
     };
   }
   ```

## Project Structure

```
backend/
├── src/
│   ├── decorators/
│   │   └── clerk.decorator.ts       # @CurrentUser, @UserId decorators
│   ├── guards/
│   │   └── clerk-auth.guard.ts      # Authentication guard
│   ├── schemas/
│   │   └── user.schema.ts           # MongoDB user schema
│   ├── users/
│   │   ├── users.controller.ts      # User endpoints
│   │   ├── users.service.ts         # User business logic
│   │   └── users.module.ts          # User module
│   ├── webhooks/
│   │   ├── webhook.controller.ts    # Webhook handlers
│   │   └── webhook.module.ts        # Webhook module
│   ├── app.module.ts                # Main app module
│   └── main.ts                      # Entry point
└── .env                              # Environment variables
```

## Testing

### Test MongoDB Connection
```bash
curl http://localhost:8080/api/test-db
```

### Test Protected Route (with auth token)
```bash
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:8080/api/users/me
```

## Common Issues

### Issue: "Invalid or expired token"
- Make sure you're sending the Clerk session token in the Authorization header
- Token should be obtained from `getToken()` on the frontend

### Issue: "Webhook signature verification failed"
- Verify `CLERK_WEBHOOK_SECRET` is correct
- Make sure you're using the signing secret from the webhook configuration

### Issue: "User not found in database"
- Ensure webhooks are properly configured
- Manually trigger a user update in Clerk Dashboard to sync

## Next Steps

1. ✅ Set up Clerk account
2. ✅ Configure environment variables
3. ✅ Set up webhooks
4. Add role-based access control (RBAC)
5. Add user metadata management
6. Implement additional protected endpoints

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [MongoDB Documentation](https://www.mongodb.com/docs)
