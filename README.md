# ArtistLK - Artist Booking Platform

A full-stack web application for booking artists and performers in Sri Lanka, built with Ballerina backend and Next.js frontend.

## 🏗️ Architecture

- **Backend**: Ballerina 2201.12.7 with PostgreSQL (Supabase)
- **Frontend**: Next.js 15.2.4 with TypeScript and Tailwind CSS
- **Authentication**: JWT tokens with automatic refresh
- **Database**: PostgreSQL hosted on Supabase

## 📋 Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Ballerina** (2201.12.7 or higher)
- **Java** (required for Ballerina)

### Installing Ballerina

1. Download Ballerina from [https://ballerina.io/downloads/](https://ballerina.io/downloads/)
2. Follow the installation instructions for your operating system
3. Verify installation: `bal version`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ballerina25
```

### 2. Backend Setup

#### 2.1 Configure Database Connection

Navigate to the backend directory and create/update the `Config.toml` file:

```bash
cd backend
```

Create or update `Config.toml` with your database configuration:

```toml
[backend.config]
database.host = "your-supabase-host.supabase.co"
database.port = 5432
database.name = "postgres"
database.user = "postgres"
database.password = "your-database-password"

server.port = 8080
server.host = "localhost"

ssl.mode = "require"

jwt.secret = "your-super-secret-jwt-key-should-be-at-least-32-characters-long"
jwt.issuer = "artistlk"
jwt.audience = "artistlk-users"
jwt.expiry = 86400
```

#### 2.2 Database Schema

Make sure your PostgreSQL database has the following table structure:

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'performer', 'admin')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3 Install Dependencies

```bash
# The dependencies are managed by Ballerina automatically
# Dependencies.toml will be updated when you build
```

#### 2.4 Run the Backend

```bash
# From the root directory
bal run backend
```

The backend server will start on `http://localhost:8080`

**Expected Output:**
```
Compiling source
        msi/backend:0.1.0
HINT [main.bal:(26:5,26:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
...
Running executable
Database initialized successfully
ArtistLK API Server started on port 8080
```

### 3. Frontend Setup

#### 3.1 Navigate to Frontend Directory

```bash
# Open a new terminal
cd frontend
```

#### 3.2 Install Dependencies

```bash
# Using npm
npm install

# OR using pnpm
pnpm install
```

#### 3.3 Run the Frontend

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

The frontend will start on `http://localhost:3000`

**Expected Output:**
```
▲ Next.js 15.2.4
- Local:        http://localhost:3000
- Network:      http://your-ip:3000

✓ Ready in 5.7s
```

## 🔧 Configuration Details

### Backend Configuration (`backend/Config.toml`)

| Configuration | Description | Example |
|---------------|-------------|---------|
| `database.host` | Supabase database host | `db.xxxxx.supabase.co` |
| `database.port` | Database port (usually 5432) | `5432` |
| `database.name` | Database name | `postgres` |
| `database.user` | Database username | `postgres` |
| `database.password` | Database password | `your-password` |
| `server.port` | Backend server port | `8080` |
| `server.host` | Backend server host | `localhost` |
| `ssl.mode` | SSL connection mode | `require` |
| `jwt.secret` | JWT signing secret (32+ chars) | `your-secret-key` |
| `jwt.issuer` | JWT issuer name | `artistlk` |
| `jwt.audience` | JWT audience | `artistlk-users` |
| `jwt.expiry` | JWT expiry in seconds | `86400` (1 day) |

### Environment Variables (Optional)

You can also use environment variables by creating a `.env` file in the backend directory:

```env
DB_HOST=your-supabase-host.supabase.co
DB_PASSWORD=your-database-password
JWT_SECRET=your-jwt-secret-key
```

## 🧪 Testing the Application

### Backend API Endpoints

- **Health Check**: `GET http://localhost:8080/api/health`
- **User Signup**: `POST http://localhost:8080/api/auth/signup`
- **User Login**: `POST http://localhost:8080/api/auth/login`
- **Get Current User**: `GET http://localhost:8080/api/auth/me`
- **Refresh Token**: `POST http://localhost:8080/api/auth/refresh`

### Test User Registration

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0771234567",
    "password": "password123",
    "role": "client"
  }'
```

### Frontend Pages

- **Home**: `http://localhost:3000/`
- **Login**: `http://localhost:3000/login`
- **Signup**: `http://localhost:3000/signup`
- **Client Dashboard**: `http://localhost:3000/client/dashboard`
- **Performer Dashboard**: `http://localhost:3000/performer/dashboard`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

## 🔐 Authentication System

The application uses JWT-based authentication with automatic token refresh:

- **Access Tokens**: Valid for 1 day (86400 seconds)
- **Refresh Tokens**: Valid for 1 day (86400 seconds)
- **Automatic Refresh**: Tokens are automatically refreshed before API calls
- **Persistent Sessions**: Users stay logged in across browser refreshes

## 🐛 Troubleshooting

### Backend Issues

1. **Config Error**: "value not provided for required configurable variable"
   - Ensure `Config.toml` is properly formatted
   - Check all required fields are present
   - Verify the config is in `[backend.config]` section

2. **Database Connection Error**:
   - Verify Supabase credentials
   - Check SSL mode is set to "require"
   - Ensure database allows connections from your IP

3. **Port Already in Use**:
   - Change `server.port` in Config.toml
   - Kill existing processes: `netstat -ano | findstr :8080`

### Frontend Issues

1. **Module Not Found**:
   - Run `npm install` or `pnpm install`
   - Delete `node_modules` and reinstall

2. **API Connection Error**:
   - Ensure backend is running on port 8080
   - Check CORS configuration in backend
   - Verify API_BASE_URL in frontend code

3. **Authentication Issues**:
   - Clear browser localStorage
   - Check JWT secret matches between frontend and backend
   - Verify token expiry settings

## 🚀 Production Deployment

### Backend Deployment

1. Build the Ballerina project:
   ```bash
   bal build backend
   ```

2. Run the generated JAR:
   ```bash
   java -jar backend/target/bin/backend.jar
   ```

### Frontend Deployment

1. Build the Next.js project:
   ```bash
   cd frontend
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
ballerina25/
├── backend/                 # Ballerina backend
│   ├── modules/
│   │   ├── auth/           # Authentication module
│   │   ├── config/         # Configuration module
│   │   ├── database/       # Database module
│   │   └── types/          # Type definitions
│   ├── Config.toml         # Configuration file
│   ├── Ballerina.toml      # Ballerina project file
│   └── main.bal           # Main service file
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utility libraries
│   └── public/           # Static assets
└── README.md             # This file
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the Ballerina documentation: [https://ballerina.io/learn/](https://ballerina.io/learn/)
