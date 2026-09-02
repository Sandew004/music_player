import { Track, SearchResponse, SearchError } from '@/types'

const API_BASE = '/api'

interface SearchParams {
  q: string
  pageToken?: string
  maxResults?: number
}

export class SearchService {
  static async search(params: SearchParams): Promise<SearchResponse> {
    try {
      const searchParams = new URLSearchParams({
        q: params.q,
        ...(params.pageToken && { pageToken: params.pageToken }),
        ...(params.maxResults && { maxResults: params.maxResults.toString() }),
      })

      const response = await fetch(`${API_BASE}/search?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error: SearchError = await response.json()
        throw new Error(error.message || 'Search failed')
      }

      const data: SearchResponse = await response.json()
      return data
    } catch (error) {
      console.error('Search error:', error)
      throw error
    }
  }

  static async getTrendingTracks(): Promise<Track[]> {
    try {
      const response = await fetch(`${API_BASE}/trending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch trending tracks')
      }

      const data: { tracks: Track[] } = await response.json()
      return data.tracks
    } catch (error) {
      console.error('Trending tracks error:', error)
      return []
    }
  }

  static async searchWithDelay(
    query: string,
    delayMs: number = 300
  ): Promise<SearchResponse | null> {
    return new Promise((resolve) => {
      const timer = setTimeout(async () => {
        try {
          const results = await this.search({ q: query, maxResults: 10 })
          resolve(results)
        } catch {
          resolve(null)
        }
      }, delayMs)

      return () => clearTimeout(timer)
    })
  }
}
