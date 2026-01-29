# 🚀 Vercel Deployment Guide for FoodSaver

## Prerequisites
- GitHub account with this repo pushed
- Vercel account (free tier works)
- PostgreSQL database (options below)

---

## Step 1: Get a PostgreSQL Database

Choose ONE of these options:

### Option A: Vercel Postgres ⭐ (Easiest - Recommended!)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Storage** tab
3. Click **Create Database** → **Postgres**
4. Choose a region → Click **Create**
5. Connect to your project
6. ✅ **Environment variables are added automatically!**

### Option B: Neon (Free tier)
1. Go to [neon.tech](https://neon.tech)
2. Create account and new project
3. Copy your connection string
4. Add as `DATABASE_URL` in Vercel env variables

### Option C: Supabase (Free tier)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings** → **Database** → **Connection String**
4. Add as `DATABASE_URL` in Vercel env variables

---

## Step 2: Deploy to Vercel

### Via Vercel Dashboard:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Click **Deploy** (it will fail first time - that's okay!)

### Via CLI:
```bash
npm i -g vercel
vercel
```

---

## Step 3: Add Environment Variables

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Add these variables:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your PostgreSQL connection string | ✅ Yes |
| `DIRECT_URL` | Your PostgreSQL direct connection | ✅ Yes |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | ✅ Yes |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard | ⚪ Optional |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard | ⚪ Optional |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard | ⚪ Optional |
| `RESEND_API_KEY` | From Resend dashboard | ⚪ Optional |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | From Mapbox account | ⚪ Optional |

---

## Step 4: Push Database Schema

After adding env variables, run locally:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database (optional)
npx prisma db seed
```

Or use Vercel's build command to handle migrations:
1. Go to **Settings** → **General** → **Build & Development Settings**
2. Override Build Command: `prisma generate && prisma db push && next build`

---

## Step 5: Redeploy

1. Go to **Deployments** tab
2. Click the three dots on the failed deployment
3. Click **Redeploy**

---

## 🎉 Done!

Your app should now be live at `https://your-project.vercel.app`

---

## Troubleshooting

### "PrismaClient not found"
- Ensure `postinstall` script exists in package.json
- Redeploy after adding env variables

### Database connection errors
- Check `DATABASE_URL` format
- Ensure `?sslmode=require` is in the URL
- Verify IP whitelist if using Supabase

### NextAuth errors
- Ensure `NEXTAUTH_URL` matches your Vercel domain exactly
- Generate a strong `NEXTAUTH_SECRET`

---

## Test Accounts After Seeding

| Role | Email | Password |
|------|-------|----------|
| Donor | donor@foodsaver.org | password123 |
| Receiver | receiver@foodsaver.org | password123 |
| Volunteer | volunteer@foodsaver.org | password123 |
| Admin | admin@foodsaver.org | password123 |
