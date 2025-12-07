# RUJU Backend - Quick Start Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Create PostgreSQL Database

Open PostgreSQL and run:

```sql
CREATE DATABASE ruju_factcheck;
```

## Step 3: Run Database Migration

```bash
psql -U postgres -d ruju_factcheck -f migrations/001_initial_schema.sql
```

Or if you're on Windows with PostgreSQL installed:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d ruju_factcheck -f migrations\001_initial_schema.sql
```

## Step 4: Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and update:
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Generate a random string (e.g., use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 RUJU Backend Server running on port 5000
📍 Environment: development
🌐 CORS enabled for: http://localhost:3000
✅ Database connected successfully
```

## Step 6: Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"fullName\":\"Test User\"}"

# Verify a claim
curl -X POST http://localhost:5000/api/verify/text \
  -H "Content-Type: application/json" \
  -d "{\"claim\":\"Is the sky blue?\",\"lang\":\"EN\"}"
```

## Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running
- Check your `.env` file has correct database credentials
- Verify the database `ruju_factcheck` exists

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 5001)

### Gemini API Error
- Verify your `GEMINI_API_KEY` in `.env` is correct
- Check you have API quota remaining

## Next Steps

1. ✅ Backend is running
2. Update frontend to call backend APIs instead of direct Gemini calls
3. Test end-to-end flow
4. Deploy to production
