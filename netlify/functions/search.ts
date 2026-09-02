import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

interface YouTubeSearchItem {
  kind: string
  etag: string
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default?: {
        url: string
        width: number
        height: number
      }
      medium?: {
        url: string
        width: number
        height: number
      }
      high?: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
    liveBroadcastContent: string
    publishTime: string
  }
}

interface YouTubeApiResponse {
  kind: string
  etag: string
  nextPageToken?: string
  regionCode: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeSearchItem[]
}

interface Track {
  id: string
  title: string
  channelTitle: string
  channelId: string
  thumbnailUrl: string
  videoId?: string
}

interface SearchResponse {
  tracks: Track[]
  nextPageToken?: string
  totalResults?: number
}

interface ErrorResponse {
  code: string
  message: string
}

// Rate limiting state (simple in-memory tracking)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

const getRateLimitKey = (ip: string | null): string => {
  return ip || 'unknown'
}

const checkRateLimit = (ip: string | null, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const current = requestCounts.get(key)

  if (!current || now > current.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

const validateQuery = (query: string): boolean => {
  if (!query || typeof query !== 'string') return false
  if (query.trim().length === 0) return false
  if (query.length > 500) return false
  return true
}

const transformYouTubeResponse = (items: YouTubeSearchItem[]): Track[] => {
  return items
    .filter((item) => item.id.kind === 'youtube#video')
    .map((item) => ({
      id: item.id.videoId,
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
    }))
}

const searchYouTube = async (query: string, pageToken?: string): Promise<YouTubeApiResponse> => {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    throw new Error('YouTube API key is not configured')
  }

  const params = new URLSearchParams({
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: '10',
    regionCode: 'US',
    key: apiKey,
  })

  if (pageToken) {
    params.append('pageToken', pageToken)
  }

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'music-player/1.0',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('YouTube API error:', errorData)
      throw new Error(`YouTube API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('YouTube API request failed:', error)
    throw error
  }
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Only accept GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET requests are allowed',
      } as ErrorResponse),
    }
  }

  try {
    // Get client IP for rate limiting
    const clientIp = event.headers['x-forwarded-for']?.split(',')?.[0] || event.headers['client-ip']

    // Check rate limit
    if (!checkRateLimit(clientIp, 10, 60000)) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
        } as ErrorResponse),
      }
    }

    // Extract query parameter
    const query = event.queryStringParameters?.q

    // Validate query
    if (!validateQuery(query || '')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          code: 'INVALID_QUERY',
          message: 'Query parameter is required and must be between 1 and 500 characters',
        } as ErrorResponse),
      }
    }

    const pageToken = event.queryStringParameters?.pageToken

    // Search YouTube
    const youtubeResponse = await searchYouTube(query!, pageToken)

    // Transform response
    const tracks = transformYouTubeResponse(youtubeResponse.items)

    const response: SearchResponse = {
      tracks,
      nextPageToken: youtubeResponse.nextPageToken,
      totalResults: youtubeResponse.pageInfo.totalResults,
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.error('Search function error:', error)

    const message = error instanceof Error ? error.message : 'An error occurred while searching'

    return {
      statusCode: 500,
      body: JSON.stringify({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while processing your request',
      } as ErrorResponse),
    }
  }
}

export { handler }
