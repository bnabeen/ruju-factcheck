# RUJU FactCheck Backend

Complete Express.js backend API for the RUJU FactCheck platform.

## Features

- ✅ JWT Authentication (Register/Login)
- ✅ AI-Powered Fact Checking (Text & Images)
- ✅ Rate Limiting & Security
- ✅ PostgreSQL Database
- ✅ TypeScript Support

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Gemini API Key

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE ruju_factcheck;
```

Run the migration script:

```bash
psql -U postgres -d ruju_factcheck -f migrations/001_initial_schema.sql
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Generate a random secret key
- Other settings as needed

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Verification

- `POST /api/verify/text` - Verify text claim
- `POST /api/verify/image` - Verify image
- `GET /api/verify/history` - Get verification history (requires auth)

### Health Check

- `GET /health` - Server health status

## Testing the API

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Verify Text Claim

```bash
curl -X POST http://localhost:5000/api/verify/text \\
  -H "Content-Type: application/json" \\
  -d '{
    "claim": "Is the sky blue?",
    "lang": "EN"
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.ts        # Main server file
├── migrations/          # Database migrations
├── .env.example         # Environment template
├── package.json
└── tsconfig.json
```

## Next Steps

1. ✅ Backend is ready
2. Update frontend to use backend APIs
3. Deploy to production (Railway/Render)
4. Add more features (Articles CRUD, Claims, etc.)

## Deployment

### Railway (Recommended)

1. Create account at railway.app
2. Create new project
3. Add PostgreSQL service
4. Deploy from GitHub
5. Set environment variables

### Render

1. Create account at render.com
2. Create new Web Service
3. Add PostgreSQL database
4. Connect GitHub repo
5. Set environment variables

## License

MIT
