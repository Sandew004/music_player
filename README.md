# 🎵 Music Player

A modern, full-featured music player application built with React, TypeScript, and Netlify Functions. Stream and queue your favorite YouTube music with a clean, responsive interface.

## 🚀 Features

- **YouTube Music Search**: Search and discover millions of tracks from YouTube
- **Playback Queue**: Build and manage your music queue
- **Advanced Controls**: Shuffle, repeat (none/one/all), volume control, and seek
- **Persistent Storage**: Your queue and preferences are saved locally
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Serverless Architecture**: Built on Netlify Functions for zero-infrastructure hosting
- **Type-Safe**: Full TypeScript support throughout the application
- **Security**: API keys are never exposed to the browser

## 📋 Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Simple state management

### Backend
- **Netlify Functions**: Serverless API endpoints
- **YouTube Data API v3**: Access to YouTube's music content

### Development
- **ESLint**: Code quality and consistency
- **Vitest**: Fast unit testing
- **Netlify CLI**: Local development with serverless functions

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- A YouTube API key ([Get one here](https://developers.google.com/youtube/registering_an_application))
- Netlify CLI (optional, for local testing)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music_player
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your YouTube API key to `.env.local`:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. **Install Netlify CLI (optional)**
   ```bash
   npm install -g netlify-cli
   ```

## 🏃 Development

### Quick Start
```bash
npm run dev
```
This starts both the Vite dev server and Netlify Functions locally.

Access the application at `http://localhost:5173`

### Separate Terminals (if needed)

**Terminal 1 - Vite dev server:**
```bash
npm run vite
```

**Terminal 2 - Netlify Functions:**
```bash
netlify functions:serve
```

## 🏗️ Project Structure

```
music_player/
├── src/
│   ├── components/
│   │   ├── player/
│   │   │   ├── Player.tsx          # YouTube player wrapper
│   │   │   ├── PlayerControls.tsx  # Playback controls
│   │   │   └── QueuePanel.tsx      # Queue display
│   │   ├── search/
│   │   │   └── Search.tsx          # Search interface
│   │   └── ui/
│   │       ├── Button.tsx          # Reusable button component
│   │       ├── Input.tsx           # Reusable input component
│   │       └── TrackCard.tsx       # Track display card
│   ├── hooks/                      # Custom React hooks
│   ├── services/
│   │   └── searchService.ts        # API client for search
│   ├── stores/
│   │   └── playerStore.ts          # Zustand player state
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   ├── formatting.ts           # Format utilities
│   │   └── storage.ts              # LocalStorage helpers
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global styles
├── netlify/
│   └── functions/
│       └── search.ts               # Netlify search function
├── public/                         # Static assets
├── index.html                      # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── netlify.toml                    # Netlify configuration
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔧 Configuration

### netlify.toml
The Netlify configuration handles:
- Build command: `npm run build`
- Publish directory: `dist/`
- Functions directory: `netlify/functions/`
- SPA routing for client-side navigation
- Security headers (CSP, X-Frame-Options, etc.)

### Environment Variables

**Private (backend only - in Netlify environment config):**
- `YOUTUBE_API_KEY`: Your YouTube API key (never exposed to browser)

**Public (frontend - in Vite):**
None required. The app communicates with the backend via `/api/search`

## 📡 API Endpoints

### GET `/api/search`
Search for music tracks.

**Query Parameters:**
- `q` (required): Search query (1-500 characters)
- `pageToken` (optional): Pagination token for next page
- `maxResults` (optional): Max results per page (default: 10)

**Response:**
```json
{
  "tracks": [
    {
      "id": "video_id",
      "title": "Track Title",
      "channelTitle": "Artist Name",
      "channelId": "channel_id",
      "thumbnailUrl": "https://...",
      "videoId": "video_id"
    }
  ],
  "nextPageToken": "NEXT_PAGE_TOKEN",
  "totalResults": 1000
}
```

**Rate Limiting:** 10 requests per minute per IP

## 🎯 Usage

### Searching for Music
1. Enter a search query in the search bar
2. Results appear instantly below
3. Use "Load More" to paginate through results

### Playing Music
1. Click "Play" on any track card to start playback
2. Use the player controls to:
   - Play/Pause
   - Seek through the track
   - Adjust volume
   - Skip to next/previous
   - Toggle repeat mode (none/one/all)
   - Toggle shuffle

### Managing Your Queue
1. Click "Show Queue" to view your playlist
2. Click "Queue" on any track to add it
3. Click on queue items to jump to a track
4. Click the ✕ button to remove tracks
5. Click "Clear" to empty the queue

### Preferences
Your settings are automatically saved:
- Volume level
- Current queue
- Current playing track
- Repeat and shuffle modes

## 🚀 Building for Production

### Build the application
```bash
npm run build
```

This creates an optimized `dist/` folder ready for Netlify deployment.

### Pre-deployment checks
```bash
npm run lint      # Check code quality
npm run typecheck # Verify TypeScript
npm run test      # Run tests
npm run build     # Build for production
```

### Deploy to Netlify

**Option 1: GitHub Integration (Recommended)**
1. Push your code to GitHub
2. Connect your repo to Netlify
3. Netlify automatically builds and deploys on every push

**Option 2: Netlify CLI**
```bash
netlify deploy --prod
```

## 🔒 Security

### API Key Protection
- The YouTube API key is stored in Netlify environment variables
- Only Netlify Functions can access it
- The browser never sees the key
- All API requests go through the backend

### Rate Limiting
- 10 requests per minute per IP
- Prevents abuse and protects API quota

### Security Headers
- Content-Security-Policy: Restricts resource loading
- X-Frame-Options: Prevents clickjacking
- X-Content-Type-Options: Prevents MIME sniffing

### Input Validation
- Search queries are validated (length, format)
- Invalid inputs are rejected with clear errors
- Pagination tokens are sanitized

## 📊 Monitoring & Debugging

### Local Development
The Netlify dev server logs function calls:
```bash
npm run dev
```

### Production Logs
Check logs in Netlify Dashboard:
1. Go to your site settings
2. Navigate to Functions
3. View real-time logs

### Common Issues

**"YouTube API key not found"**
- Ensure `YOUTUBE_API_KEY` is set in Netlify environment variables
- Restart your local dev server

**"CORS error"**
- This shouldn't happen as the backend proxies all requests
- Check that requests go to `/api/search` not directly to YouTube

**"Player not loading"**
- Ensure YouTube IFrame API is loaded (automatic)
- Check browser console for errors
- Verify video ID is valid

## 📈 Performance

### Optimizations
- Vite for fast builds and hot module replacement
- Code splitting for smaller chunks
- Image optimization with native lazy loading
- Zustand for lightweight state management
- Debounced search requests

### Loading Times
- Initial load: ~2-3 seconds
- Search results: ~500ms
- Player initialization: ~1 second

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test -- --coverage
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce bugs
4. Attach error logs/screenshots

## 🔗 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand GitHub](https://github.com/pmndrs/zustand)

---

Built with ❤️ for music lovers everywhere
