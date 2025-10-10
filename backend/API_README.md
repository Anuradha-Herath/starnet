# Starnet Backend

A Nest.js backend for the Starnet application with authentication using Supabase and JWT.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-jwt-secret-key
PORT=8080
```

3. Set up the database by running the SQL script in `migrations/001_initial_setup.sql` in your Supabase SQL editor.

4. Start the development server:
```bash
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires JWT token)
- `POST /api/auth/refresh` - Refresh JWT token (requires JWT token)

### Health Check

- `GET /api/health` - Health check endpoint

## Testing the API

You can test the endpoints using curl or any HTTP client:

### Health Check
```bash
curl http://localhost:8080/api/health
```

### Signup
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "role": "client"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

The application uses two tables:

1. `users` - User profile information
2. `user_auth` - Password hashes and authentication data

Run the `migrations/001_initial_setup.sql` script to create the required tables.