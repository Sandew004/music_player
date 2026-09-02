import { usePlayerStore } from '@/stores/playerStore'
import { Track } from '@/types'
import { Button } from '@/components/ui/Button'

interface QueuePanelProps {
  isOpen?: boolean
}

export const QueuePanel: React.FC<QueuePanelProps> = ({
  isOpen = true,
}) => {
  const {
    queue,
    currentTrack,
    removeFromQueue,
    clearQueue,
    setCurrentTrack,
  } = usePlayerStore()

  const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id)

  const handleTrackClick = (track: Track) => {
    setCurrentTrack(track)
  }

  const handleRemove = (index: number) => {
    removeFromQueue(index)
  }

  return (
    <div
      className={`bg-white border-l border-gray-200 overflow-y-auto transition-all ${
        isOpen ? 'w-80' : 'w-0'
      }`}
      style={{
        display: isOpen ? 'block' : 'none',
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Queue</h2>
          {queue.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={clearQueue}
            >
              Clear
            </Button>
          )}
        </div>

        {queue.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Queue is empty. Add tracks to get started!
          </p>
        ) : (
          <div className="space-y-2">
            {queue.map((track, index) => (
              <div
                key={`${track.id}-${index}`}
                onClick={() => handleTrackClick(track)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentIndex
                    ? 'bg-sky-50 border border-sky-500'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {track.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {track.channelTitle}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(index)
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove from queue"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
