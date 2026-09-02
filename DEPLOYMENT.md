# Deployment & Setup Guide

This guide covers local development setup, testing, and deployment to Netlify.

## Local Development Setup

### 1. Initial Setup

```bash
# Clone and navigate to project
git clone <repository-url>
cd music_player

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2. Add YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create an API key (Web Server credentials)
5. Add the key to `.env.local`:

```
YOUTUBE_API_KEY=your_actual_key_here
```

**Important:** Never commit `.env.local`

### 3. Start Development Server

```bash
npm run dev
```

This command:
- Starts Vite dev server on `http://localhost:5173`
- Starts Netlify Functions server on `http://localhost:9999`
- Enables hot module replacement for rapid development
- Forwards `/api/*` requests to Netlify Functions

## Development Workflow

### Running Commands

```bash
# Development with hot reload
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

### File Structure for Development

```
src/
├── components/          # React components
│   ├── player/         # Player & controls
│   ├── search/         # Search interface
│   └── ui/             # Reusable UI components
├── services/           # API client services
├── stores/             # Zustand state management
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
├── App.tsx             # Main app component
├── main.tsx            # React entry point
└── index.css           # Global styles

netlify/
└── functions/          # Serverless functions
    └── search.ts       # YouTube search API
```

## Testing Locally

### Function Testing

```bash
# Test search endpoint
curl -G http://localhost:9999/.netlify/functions/search \
  --data-urlencode "q=Alan Walker"
```

### Browser Testing

1. Open DevTools: F12
2. Go to Network tab
3. Perform a search
4. Check that requests go to `/api/search`
5. Verify response structure in DevTools

### Manual Testing Checklist

- [ ] Search returns results
- [ ] Player loads when track is selected
- [ ] Play/pause controls work
- [ ] Volume control adjusts
- [ ] Queue items can be added/removed
- [ ] Tracks persist after refresh
- [ ] No console errors
- [ ] Responsive on mobile (DevTools)

## Building for Production

### Pre-deployment Verification

```bash
# Check code quality
npm run lint

# Verify types
npm run typecheck

# Run tests
npm run test

# Build for production
npm run build

# Test production build locally
npm run preview
```

### Build Output

The `npm run build` command:
1. Compiles TypeScript: `tsc`
2. Builds with Vite: `vite build`
3. Creates optimized bundle in `dist/`
4. Produces minimal CSS and JS files
5. Generates source maps for debugging

Expected output sizes:
- `index.html`: ~0.6 KB
- `index.*.css`: ~3.5 KB (gzipped)
- `index.*.js`: ~50 KB (gzipped)

### Security Check Before Deploy

Check that sensitive data is NOT in the build:

```bash
# Search for API keys in the build
grep -r "YOUTUBE_API_KEY" dist/ && echo "ERROR: API key found!" || echo "OK: No API key exposed"
grep -r "AIza" dist/ && echo "ERROR: Credentials found!" || echo "OK: No credentials exposed"
```

## Netlify Deployment

### Option 1: GitHub Integration (Recommended)

**Setup:**
1. Push code to GitHub
2. Connect repo to Netlify:
   - Go to app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select GitHub
   - Choose repository
   - Build settings auto-detect

**Configuration:**
- Build command: `npm run build` ✓ (auto-detected)
- Publish directory: `dist` ✓ (auto-detected)
- Functions directory: `netlify/functions` ✓ (auto-detected)

**Deployment:**
- Every push to `main` auto-deploys
- Preview deploys for pull requests
- Rollback to previous deploys anytime

**Setting Environment Variables:**
1. Site settings → Environment
2. Add environment variable
3. Name: `YOUTUBE_API_KEY`
4. Value: Your YouTube API key
5. Redeploy site

### Option 2: Netlify CLI

**Install:**
```bash
npm install -g netlify-cli
```

**Login:**
```bash
netlify login
```

**Deploy:**
```bash
# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

**Set Environment Variables:**
```bash
netlify env:set YOUTUBE_API_KEY "your_key_here"
```

### Option 3: Direct Upload

```bash
# Build locally
npm run build

# Upload dist folder to Netlify via UI
# Settings → Build & Deploy → Deploy → Upload dist folder
```

## Post-Deployment Verification

After deploying to Netlify, verify:

### 1. Site Loads
```bash
curl -I https://your-site.netlify.app
# Should return 200
```

### 2. Search Works
```bash
curl -G https://your-site.netlify.app/api/search \
  --data-urlencode "q=test"
```

### 3. No Errors in Console
1. Open site in browser
2. Open DevTools (F12)
3. Check Console tab - should be empty

### 4. Check Network Requests
1. Open DevTools Network tab
2. Search for a track
3. Verify `/api/search` request succeeds
4. Verify response contains tracks

### 5. Check Security Headers
```bash
curl -I https://your-site.netlify.app | grep -E "X-|Content-Security|Referrer"
```

Should show security headers like:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 6. Check API Key is NOT Exposed
```bash
# Should return nothing (API key is secure)
curl https://your-site.netlify.app/assets/*.js | grep -i "api"
```

## Troubleshooting

### "API key not configured"

**Symptoms:** Search returns 500 error with "API key" message

**Fix:**
1. Go to Netlify site settings
2. Environment → Edit variables
3. Ensure `YOUTUBE_API_KEY` is set
4. Redeploy site: Deploys → Trigger deploy

### CORS Errors

**Symptoms:** Browser console shows CORS errors

**Why:** This shouldn't happen if `/api` routes to functions

**Fix:**
1. Check netlify.toml redirects
2. Verify function is in `netlify/functions/`
3. Clear Netlify cache and redeploy

### Search Returns Empty Results

**Causes:**
- API quota exceeded (YouTube limits requests)
- Invalid API key
- Query too long (>500 chars)

**Fix:**
- Wait for quota reset (daily limit)
- Verify API key in environment
- Shorten query

### Player Not Loading

**Symptoms:** Black rectangle, no video

**Causes:**
- YouTube IFrame API not loaded
- Adblock blocking YouTube
- Video region restricted

**Fix:**
- Hard refresh browser (Ctrl+Shift+R)
- Disable ad blockers
- Try different video

### Build Fails Locally

**Symptoms:** `npm run build` returns errors

**Common issues:**
```bash
# TypeScript errors
npm run typecheck
# Fix any type errors reported

# Missing dependencies
npm install

# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Monitoring & Logs

### View Netlify Function Logs

**In Browser:**
1. Site settings → Functions
2. View real-time logs
3. Click on function calls for details

**Via CLI:**
```bash
netlify logs
```

### Debug Locally

Enable debug logging:
```bash
# Add to netlify.toml
[dev]
debug = true

# Then run
netlify dev --debug
```

### Check Analytics

**Netlify Dashboard:**
1. Analytics tab
2. View build times
3. Monitor bandwidth
4. Check error rates

## Performance Optimization

### Bundle Size

Monitor bundle size:
```bash
npm run build
# Check console output for sizes
```

### Caching

API responses are cached for 5 minutes:
```
Cache-Control: public, max-age=300
```

To clear:
- Manual: Site settings → Purge cache
- Auto: Every deployment purges

## Scaling & Limits

### Netlify Free Plan
- 300 mins builds/month (plenty for most cases)
- 500 requests/month Netlify Functions
- Unlimited bandwidth
- Auto-scaling

### YouTube API Quota
- 10,000 units/day (free tier)
- Search = ~100 units per request
- ~100 searches/day available

**If quota exceeded:**
- Wait for daily reset (midnight PT)
- Upgrade YouTube API quota
- Implement Redis caching layer

## Disaster Recovery

### Rollback Previous Deploy

```bash
# Via CLI
netlify deploy --prod --alias "previous-version"

# Via UI
Site settings → Deploy settings → Deploys → Click deploy → Publish
```

### Backup and Restore

GitHub is your backup:
```bash
# Clone any commit
git clone <repo>
git checkout <commit-hash>
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
      - uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod
```

## Support & Resources

- [Netlify Docs](https://docs.netlify.com)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

---

**Last Updated:** 2024
**Status:** Production Ready
