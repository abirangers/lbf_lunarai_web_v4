# Deployment Guide - LunarAI Beauty Business Analysis

## Build Error Fixes Applied

### 1. **Next.js Configuration Updates**

- ✅ Fixed deprecated `images.domains` → Updated to `images.remotePatterns`
- ✅ Added default environment variables to prevent build failures
- ✅ Configured proper image optimization settings

### 2. **API Route Fixes**

- ✅ Updated `/api/result/[id]/route.ts` to use async params (Next.js 14+ requirement)
- ✅ Ensured all dynamic routes properly await params

### 3. **Environment Variables**

The app works in **MOCK MODE** without backend configuration, but for full functionality:

## Required Environment Variables for Production

Add these in your deployment platform (Vercel/Bolt):

```bash
# Application (Required)
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_FORM_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_LANGUAGE=id

# Database (Optional - enables real backend)
DATABASE_URL=your_neon_database_url

# n8n Webhooks (Optional - enables workflow automation)
N8N_TEST_WEBHOOK=https://your-n8n-instance/webhook-test/lbf_skincare
N8N_PRODUCTION_WEBHOOK=https://your-n8n-instance/webhook/lbf_skincare
N8N_WEBHOOK_SECRET=your_webhook_secret
```

## Deployment Steps

### For Bolt.new / Vercel

1. **Push your code to GitHub** (if not already done)

2. **Import to Vercel/Bolt:**
   - Connect your repository
   - Framework: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add the variables listed above
   - At minimum, add the `NEXT_PUBLIC_*` variables

4. **Deploy:**
   - Click "Deploy"
   - The app will work in MOCK MODE even without DATABASE_URL

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm start
```

## Mock Mode vs Real Mode

### Mock Mode (No DATABASE_URL)

- ✅ Form submission works
- ✅ Returns success response
- ❌ No data persistence
- ❌ No workflow automation
- ❌ No report generation

### Real Mode (With DATABASE_URL)

- ✅ Full data persistence
- ✅ Workflow automation via n8n
- ✅ Report generation
- ✅ Analytics tracking

## Troubleshooting

### Build Fails with "Image domains deprecated"

**Fixed** ✅ - Updated to `remotePatterns` in `next.config.js`

### Build Fails with "params is not awaited"

**Fixed** ✅ - Updated API routes to await params

### Build Fails with "Missing environment variables"

**Fixed** ✅ - Added default values in `next.config.js`

### Runtime Error: "Database not initialized"

This is expected in MOCK MODE. Add `DATABASE_URL` to enable real backend.

### Webhook Dispatch Fails

Check that `N8N_PRODUCTION_WEBHOOK` is set correctly and the endpoint is accessible.

## Testing Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Port Configuration

- Development: `http://localhost:3004`
- Production: Assigned by platform

## Notes

- The app is designed to work without backend configuration (MOCK MODE)
- All database operations are gracefully handled with null checks
- Environment variables are validated at runtime
- Build process is optimized for serverless deployment
