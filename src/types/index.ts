export interface Track {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnailUrl: string;
  duration?: string;
  videoId?: string;
}

export interface SearchResponse {
  tracks: Track[];
  nextPageToken?: string;
  totalResults?: number;
}

export interface SearchError {
  code: string;
  message: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
}

export interface QueueState {
  tracks: Track[];
  currentIndex: number;
  history: Track[];
}
