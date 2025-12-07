# Debugging "Server error: 500"

## Step 1: Check the Network Tab Response

1. Open your browser's Developer Tools (F12)
2. Go to the **Network** tab
3. Find the failed request (the one with status 500, named "text")
4. **Click on it** to see details
5. Go to the **Response** or **Preview** tab
6. **Copy the error message** you see there

This will tell you exactly what the backend is saying is wrong.

## Step 2: Check Backend Console

Look at the terminal where you ran `npm run dev` in the `backend` folder. You should see error messages like:

```
Text verification error: Error: GEMINI_API_KEY is not configured...
```

This is the most important information!

## Step 3: Verify Gemini API Key

1. Open the `backend` folder
2. Open the `.env` file
3. Check if you have this line:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

**Important:**
- The key should NOT have quotes around it
- There should be NO spaces around the `=` sign
- The key should be a valid Gemini API key from https://aistudio.google.com/apikey

## Step 4: Common Issues

### Issue: Missing API Key
**Backend console shows:** "GEMINI_API_KEY is not configured"

**Fix:**
1. Add `GEMINI_API_KEY=your_key_here` to `backend/.env`
2. Restart the backend server (Ctrl+C, then `npm run dev`)

### Issue: Invalid API Key
**Backend console shows:** "401" or "403" errors

**Fix:**
1. Verify your API key is correct
2. Get a new key from https://aistudio.google.com/apikey
3. Update `.env` and restart backend

### Issue: Backend Not Running
**Network tab shows:** Connection refused or no response

**Fix:**
1. Open a terminal
2. `cd backend`
3. `npm run dev`
4. You should see: "🚀 RUJU Backend Server running on port 5000"

## Step 5: Test Backend Directly

Open a new terminal and test:

```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

Then test verification:

```bash
curl -X POST http://localhost:5000/api/verify/text ^
  -H "Content-Type: application/json" ^
  -d "{\"claim\":\"Test claim\",\"lang\":\"EN\"}"
```

This will show you the exact error message.

## What to Share for Help

If you're still stuck, share:
1. The **Response** tab content from the Network tab (the 500 error)
2. The **backend console output** (the error message)
3. Whether `GEMINI_API_KEY` exists in your `.env` file (don't share the actual key!)

