# Starnet Backend

A NestJS backend for the Starnet artist booking platform, providing authentication, user management, and API services.

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL (hosted on Supabase)
- **Authentication**: JWT with refresh tokens
- **ORM**: Supabase client for database operations

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL via Supabase
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: class-validator

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and database

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the backend directory:
   ```env
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   JWT_SECRET=your-super-secret-jwt-key-32-chars-min
   PORT=8081
   ```

3. **Database Setup:**
   Run the initial migration script in your Supabase SQL editor:
   ```sql
   -- Execute: backend/migrations/001_initial_setup.sql
   ```

### Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Docker
docker build -t starnet-backend .
docker run -p 8081:8081 starnet-backend
```

The backend will start on `http://localhost:8081`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user profile (JWT required)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Health Check
- `GET /api/health` - Application health status

## 🗄️ Database Schema

### Tables

#### `users`
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'performer', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `user_auth`
```sql
CREATE TABLE user_auth (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id),
    password_hash VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    refresh_token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development

### Project Structure
```
backend/
├── src/
│   ├── app.controller.ts      # Health check endpoint
│   ├── app.module.ts          # Root application module
│   ├── app.service.ts         # Application service
│   ├── auth/                  # Authentication module
│   │   ├── auth.controller.ts # Auth API endpoints
│   │   ├── auth.service.ts    # Auth business logic
│   │   ├── auth.module.ts     # Auth module definition
│   │   ├── jwt.strategy.ts    # JWT validation strategy
│   │   ├── jwt-auth.guard.ts  # JWT route protection
│   │   ├── refresh-token.strategy.ts
│   │   ├── refresh-token.guard.ts
│   │   └── dto/               # Request/Response DTOs
│   ├── common/                # Shared utilities
│   ├── shared/                # Shared services (Supabase)
│   └── main.ts                # Application entry point
├── migrations/                # Database migration scripts
├── test/                      # Test files
├── Dockerfile                 # Docker configuration
└── package.json               # Dependencies and scripts
```

### Available Scripts

```bash
npm run start          # Start production server
npm run start:dev      # Start development server with hot reload
npm run build          # Build for production
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage
```

## 🔐 Security Features

- **JWT Authentication**: Stateless authentication with access and refresh tokens
- **Password Security**: bcrypt hashing with salt rounds
- **Token Expiration**: Access tokens (1 hour), Refresh tokens (7 days)
- **Input Validation**: class-validator for request validation
- **CORS**: Configured for frontend communication
- **Rate Limiting**: Built-in NestJS rate limiting

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:cov
```

## 📚 Documentation

- **[API Documentation](../docs/api/backend.md)** - Complete API reference
- **[Authentication Guide](../docs/authentication/)** - Auth system documentation
- **[Troubleshooting](../docs/troubleshooting/)** - Common issues and fixes

## 🚀 Deployment

### Environment Variables for Production
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
JWT_SECRET=your-production-jwt-secret-min-32-chars
PORT=8081
NODE_ENV=production
```

### Docker Deployment
```bash
# Build and run with Docker
docker build -t starnet-backend .
docker run -p 8081:8081 --env-file .env starnet-backend
```

## 🤝 Contributing

1. Follow the existing code style and structure
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR

## 📞 Support

For issues and questions:
- Check the [troubleshooting guide](../docs/troubleshooting/)
- Review the [authentication docs](../docs/authentication/)
- Create an issue in the repository

## 📝 License

This project is licensed under the MIT License.
