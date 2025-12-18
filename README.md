# ✨ Cleaning Rota App

A modern, beautiful cleaning task rotation app with glassmorphism UI design. Keep your household chores organized with automatic task rotation and stunning visual themes!

## Features

- 🏠 **Housemate Management** - Add and manage household members
- 👥 **Multi-User SaaS** - Collaborate with your household in real-time with cloud sync
- 📋 **Customizable Tasks** - Create custom cleaning tasks with default templates included
- 🤖 **AI-Powered Task Descriptions** - Generate detailed cleaning instructions and tips using Hugging Face AI
- 🔄 **Automatic Rotation** - Tasks automatically rotate between housemates each week
- ✅ **Task Completion** - Mark tasks as complete and track progress
- 🎨 **Beautiful Themes** - 5 gorgeous glassmorphism themes to choose from:
  - 💜 Purple Dream
  - 🌊 Ocean Blue
  - 🌸 Pink Sunset
  - 🌿 Fresh Green
  - 🌅 Orange Sunset
- 💾 **Local Storage** - All data persists in your browser (no signup required!)
- 📱 **Responsive Design** - Works beautifully on desktop and mobile

## Tech Stack

- **React 18** with TypeScript
- **Vite** for lightning-fast development
- **Hugging Face AI** for intelligent task descriptions
- **Glassmorphism CSS** for modern UI effects
- **Supabase** for cloud database and real-time sync
- **LocalStorage** fallback for offline-first usage
- **Capacitor** for native iOS and Android apps

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Set up Hugging Face API key (for AI features)
cp .env.example .env
# Edit .env and add your Hugging Face API key
# Get a free API key at: https://huggingface.co/settings/tokens

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 🤖 AI Features Setup

This app uses Hugging Face's AI models to generate intelligent task descriptions and cleaning tips!

#### For Vercel Deployment (Recommended - Secure):

1. **Get a free API key**:
   - Visit [Hugging Face Settings](https://huggingface.co/settings/tokens)
   - Create a new token (read access is sufficient)
   - Copy your token

2. **Add to Vercel Dashboard**:
   - Go to your Vercel project settings
   - Navigate to **Environment Variables**
   - Add: `HF_API_KEY` = `your_huggingface_token_here`
   - Redeploy your app

**Security**: Your API key is kept secure on Vercel's servers and never exposed to the client.

#### For Local Development:

The app works without an API key (AI features will use fallback descriptions). If you want to test AI locally:
- Copy `.env.example` to `.env`
- Add your API key: `HF_API_KEY=your_key_here`
- Restart your dev server

#### How to Use AI Features:

1. Click "Add Task" in the app
2. Enter a task name (e.g., "Clean Bathroom")
3. Click the "✨ AI Generate" button
4. Get detailed descriptions and helpful cleaning tips instantly!

**Note**: The app works without AI - it will provide sensible fallback descriptions if the API is unavailable.

### How to Use

1. **Add Housemates** - Go to Settings and add the people in your household
2. **Configure Tasks** - Add or customize cleaning tasks (defaults included)
3. **Choose a Theme** - Pick your favorite color theme
4. **Start Cleaning!** - Tasks are automatically assigned and rotate weekly
5. **Mark Complete** - Check off tasks as you complete them

## Default Tasks Included

- 🍳 Kitchen - Clean counters, dishes, sink, and floors
- 🚿 Bathroom - Clean toilet, shower, sink, and mirrors
- 🧹 Vacuum - Vacuum all floors and carpets
- 🗑️ Take Out Trash - Empty all bins
- 🛋️ Living Room - Tidy up and dust living areas

## How Task Rotation Works

- Tasks are assigned at the start of each week (Monday by default)
- Each week, tasks rotate to the next person
- Everyone gets a fair distribution of different tasks
- Completed tasks are tracked in history

## Data Storage

All your data is stored locally in your browser using `localStorage`. This means:
- ✅ No account needed
- ✅ Works offline
- ✅ Your data stays private
- ⚠️ Don't clear your browser data if you want to keep your history

## 🚀 Deploying to Vercel

This app is optimized for Vercel deployment with secure serverless functions!

### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy
vercel
```

Or use the [Vercel Dashboard](https://vercel.com/new) to import your GitHub repository.

### Step 2: Add Environment Variables (Required for AI)

To enable AI features securely:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `HF_API_KEY`
   - **Value**: Your Hugging Face API token
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your application

### How It Works

- Your Hugging Face API key is stored securely in Vercel's environment
- The frontend calls `/api/generate-description` (a serverless function)
- The serverless function uses your API key server-side
- **Your API key is NEVER exposed to the client** ✅

### Architecture

```
User Browser → /api/generate-description (Vercel Function) → Hugging Face API
                        ↑
                  API key stored securely on server
```

## 📱 Mobile Apps (iOS & Android)

This app is configured with Capacitor to deploy to app stores!

### Quick Commands
```bash
npm run cap:ios       # Open in Xcode (Mac only)
npm run cap:android   # Open in Android Studio
```

### Full Deployment Guide
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions on:
- Building for iOS App Store
- Building for Google Play Store
- Creating app icons and screenshots
- Signing and publishing your app

## License

MIT

---

Made with ❤️ for keeping homes sparkling clean!
