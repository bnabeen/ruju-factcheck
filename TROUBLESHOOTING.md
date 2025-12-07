# Troubleshooting "Server error: 500"

## Quick Diagnosis

When you see "Server error: 500", check the **backend console** (where you ran `npm run dev` in the backend folder). The actual error message will be printed there.

## Common Causes and Solutions

### 1. Missing Gemini API Key (Most Common)

**Symptoms:**
- Error message mentions "API key" or "GEMINI_API_KEY"
- Backend console shows: "GEMINI_API_KEY is not configured"

**Solution:**
1. Create a `.env` file in the `backend` folder (if it doesn't exist)
2. Add this line:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Get your API key from: https://aistudio.google.com/apikey
4. Restart the backend server (stop with Ctrl+C, then run `npm run dev` again)

### 2. Invalid Gemini API Key

**Symptoms:**
- Error mentions "401" or "403" or "Invalid"
- Backend console shows authentication errors

**Solution:**
1. Verify your API key is correct in the `.env` file
2. Make sure there are no extra spaces or quotes around the key
3. Check that your API key hasn't been revoked
4. Generate a new API key if needed

### 3. API Quota Exceeded

**Symptoms:**
- Error mentions "quota" or "429"
- You've made many requests recently

**Solution:**
1. Check your Gemini API usage at: https://aistudio.google.com/
2. Wait for quota to reset or upgrade your plan

### 4. Backend Server Not Running

**Symptoms:**
- Error: "Cannot connect to backend server"
- Proxy errors in frontend console

**Solution:**
1. Open a terminal
2. Navigate to the `backend` folder
3. Run: `npm run dev`
4. You should see: "🚀 RUJU Backend Server running on port 5000"

## How to Check Backend Logs

1. Look at the terminal where you ran `npm run dev` in the backend folder
2. You'll see error messages like:
   ```
   Text verification error: Error: GEMINI_API_KEY is not configured...
   ```
3. This tells you exactly what's wrong

## Testing the Backend Directly

You can test if the backend is working by running this in a new terminal:

```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

Test verification:

```bash
curl -X POST http://localhost:5000/api/verify/text \
  -H "Content-Type: application/json" \
  -d "{\"claim\":\"Test claim here\",\"lang\":\"EN\"}"
```

This will show you the exact error message from the backend.

## Still Having Issues?

1. **Check backend console** - The error message there is the most helpful
2. **Verify .env file exists** in the `backend` folder
3. **Check .env file format** - Should be `KEY=value` (no spaces around =)
4. **Restart backend** after changing .env file
5. **Check Node.js version** - Should be 18 or higher

