import { Track } from '@/types'

const STORAGE_KEYS = {
  QUEUE: 'music_player_queue',
  VOLUME: 'music_player_volume',
  CURRENT_TRACK: 'music_player_current_track',
  PREFERENCES: 'music_player_preferences',
} as const

export const StorageService = {
  getQueue: (): Track[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUEUE)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  setQueue: (queue: Track[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue))
    } catch (error) {
      console.error('Failed to save queue:', error)
    }
  },

  getVolume: (): number => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VOLUME)
      return stored ? parseFloat(stored) : 1
    } catch {
      return 1
    }
  },

  setVolume: (volume: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString())
    } catch (error) {
      console.error('Failed to save volume:', error)
    }
  },

  getCurrentTrack: (): Track | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_TRACK)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  setCurrentTrack: (track: Track | null): void => {
    try {
      if (track) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_TRACK, JSON.stringify(track))
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TRACK)
      }
    } catch (error) {
      console.error('Failed to save current track:', error)
    }
  },

  getPreferences: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      return stored ? JSON.parse(stored) : { repeat: 'none', shuffle: false }
    } catch {
      return { repeat: 'none', shuffle: false }
    }
  },

  setPreferences: (preferences: { repeat: string; shuffle: boolean }): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  },

  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  },
}
