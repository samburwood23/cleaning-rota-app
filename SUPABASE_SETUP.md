# 🚀 Supabase Setup Guide

This guide will walk you through setting up Supabase for your multi-user cleaning rota app.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up for a free account
2. Click "New Project"
3. Fill in the details:
   - **Name**: `cleaning-rota-app` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the closest to your users
   - **Pricing Plan**: Free (perfect for getting started)
4. Click "Create new project"
5. Wait 2-3 minutes for your project to be provisioned

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `/supabase/schema.sql` from this repository
4. Paste it into the SQL editor
5. Click "Run" or press `Ctrl+Enter`
6. You should see "Success. No rows returned" ✅

This creates:
- ✅ All database tables (households, members, tasks, assignments)
- ✅ Row Level Security (RLS) policies for data protection
- ✅ Indexes for fast queries
- ✅ Real-time subscriptions
- ✅ Automatic triggers

## Step 3: Get Your API Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these two values:

   **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Configure Your App

### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase URL |
   | `VITE_SUPABASE_ANON_KEY` | Your anon key |
   | `HF_API_KEY` | Your Hugging Face key (for AI features) |

4. Select all environments (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application

## Step 5: Configure Email Authentication (Optional but Recommended)

By default, Supabase sends confirmation emails from their servers. For production, you should configure your own SMTP:

1. Go to **Authentication** → **Email Templates** in Supabase
2. Customize the confirmation email template
3. Go to **Settings** → **Auth**
4. Configure your SMTP settings (or use Supabase's default for now)

### Disable Email Confirmation for Testing (Optional):

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle off "Confirm email"
3. Save

⚠️ **Note**: Only do this for testing. Re-enable it for production!

## Step 6: Test Your Setup

1. Open your app
2. Click "Sign Up" or "Create Account"
3. Enter your email and password
4. Check your email for the confirmation link (if enabled)
5. Sign in!

## 🎉 You're All Set!

Your app now has:
- ✅ User authentication
- ✅ Multi-household support
- ✅ Real-time sync
- ✅ Secure data storage
- ✅ Offline support

## 📊 Free Tier Limits

Supabase free tier includes:
- **500 MB database** storage
- **1 GB file** storage
- **2 GB bandwidth** per month
- **50,000 monthly active users**
- **500,000 Edge Function** invocations

This is more than enough to start and grow to thousands of users!

## 🔒 Security Features

Your database is protected by:
- **Row Level Security (RLS)**: Users can only see data from households they belong to
- **Authentication**: All requests require a valid user session
- **API Key Protection**: Your database password is never exposed
- **Encrypted Connections**: All data is encrypted in transit

## 🐛 Troubleshooting

### "Failed to fetch" or Connection Errors

- Check that your `.env` file has the correct credentials
- Ensure you've restarted your dev server after changing `.env`
- Verify your Supabase project is active (green status in dashboard)

### Email Confirmation Not Received

- Check your spam folder
- Verify email is correct in Supabase dashboard under **Authentication** → **Users**
- Try disabling email confirmation for testing (see Step 5)

### RLS Policy Errors

- Make sure you ran the entire `schema.sql` file
- Check the SQL editor for any errors
- Verify you're signed in (policies only work for authenticated users)

## 📚 Next Steps

- Invite teammates to your household
- Set up custom email templates
- Configure social auth providers (Google, GitHub, etc.)
- Monitor usage in Supabase dashboard

## 💡 Pro Tips

1. **Backup your database**: Supabase provides automatic backups on paid plans
2. **Monitor API usage**: Check your dashboard regularly
3. **Use indexes**: The schema already includes optimized indexes
4. **Enable 2FA**: Protect your Supabase account with two-factor auth

---

Need help? Check out:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- Open an issue in this repository
