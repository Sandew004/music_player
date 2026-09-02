# Architecture Overview

This document explains how the Music Player application is structured and how all components work together.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                         │
│                     (React Application)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Search    │  │    Player    │  │    Queue     │         │
│  │  Component  │  │  Component   │  │  Component   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│          │                │                  │                 │
│          └────────────────┼──────────────────┘                 │
│                           │                                    │
│                    ┌──────▼──────┐                             │
│                    │ Zustand     │                             │
│                    │ Store       │                             │
│                    │ (Player     │                             │
│                    │  State)     │                             │
│                    └──────┬──────┘                             │
│                           │                                    │
│              ┌────────────┴────────────┐                       │
│              │                         │                       │
│         ┌────▼────┐           ┌──────▼─────┐                 │
│         │LocalStor│           │  YouTube   │                 │
│         │age      │           │  IFrame    │                 │
│         │(Cache)  │           │  Player    │                 │
│         └─────────┘           └────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │                                          │
         │ (Persistent Storage)                    │ (Playback)
         │                                          │
         ▼                                          ▼
   ┌──────────────┐                         ┌──────────────┐
   │  Browser     │                         │   YouTube    │
   │ LocalStorage │                         │   Player     │
   └──────────────┘                         └──────────────┘
         │                                          │
         └──────────────────────────────────────────┘
                        │ HTTPS
                        ▼
         ┌──────────────────────────────────┐
         │                                  │
         │        NETLIFY HOSTING           │
         │    (Static + Functions)          │
         │                                  │
         ├──────────────────────────────────┤
         │                                  │
         │  Frontend (React Build)          │
         │  - index.html                    │
         │  - CSS/JS bundles                │
         │  - Static assets                 │
         │                                  │
         ├──────────────────────────────────┤
         │                                  │
         │  Netlify Functions               │
         │  - /api/search function          │
         │  - API routing                   │
         │                                  │
         └──────────────────────────────────┘
                        │
                        │ (API Request)
                        │ GET /api/search?q=...
                        ▼
         ┌──────────────────────────────────┐
         │      YOUTUBE DATA API v3         │
         │                                  │
         │  - Search videos                 │
         │  - Get metadata                  │
         │  - Return track info             │
         │                                  │
         └──────────────────────────────────┘
```

## Data Flow

### 1. Search Flow

```
User Types "Alan Walker" in Search Box
        │
        ▼
    React Component Updates State
        │
        ▼
    Frontend Calls: GET /api/search?q=Alan%20Walker
        │
        ▼
    Netlify Function Receives Request
        │
        ├─ Validate query parameter
        ├─ Check rate limit (10 req/min per IP)
        ├─ Make request to YouTube API with API key
        │
        ▼
    YouTube Data API Returns:
        - Video ID
        - Title
        - Channel name
        - Thumbnail URL
        │
        ▼
    Netlify Function:
        - Transforms data to our Track format
        - Removes unused fields
        - Returns sanitized response
        │
        ▼
    Browser Receives Search Results
        │
        ▼
    Frontend Displays Track Cards
```

### 2. Playback Flow

```
User Clicks "Play" on a Track
        │
        ▼
    setCurrentTrack() in Zustand Store
        │
        ├─ Updates currentTrack state
        ├─ Saves to localStorage
        ├─ Triggers YouTube Player update
        │
        ▼
    YouTube Player Component:
        - Loads IFrame API (if not already loaded)
        - Creates player instance
        - Loads video by videoId
        │
        ▼
    YouTube Player:
        - Loads video content
        - Displays player controls
        - Handles playback
        │
        ▼
    User Controls (Play, Pause, Seek, Volume)
        │
        ├─ setIsPlaying() - controls playback
        ├─ setVolume() - controls volume
        ├─ onTimeUpdate() - tracks progress
        ├─ onDurationChange() - gets track length
        │
        ▼
    PlayerControls Component:
        - Shows progress bar
        - Updates playback buttons
        - Displays time remaining
```

### 3. Queue Management Flow

```
User Clicks "Queue" on a Track
        │
        ▼
    addToQueue() in Zustand Store
        │
        ├─ Adds track to queue array
        ├─ Updates state
        ├─ Saves to localStorage
        │
        ▼
    QueuePanel Component:
        - Displays all queued tracks
        - Shows current playing track (highlighted)
        │
        ▼
    User Interactions:
        - Click track: Play it (jump to position)
        - Click ×: Remove from queue
        - Click Clear: Empty queue
        │
        ▼
    playNext() / playPrevious():
        - Find current track index
        - Navigate queue
        - Handle repeat modes
        - Update currentTrack
```

## Component Architecture

### Page Structure

```
App.tsx (Main Application Shell)
├── Header
│   ├── Title & Subtitle
│   └── Queue Toggle Button
│
├── Main Content Area
│   ├── Player (if track selected)
│   │   ├── YouTube IFrame Player
│   │   └── Track Info (Title, Artist)
│   │
│   ├── PlayerControls
│   │   ├── Progress Bar
│   │   ├── Play/Pause Button
│   │   ├── Next/Previous Buttons
│   │   └── Volume Control
│   │
│   ├── Search Section
│   │   ├── Search Input
│   │   ├── Search Button
│   │   └── Search Results Grid
│   │       └── TrackCard components
│   │
│   └── Empty State (if no search)
│
└── Queue Panel (Sidebar)
    ├── Queue Header
    ├── Clear Queue Button
    └── Queue Items
        └── Click to play, × to remove
```

### Component Dependencies

```
App
├── Player
│   └── YouTube IFrame API
├── PlayerControls
│   └── Zustand Store
├── QueuePanel
│   └── Zustand Store
├── Search
│   └── SearchService
└── TrackCard
    └── Track Interface
```

## State Management

### Zustand Store (playerStore.ts)

```typescript
PlayerStore {
  // Current State
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number (0-1)
  currentTime: number
  duration: number
  repeat: 'none' | 'one' | 'all'
  shuffle: boolean

  // Methods
  setCurrentTrack(track)
  setIsPlaying(bool)
  setVolume(volume)
  addToQueue(track)
  removeFromQueue(index)
  setQueue(tracks)
  playNext()
  playPrevious()
  clearQueue()
}
```

### Local Storage Keys

```javascript
{
  'music_player_queue': [...tracks],           // Queued tracks
  'music_player_volume': 0.8,                  // Volume level
  'music_player_current_track': {...track},   // Currently playing
  'music_player_preferences': {                // User settings
    repeat: 'none',
    shuffle: false
  }
}
```

## API Design

### Netlify Function: `/api/search`

**Endpoint:** `GET /.netlify/functions/search`

**Alias:** `GET /api/search` (via netlify.toml redirect)

**Request:**
```
GET /api/search?q=song&pageToken=NEXT_PAGE_TOKEN&maxResults=10
```

**Response (200 OK):**
```json
{
  "tracks": [
    {
      "id": "video_id_123",
      "videoId": "video_id_123",
      "title": "Song Name",
      "channelTitle": "Artist Name",
      "channelId": "channel_123",
      "thumbnailUrl": "https://..."
    }
  ],
  "nextPageToken": "NEXT_PAGE_TOKEN",
  "totalResults": 1000
}
```

**Errors:**
```json
{
  "code": "ERROR_CODE",
  "message": "Error description"
}
```

## Security Model

### API Key Protection

```
                     SECURITY BOUNDARY
                            │
┌────────────────────────────┼────────────────────────────┐
│ BROWSER (PUBLIC)           │                            │
│ - React App                │                            │
│ - User Interface           │                            │
│ - Client-side State        │ Netlify Functions (PRIVATE)│
│ - NO API KEYS              │ - Backend Logic            │
│ - NO SECRETS               │ - YOUTUBE_API_KEY          │
│                            │ - Rate Limiting            │
│                            │ - Input Validation         │
└────────────────────────────┼────────────────────────────┘
                             │
                        HTTPS Request
                        /api/search
```

### Input Validation

```
Request Received
    │
    ├─ Check HTTP method (GET only)
    ├─ Check rate limit (10/min per IP)
    ├─ Validate query length (1-500 chars)
    ├─ Reject obviously malicious input
    │
    ▼
Valid ✓ → Make YouTube API call
Invalid ✗ → Return 400 Bad Request
Rate Limited ✗ → Return 429 Too Many Requests
```

### Response Transformation

```
YouTube API Response
    │
    ├─ Filter to video items only
    ├─ Extract only needed fields
    │   - id (videoId)
    │   - title
    │   - channelTitle
    │   - channelId
    │   - thumbnail URL
    ├─ Remove unused fields
    │   (description, tags, etc)
    │
    ▼
Minimal, Safe Response
```

## Performance Optimizations

### Caching Strategy

```
Request to /api/search
    │
    ├─ Response Header:
    │  Cache-Control: public, max-age=300
    │  (Cache for 5 minutes in browser)
    │
    └─ Result: Identical searches don't hit API
```

### Bundle Size

```
Production Build
├─ JavaScript: ~52 KB (gzipped)
│  - React + hooks: ~25 KB
│  - App code: ~15 KB
│  - Dependencies: ~12 KB
│
├─ CSS: ~3.3 KB (gzipped)
│  - Tailwind (purged): ~2 KB
│  - Custom: ~1.3 KB
│
└─ HTML: ~0.35 KB (gzipped)
```

### Code Splitting

Vite automatically code-splits:
- `index.*.js` - Main application
- `vendor.*.js` - npm dependencies (cached)

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                    │
│              (Source code version control)              │
└──────────────────────────────┬──────────────────────────┘
                               │ git push
                               ▼
┌──────────────────────────────────────────────────────────┐
│                  NETLIFY PLATFORM                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Build Process:                                         │
│  1. npm install                                         │
│  2. npm run build                                       │
│  3. Deploy dist/ to CDN                                 │
│  4. Bundle netlify/functions/ as Lambda functions       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Production Deployment:                                 │
│  - Static files: Netlify Edge Cache                     │
│  - Functions: AWS Lambda (auto-scaling)                 │
│  - Environment: Netlify Config                          │
│  - Domain: your-site.netlify.app (or custom)            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Error Handling

### Frontend Error Handling

```javascript
SearchService.search(query)
    .then(results => {
        // Success: Display results
    })
    .catch(error => {
        // Failed: Show error message to user
        // Log error details
        // Allow user to retry
    })
```

### Backend Error Handling

```javascript
try {
    // Validate input
    // Make YouTube API call
    // Transform response
} catch (error) {
    // Log detailed error (internal)
    // Return generic error message (external)
    // Never expose: stack traces, API keys, internals
}
```

## Scalability Considerations

### Current Bottlenecks
- YouTube API quota (10,000 units/day)
- Browser memory (queue size)
- Network bandwidth (video metadata)

### Future Scaling
- Add Redis cache layer for popular searches
- Implement distributed rate limiting
- Cache YouTube responses in database
- Add authentication for API access
- Use CDN for image thumbnails

### Migration Path
```
Current: YouTube API → Netlify Function → Browser
Future:  YouTube API → Redis Cache → Netlify Function → Browser
```

## Testing Strategy

### Unit Tests
```
- formatDuration() helper
- StorageService.get/set
- SearchService.search()
```

### Integration Tests
```
- Search → Display results
- Play → Player loads
- Queue → Items persist
```

### E2E Tests
```
- User flow: Search → Play → Queue
- Error handling: Invalid search, API failure
- Persistence: Refresh page, queue remains
```

---

**Architecture Version:** 1.0
**Last Updated:** 2024
**Status:** Production Ready
