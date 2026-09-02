import { useState, useEffect } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { StorageService } from '@/utils/storage'

import { Player } from '@/components/player/Player'
import { PlayerControls } from '@/components/player/PlayerControls'
import { QueuePanel } from '@/components/player/QueuePanel'
import { Search } from '@/components/search/Search'
import { TrackCard } from '@/components/ui/TrackCard'
import { Button } from '@/components/ui/Button'
import { Track } from '@/types'

function App() {
  const {
    currentTrack,
    queue,
    isPlaying,
    volume,
    currentTime,
    duration,
    setCurrentTrack,
    setIsPlaying,
    setVolume,
    setQueue,
    addToQueue,
    playNext,
  } = usePlayerStore()

  const [showQueue, setShowQueue] = useState(false)
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Load state from storage on mount
  useEffect(() => {
    const savedQueue = StorageService.getQueue()
    const savedVolume = StorageService.getVolume()
    const savedTrack = StorageService.getCurrentTrack()

    if (savedQueue.length > 0) {
      setQueue(savedQueue)
    }

    setVolume(savedVolume)

    if (savedTrack) {
      setCurrentTrack(savedTrack)
    }
  }, [setQueue, setVolume, setCurrentTrack])

  // Save state to storage
  useEffect(() => {
    StorageService.setQueue(queue)
    StorageService.setVolume(volume)
    StorageService.setCurrentTrack(currentTrack)
  }, [queue, volume, currentTrack])

  // Handle end of track
  const handleTrackEnded = () => {
    playNext()
  }

  const handleSeek = (_time: number) => {
    // Would require player ref to actually seek
    // For now, this is a placeholder
  }

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const handleAddToQueue = (track: Track) => {
    addToQueue(track)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎵 Music Player</h1>
              <p className="text-gray-600 text-sm">Stream and queue your favorite tracks</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowQueue(!showQueue)}
            >
              {showQueue ? 'Hide' : 'Show'} Queue ({queue.length})
            </Button>
          </div>
        </header>

        {/* Player */}
        {currentTrack && (
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <Player
                  track={currentTrack}
                  isPlaying={isPlaying}
                  volume={volume}
                  onEnded={handleTrackEnded}
                  onTimeUpdate={() => {}}
                  onDurationChange={() => {}}
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">{currentTrack.title}</h2>
                <p className="text-gray-600">{currentTrack.channelTitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* Player Controls */}
        <PlayerControls
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Music</h2>
              <Search
                onTracksFound={setSearchResults}
                onLoading={setIsSearching}
              />
            </section>

            {searchResults.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isActive={currentTrack?.id === track.id}
                      onPlay={handlePlayTrack}
                      onAddToQueue={handleAddToQueue}
                    />
                  ))}
                </div>
              </section>
            )}

            {!isSearching && searchResults.length === 0 && (
              <section className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No tracks found yet
                </h3>
                <p className="text-gray-600">
                  Search for your favorite music to get started
                </p>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Queue Panel */}
      <QueuePanel isOpen={showQueue} />
    </div>
  )
}

export default App
