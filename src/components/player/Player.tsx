import { useEffect, useRef } from 'react'
import { Track } from '@/types'

interface PlayerProps {
  track: Track | null
  isPlaying: boolean
  volume: number
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number) => void
  onDurationChange?: (duration: number) => void
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export const Player: React.FC<PlayerProps> = ({
  track,
  isPlaying,
  volume,
  onEnded,
  onTimeUpdate,
  onDurationChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const playerInitRef = useRef(false)

  // Load YouTube API
  useEffect(() => {
    if (window.YT) {
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
  }, [])

  // Initialize player
  useEffect(() => {
    const initializePlayer = () => {
      if (!window.YT || !containerRef.current || playerInitRef.current) {
        return
      }

      playerInitRef.current = true

      playerRef.current = new window.YT.Player(containerRef.current, {
        width: '100%',
        height: '100%',
        videoId: track?.videoId || '',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      })
    }

    if (window.YT?.Player) {
      initializePlayer()
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy()
        playerInitRef.current = false
      }
    }
  }, [])

  // Handle track changes
  useEffect(() => {
    if (!playerRef.current || !track?.videoId) return

    try {
      playerRef.current.cueVideoById(track.videoId)
      if (isPlaying) {
        playerRef.current.playVideo()
      }
    } catch (error) {
      console.error('Error loading video:', error)
    }
  }, [track?.videoId])

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current) return

    try {
      if (isPlaying) {
        playerRef.current.playVideo()
      } else {
        playerRef.current.pauseVideo()
      }
    } catch (error) {
      console.error('Error controlling playback:', error)
    }
  }, [isPlaying])

  // Handle volume
  useEffect(() => {
    if (!playerRef.current) return

    try {
      const volumePercent = Math.round(volume * 100)
      playerRef.current.setVolume(volumePercent)
    } catch (error) {
      console.error('Error setting volume:', error)
    }
  }, [volume])

  // Handle time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current?.getCurrentTime) return

      try {
        const currentTime = playerRef.current.getCurrentTime()
        onTimeUpdate?.(currentTime)

        if (playerRef.current.getDuration) {
          const duration = playerRef.current.getDuration()
          onDurationChange?.(duration)
        }
      } catch (error) {
        console.error('Error getting player state:', error)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [onTimeUpdate, onDurationChange])

  const onPlayerReady = () => {
    // Player is ready
  }

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      onEnded?.()
    }
  }

  const onPlayerError = (event: any) => {
    console.error('YouTube player error:', event.data)
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full aspect-video" />
    </div>
  )
}
