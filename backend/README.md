# Starnet Backend

A NestJS backend for the Starnet artist booking platform, providing authentication, user management, and API services.

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: SQLite
- **Authentication**: Clerk (JWT verification and user sync)
- **ORM**: Prisma

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk (`@clerk/backend` for JWT verification)
- **Validation**: class-validator

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Copy `.env.example` to `.env` in the backend directory and set:
   ```env
   DATABASE_URL="postgresql://..."
   CLERK_SECRET_KEY=sk_test_...   # From Clerk Dashboard → API Keys
   PORT=8081
   ```

3. **Database Setup:**
   Generate the Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
   This applies the schema to your PostgreSQL database.

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

### Authentication (Clerk)
- `GET /api/auth/me` - Get current user profile (Clerk JWT required); creates/syncs user from Clerk
- `PATCH /api/auth/me` - Update profile (e.g. `role`: client | performer, `phone`)
- Sign-in and sign-up are handled by the frontend with Clerk; the backend only verifies the Clerk JWT and syncs the user to the database.

### Health Check
- `GET /api/health` - Application health status

## 🗄️ Database Schema

The schema is defined in **`prisma/schema.prisma`** and managed by Prisma. Main models:

- **User** – id, email, name, role, phone, createdAt, updatedAt
- **UserAuth** – userId, passwordHash, refreshToken, refreshTokenExpiresAt (one-to-one with User)

After changing the schema, run:
```bash
npm run prisma:migrate
```

## 🔧 Development

### Project Structure

The backend follows a **feature-based** NestJS layout with clear separation of concerns:

```
backend/
├── src/
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root application module
│   ├── app.controller.ts      # Root API (e.g. /api, /api/test-db)
│   ├── app.service.ts         # Application service
│   │
│   ├── common/                # Shared code across modules
│   │   ├── filters/           # Exception filters (e.g. AllExceptionsFilter)
│   │   └── common.module.ts   # Optional shared module
│   │
│   ├── prisma/                # Database layer (Prisma ORM)
│   │   ├── prisma.module.ts   # Global Prisma module
│   │   └── prisma.service.ts  # Prisma client service
│   │
│   ├── health/                # Health check feature module
│   │   ├── health.module.ts
│   │   └── health.controller.ts   # GET /api/health
│   │
│   └── auth/                  # Authentication feature module
│       ├── auth.module.ts
│       ├── auth.controller.ts # Auth API endpoints
│       ├── auth.service.ts    # Auth business logic
│       ├── dto/               # Request/response DTOs
│       │   └── auth.dto.ts
│       ├── guards/            # Route guards (JWT, refresh token)
│       ├── strategies/        # Passport strategies
│       └── interfaces/        # TypeScript interfaces (e.g. User)
│
├── prisma/
│   ├── schema.prisma          # Database schema (SQLite)
│   └── migrations/            # Prisma migrations
├── test/                      # E2E tests
├── Dockerfile
└── package.json
```

**Conventions:** Each feature lives in its own folder with `*.module.ts`, `*.controller.ts`, `*.service.ts`. Shared pieces (filters, guards, decorators) go under `common/`. Add new features as new top-level folders under `src/` (e.g. `users/`, `bookings/`).

### Available Scripts

```bash
npm run start          # Start production server
npm run start:dev      # Start development server with hot reload
npm run build          # Build for production
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
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
DATABASE_URL="file:./prod.db"
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
