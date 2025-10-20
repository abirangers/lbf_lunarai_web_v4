# 🚨 Vercel Deployment Troubleshooting

## ❌ Your Current Issue

**Status**: Build Failed di Vercel
**Visible**: npm warnings tentang deprecated packages (eslint, glob, dll)
**Reality**: Warnings BUKAN penyebab build failed!

---

## 🔍 Finding the Real Error

### Step 1: Check Build Logs

Di Vercel dashboard Anda:

1. **Scroll down** di Build Logs section
2. **Cari error sebenarnya** (bukan "npm warn")
3. **Look for**:
   - `Error:` (dengan huruf kapital E)
   - `❌` atau `✖`
   - `Failed to compile`
   - `Build failed`
   - `Module not found`
   - `Type error`

### Step 2: Common Locations

Error biasanya ada di:

- **Bagian bawah logs** (setelah semua warnings)
- **Setelah "Running 'vercel build'"**
- **Sebelum "Build Failed" message**

---

## ✅ Fixes Applied

### 1. **Created `.npmrc`**

Suppress warnings dan optimize installation:

```
legacy-peer-deps=true
strict-peer-dependencies=false
audit=false
fund=false
```

### 2. **Updated `package.json`**

- Added `check-build` script untuk test local
- Added `vercel-build` script
- Updated husky to v9

### 3. **Created Build Checker**

Script untuk check build sebelum deploy:

```bash
npm run check-build
```

---

## 🎯 Next Steps

### Option 1: Test Build Locally (Recommended)

```bash
# 1. Clean install
rm -rf node_modules package-lock.json .next
npm install

# 2. Check build
npm run check-build

# 3. If success, commit and push
git add .
git commit -m "fix: deployment configuration"
git push
```

### Option 2: Find Real Error in Vercel

1. **Go to Vercel dashboard**
2. **Click on failed deployment**
3. **Expand "Build Logs"**
4. **Scroll to bottom**
5. **Screenshot the ERROR (not warnings)**
6. **Share screenshot** untuk analisa lebih lanjut

### Option 3: Force Redeploy

Di Vercel dashboard:

1. Click **"Redeploy"** button
2. Check **"Use existing Build Cache"** = OFF
3. Click **"Redeploy"**

---

## 🔧 Common Errors & Solutions

### Error 1: "Module not found: Can't resolve..."

**Cause**: Missing dependency

**Fix**:

```bash
npm install <missing-package>
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

### Error 2: "Type error: ..."

**Cause**: TypeScript type checking failed

**Fix**: Already handled by `ignoreBuildErrors: true` in next.config.js

If still fails, check the specific type error and fix it.

### Error 3: "Build exceeded maximum duration"

**Cause**: Build timeout (Vercel free tier: 45 min)

**Fix**:

- Reduce dependencies
- Use dynamic imports
- Optimize build process

### Error 4: "Command failed with exit code 1"

**Cause**: Build command failed

**Fix**: Check logs for specific error above this message

### Error 5: "Out of memory"

**Cause**: Build process uses too much memory

**Fix**:

- Reduce bundle size
- Upgrade Vercel plan
- Optimize dependencies

---

## ⚙️ Vercel Configuration Checklist

### Environment Variables

Go to: **Project Settings → Environment Variables**

Add these:

```bash
# Required (already in vercel.json, but good to set explicitly)
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_FORM_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_LANGUAGE=id

# Optional (for full functionality)
DATABASE_URL=your_database_url
N8N_TEST_WEBHOOK=your_test_webhook_url
N8N_PRODUCTION_WEBHOOK=your_production_webhook_url
N8N_WEBHOOK_SECRET=your_secret_key
```

**Important**: Select environment scope:

- ✅ Production
- ✅ Preview
- ✅ Development

### Build & Development Settings

Go to: **Project Settings → General → Build & Development Settings**

Verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (or leave empty for default)
- **Output Directory**: `.next` (or leave empty for default)
- **Install Command**: `npm install` (or leave empty for default)
- **Node.js Version**: 18.x or 20.x

### Root Directory

If your app is in a subdirectory:

- Set **Root Directory** to the correct path
- Example: `apps/bolt-vercel`

---

## 🧪 Local Testing Commands

Before deploying, test locally:

```bash
# 1. Install dependencies
npm install

# 2. Check build (new script)
npm run check-build

# 3. Or manual build
npm run build

# 4. Test production build
npm run start

# 5. Check for errors
# If all pass, deploy!
```

---

## 📊 Understanding Warnings vs Errors

### ⚠️ Warnings (Safe to Ignore)

```
npm warn deprecated eslint@8.57.1
npm warn deprecated glob@7.2.3
npm warn deprecated inflight@1.0.6
npm warn deprecated rimraf@3.0.2
```

**These are just informational** - they don't cause build failures.

### ❌ Errors (Must Fix)

```
Error: Module not found
Error: Type error
Error: Build failed
Failed to compile
```

**These WILL cause build failures** - must be fixed.

---

## 🔍 Debugging Steps

### 1. Check Vercel Logs

```
Deployment → Build Logs → Scroll to bottom
```

### 2. Check Local Build

```bash
npm run build
```

### 3. Check TypeScript

```bash
npm run type-check
```

### 4. Check ESLint

```bash
npm run lint
```

### 5. Check Dependencies

```bash
npm list --depth=0
```

---

## 📸 What to Share if Still Failing

If masih error setelah apply fixes:

1. **Screenshot** dari Vercel Build Logs (bagian error, bukan warning)
2. **Last 50 lines** dari build logs
3. **Environment variables** yang sudah set (hide sensitive values)
4. **Local build result**: `npm run build` output

---

## 💡 Pro Tips

### Tip 1: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from CLI (see errors immediately)
vercel --prod
```

### Tip 2: Check Deployment Recommendations

Di Vercel dashboard, ada "**3 Recommendations**" - click untuk lihat suggestions.

### Tip 3: Enable Build Logs Download

Di Vercel, you can download full build logs:

- Click on deployment
- Click "..." menu
- Select "Download Build Logs"

### Tip 4: Use Vercel Preview Deployments

Test di preview environment dulu sebelum production:

```bash
# Push to branch (not main)
git checkout -b test-deployment
git push origin test-deployment

# Vercel will create preview deployment
# Test it first before merging to main
```

---

## 🚀 Quick Fix Checklist

- [ ] Created `.npmrc` file ✅
- [ ] Updated `package.json` ✅
- [ ] Test build locally: `npm run check-build`
- [ ] Set environment variables di Vercel
- [ ] Check Vercel build settings
- [ ] Find real error in logs (not warnings)
- [ ] Fix the actual error
- [ ] Commit and push
- [ ] Redeploy

---

## 📞 Support

Jika masih stuck:

1. **Share screenshot** dari actual error (bukan warnings)
2. **Share last 50 lines** dari build logs
3. **Share local build output**: `npm run build`

---

## 🎓 Learn More

- [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Troubleshooting Builds](https://vercel.com/docs/deployments/troubleshoot-a-build)

---

**Status**: Fixes applied ✅

**Next**: Test locally dengan `npm run check-build`, lalu deploy ulang!
