# Backend Setup Guide

## Quick Fix for "Could not verify claim" Error

The error occurs because either:
1. **Backend server is not running** - The frontend can't connect to the backend
2. **Gemini API key is missing** - The backend needs a valid API key to verify claims

## Step 1: Start the Backend Server

Open a new terminal and run:

```bash
cd backend
npm install  # If you haven't already
npm run dev
```

You should see:
```
🚀 RUJU Backend Server running on port 5000
📍 Environment: development
🌐 CORS enabled for: http://localhost:3000
```

## Step 2: Configure Gemini API Key

1. Create a `.env` file in the `backend` folder:

```bash
cd backend
# On Windows, create the file manually or use:
type nul > .env
```

2. Add your Gemini API key to the `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration (optional for basic testing)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ruju_factcheck
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_random_secret_here
JWT_EXPIRES_IN=7d

# Gemini API Configuration - REQUIRED!
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

3. **Get a Gemini API Key:**
   - Go to https://aistudio.google.com/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key and paste it in your `.env` file as `GEMINI_API_KEY`

## Step 3: Restart the Backend

After adding the API key, restart the backend server:

```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

You should now see:
```
✅ Gemini API key configured
```

## Step 4: Test the Setup

1. Make sure both servers are running:
   - Frontend: `http://localhost:3000` (from the root directory)
   - Backend: `http://localhost:5000` (from the backend directory)

2. Try verifying a claim in the frontend - it should work now!

## Troubleshooting

### "Backend server is not running"
- Make sure you're running `npm run dev` in the `backend` folder
- Check that port 5000 is not being used by another application

### "Gemini API key is missing or invalid"
- Verify your `.env` file exists in the `backend` folder
- Check that `GEMINI_API_KEY=your_key_here` is set correctly
- Make sure there are no spaces around the `=` sign
- Restart the backend server after adding the key

### "Cannot connect to backend server"
- Verify the backend is running on port 5000
- Check the Vite proxy configuration in `vite.config.ts`
- Make sure no firewall is blocking the connection

### Database Connection Errors
- For basic testing, you can skip database setup
- The verification endpoints will work without a database
- Only authentication features require the database

## Quick Test

Test the backend directly:

```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

Test verification:

```bash
curl -X POST http://localhost:5000/api/verify/text \
  -H "Content-Type: application/json" \
  -d "{\"claim\":\"The sky is blue\",\"lang\":\"EN\"}"
```

