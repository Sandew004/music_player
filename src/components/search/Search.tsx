import { useState, useCallback } from 'react'
import { Track, SearchResponse } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SearchService } from '@/services/searchService'

interface SearchComponentProps {
  onTracksFound?: (tracks: Track[]) => void
  onLoading?: (isLoading: boolean) => void
}

export const Search: React.FC<SearchComponentProps> = ({
  onTracksFound,
  onLoading,
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPageToken, setCurrentPageToken] = useState<string | undefined>()

  const handleSearch = useCallback(async (searchQuery: string, pageToken?: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query')
      return
    }

    setIsLoading(true)
    setError(null)
    onLoading?.(true)

    try {
      const response: SearchResponse = await SearchService.search({
        q: searchQuery,
        pageToken,
        maxResults: 10,
      })

      if (pageToken) {
        setResults((prev) => [...prev, ...response.tracks])
      } else {
        setResults(response.tracks)
      }

      setCurrentPageToken(response.nextPageToken)
      onTracksFound?.(response.tracks)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search'
      setError(errorMessage)
      setResults([])
    } finally {
      setIsLoading(false)
      onLoading?.(false)
    }
  }, [onTracksFound, onLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleLoadMore = () => {
    if (currentPageToken) {
      handleSearch(query, currentPageToken)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for music, artists, or playlists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            isLoading={isLoading}
            size="md"
          >
            Search
          </Button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Found {results.length} results
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {results.map((track) => (
              <div
                key={track.id}
                className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <img
                  src={track.thumbnailUrl}
                  alt={track.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                  {track.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {track.channelTitle}
                </p>
              </div>
            ))}
          </div>

          {currentPageToken && (
            <div className="text-center">
              <Button
                onClick={handleLoadMore}
                variant="secondary"
                isLoading={isLoading}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
