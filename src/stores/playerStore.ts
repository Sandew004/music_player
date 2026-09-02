import { create } from 'zustand'
import { Track, PlayerState } from '@/types'

interface PlayerStore extends PlayerState {
  setCurrentTrack: (track: Track | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setRepeat: (repeat: 'none' | 'one' | 'all') => void
  setShuffle: (shuffle: boolean) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  setQueue: (tracks: Track[]) => void
  playNext: () => void
  playPrevious: () => void
  clearQueue: () => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  repeat: 'none',
  shuffle: false,

  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setRepeat: (repeat) => set({ repeat }),
  setShuffle: (shuffle) => set({ shuffle }),

  addToQueue: (track) => {
    const { queue } = get()
    set({ queue: [...queue, track] })
  },

  removeFromQueue: (index) => {
    const { queue } = get()
    set({ queue: queue.filter((_, i) => i !== index) })
  },

  setQueue: (tracks) => set({ queue: tracks }),

  clearQueue: () => set({ queue: [], currentTrack: null, isPlaying: false }),

  playNext: () => {
    const { queue, currentTrack, repeat } = get()
    if (!queue.length) return

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id)
    let nextIndex = currentIndex + 1

    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0
      } else {
        set({ isPlaying: false })
        return
      }
    }

    set({ currentTrack: queue[nextIndex] })
  },

  playPrevious: () => {
    const { queue, currentTrack } = get()
    if (!queue.length) return

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id)
    const previousIndex = Math.max(0, currentIndex - 1)

    set({ currentTrack: queue[previousIndex] })
  },
}))
