import { Track } from '@/types'

interface TrackCardProps {
  track: Track
  isActive?: boolean
  onPlay?: (track: Track) => void
  onAddToQueue?: (track: Track) => void
  onClick?: (track: Track) => void
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isActive = false,
  onPlay,
  onAddToQueue,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick?.(track)}
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        isActive
          ? 'bg-sky-50 border-sky-500 shadow-md'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {/* Thumbnail */}
      <div className="mb-3 overflow-hidden rounded-md bg-gray-200 aspect-video">
        <img
          src={track.thumbnailUrl}
          alt={track.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
        {track.title}
      </h3>

      {/* Channel */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-1">
        {track.channelTitle}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlay?.(track)
          }}
          className="flex-1 px-3 py-2 bg-sky-500 text-white text-sm rounded hover:bg-sky-600 transition-colors"
        >
          Play
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddToQueue?.(track)
          }}
          className="flex-1 px-3 py-2 bg-gray-200 text-gray-900 text-sm rounded hover:bg-gray-300 transition-colors"
        >
          Queue
        </button>
      </div>
    </div>
  )
}
