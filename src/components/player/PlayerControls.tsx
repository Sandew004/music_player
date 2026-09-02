import { usePlayerStore } from '@/stores/playerStore'
import { formatDuration } from '@/utils/formatting'

interface PlayerControlsProps {
  currentTime?: number
  duration?: number
  onSeek?: (time: number) => void
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentTime = 0,
  duration = 0,
  onSeek,
}) => {
  const {
    isPlaying,
    volume,
    repeat,
    shuffle,
    setIsPlaying,
    setVolume,
    setRepeat,
    setShuffle,
    playNext,
    playPrevious,
  } = usePlayerStore()

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    onSeek?.(newTime)
  }

  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all']
    const currentIndex = modes.indexOf(repeat)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setRepeat(nextMode)
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Progress bar */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-gray-600 w-8">
          {formatDuration(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <span className="text-xs text-gray-600 w-8">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left side - Mode buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              shuffle ? 'text-sky-500' : 'text-gray-600'
            }`}
            title="Shuffle"
            aria-label="Toggle shuffle"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6h-2v2h2V6zm0 4h-2v2h2v-2zM3 8h2V6H3v2zm0 8h2v-2H3v2zm12 0h2v-2h-2v2zm4-4v-2h2v2h-2zm0 8v-2h2v2h-2z" />
              <path d="M15 18v-4h-2v4h-2v-4H9v4H7v-4H5v4H3v-2H1v2h2v2H1v2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2V8h-2v8h-2z" />
            </svg>
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              repeat !== 'none' ? 'text-sky-500' : 'text-gray-600'
            }`}
            title={`Repeat: ${repeat}`}
            aria-label="Toggle repeat"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
            {repeat === 'one' && (
              <span className="text-xs font-bold ml-1">1</span>
            )}
          </button>
        </div>

        {/* Center - Playback buttons */}
        <div className="flex gap-4">
          <button
            onClick={playPrevious}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Previous"
            aria-label="Previous track"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={playNext}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Next"
            aria-label="Next track"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2v12zm-11-7l8.5-6v12l-8.5-6z" />
            </svg>
          </button>
        </div>

        {/* Right side - Volume */}
        <div className="flex items-center gap-2 w-32">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
            title="Volume"
            aria-label="Volume control"
          />
        </div>
      </div>
    </div>
  )
}
