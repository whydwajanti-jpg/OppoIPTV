export interface Provider {
  id: string;
  name: string;
  type: 'xtream' | 'm3u';
  baseUrl: string;
  username?: string;
  password?: string;
  playlistUrl?: string;
  status: 'NEW' | 'CONNECTING' | 'ACTIVE' | 'OFFLINE' | 'AUTH_FAILED' | 'EXPIRED' | 'INVALID_CONFIGURATION' | 'DISABLED';
  lastUpdated?: Date;
  expirationDate?: Date;
}

export interface Channel {
  id: string;
  providerId: string;
  name: string;
  number?: number;
  logo?: string;
  group?: string;
  epgId?: string;
  streamUrl: string;
  isFavorite: boolean;
  currentProgram?: Program;
  nextProgram?: Program;
}

export interface Program {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  category?: string;
  rating?: string;
  channelId: string;
  epgId?: string;
}

export interface VodItem {
  id: string;
  providerId: string;
  title: string;
  description?: string;
  poster?: string;
  backdrop?: string;
  year?: number;
  genre?: string;
  rating?: string;
  duration?: number;
  streamUrl: string;
  isFavorite: boolean;
  watchProgress?: WatchProgress;
}

export interface Series {
  id: string;
  providerId: string;
  title: string;
  description?: string;
  poster?: string;
  backdrop?: string;
  genres?: string[];
  seasons: Season[];
  isFavorite: boolean;
}

export interface Season {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description?: string;
  thumbnail?: string;
  streamUrl: string;
  duration?: number;
  watched: boolean;
  watchProgress?: WatchProgress;
}

export interface WatchProgress {
  contentId: string;
  providerId: string;
  position: number;
  duration: number;
  lastWatchedAt: Date;
  completed: boolean;
}

export interface Favorite {
  id: string;
  providerId: string;
  contentType: 'channel' | 'vod' | 'series';
  contentId: string;
  addedAt: Date;
}

export interface PlaybackState {
  status: 'IDLE' | 'LOADING' | 'READY' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'SEEKING' | 'STOPPING' | 'STOPPED' | 'ERROR' | 'RECOVERING' | 'RESOURCE_CONFLICT';
  currentTime: number;
  duration: number;
  error?: PlaybackError;
}

export interface PlaybackError {
  code: string;
  domain: 'NETWORK' | 'AUTHENTICATION' | 'PROVIDER' | 'CATALOG' | 'EPG' | 'PLAYBACK' | 'DECODER' | 'RESOURCE' | 'STORAGE' | 'PARSING' | 'CONFIGURATION' | 'PLATFORM' | 'SECURITY' | 'UNKNOWN';
  message: string;
  recoveryAction?: string;
}

export interface SearchResult {
  type: 'channel' | 'vod' | 'series' | 'episode';
  id: string;
  providerId: string;
  title: string;
  description?: string;
  image?: string;
}

export interface AppSettings {
  language: string;
  theme: 'dark' | 'light';
  autoStart: boolean;
  subtitleEnabled: boolean;
  subtitleLanguage?: string;
  audioLanguage?: string;
  epgTimezone: string;
  bufferingTimeout: number;
  maxRetries: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  language: string;
  favorites: Favorite[];
  watchHistory: WatchProgress[];
  providers: Provider[];
  playbackPreferences: PlaybackPreferences;
}

export interface PlaybackPreferences {
  autoResume: boolean;
  continueNextEpisode: boolean;
  subtitlePreference: 'off' | 'auto' | 'on';
  audioTrackPreference: string;
}

export interface CacheEntry<T> {
  data: T;
  ttl: number;
  version: string;
  expiresAt: Date;
  providerId: string;
}
