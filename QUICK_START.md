# 🚀 Quick Start Guide

Get the Music Player up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A YouTube API key (free, takes 2 minutes to get)

## Step 1: Get a YouTube API Key (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" and give it a name (e.g., "Music Player")
3. Search for "YouTube Data API v3" and click "Enable"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the generated API key

## Step 2: Clone and Install (1 minute)

```bash
cd /workspaces/music_player
npm install
```

## Step 3: Configure API Key (30 seconds)

```bash
# Copy the example env file
cp .env.example .env.local

# Open .env.local and add your YouTube API key
# YOUTUBE_API_KEY=your_actual_key_here
```

## Step 4: Start Development (1 minute)

```bash
npm run dev
```

You'll see:
```
VITE v5.4.21  ready in 123 ms

➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Step 5: Try It Out (30 seconds)

1. Type "Alan Walker Faded" in the search box
2. Click "Search"
3. Click "Play" on any track
4. Use the controls to play, pause, skip, adjust volume
5. Click "Queue" to add tracks to your playlist

## ✅ You're Done!

The application is now running with:
- ✅ Live search from YouTube
- ✅ Music playback
- ✅ Queue management
- ✅ Auto-saving preferences

## Common Commands

```bash
# Start development server
npm run dev

# Check for TypeScript errors
npm run typecheck

# Lint code quality
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Netlify

### Option A: GitHub + Netlify (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial music player"
   git push origin main
   ```

2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Click "Deploy"

6. **Important:** Add your YouTube API key:
   - Site settings → Environment variables
   - Add `YOUTUBE_API_KEY` with your API key value
   - Trigger redeploy

### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Deploy
netlify deploy --prod

# Set environment variable
netlify env:set YOUTUBE_API_KEY "your_key_here"

# Redeploy
netlify deploy --prod
```

## File Structure Overview

```
src/
├── components/        # React components (search, player, UI)
├── services/         # API client
├── stores/           # State management
├── types/            # TypeScript interfaces
└── utils/            # Helper functions

netlify/functions/
└── search.ts         # Backend API (searches YouTube)

Configuration
├── package.json      # Dependencies
├── vite.config.ts    # Build settings
├── netlify.toml      # Deployment config
└── tailwind.config.js # Styling
```

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm run dev
```

### "API key not configured" error when searching
- Check that `.env.local` has `YOUTUBE_API_KEY=...`
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### Player doesn't load
- Hard refresh browser: `Ctrl+Shift+R` (or Cmd+Shift+R on Mac)
- Check browser console for errors (F12)

### Search returns no results
- Your YouTube API quota might be exceeded (daily limit)
- Wait for quota reset at midnight PT

### Can't connect to development server
- Make sure port 5173 isn't in use
- Check firewall settings
- Try: `npm run dev -- --port 3000`

## Next Steps

1. **Customize the UI**: Edit `src/components/` and `tailwind.config.js`
2. **Add features**: Create new components in `src/components/`
3. **Change colors**: Update `tailwind.config.js` theme colors
4. **Deploy**: Push to GitHub and Netlify auto-deploys

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment details
- Read inline code comments for implementation details

## Key Features

🎵 **Search**: Find any song on YouTube
▶️ **Playback**: Play videos from YouTube
📋 **Queue**: Add tracks to your playlist
🎚️ **Controls**: Volume, seek, shuffle, repeat
💾 **Persistent**: Queue saves automatically
📱 **Responsive**: Works on desktop, tablet, mobile
🔒 **Secure**: API key never exposed to browser

---

**Ready to start?** Run `npm run dev` and start playing music! 🎧
