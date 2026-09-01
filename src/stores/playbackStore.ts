import { create } from 'zustand';
import type { PlaybackState, PlaybackError } from '@types/index';

interface PlaybackStore extends PlaybackState {
  contentId: string | null;
  contentType: 'channel' | 'vod' | 'episode' | null;
  providerId: string | null;
  streamUrl: string | null;
  audioTracks: { id: string; label: string; language?: string }[];
  subtitleTracks: { id: string; label: string; language?: string }[];
  selectedAudioTrack: string | null;
  selectedSubtitleTrack: string | null;
  
  // Actions
  loadContent: (contentId: string, contentType: 'channel' | 'vod' | 'episode', streamUrl: string, providerId: string) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  stop: () => void;
  setStatus: (status: PlaybackState['status']) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setError: (error: PlaybackError | null) => void;
  selectAudioTrack: (trackId: string) => void;
  selectSubtitleTrack: (trackId: string) => void;
  setAudioTracks: (tracks: { id: string; label: string; language?: string }[]) => void;
  setSubtitleTracks: (tracks: { id: string; label: string; language?: string }[]) => void;
  reset: () => void;
}

export const usePlaybackStore = create<PlaybackStore>((set) => ({
  status: 'IDLE',
  currentTime: 0,
  duration: 0,
  contentId: null,
  contentType: null,
  providerId: null,
  streamUrl: null,
  audioTracks: [],
  subtitleTracks: [],
  selectedAudioTrack: null,
  selectedSubtitleTrack: null,

  loadContent: (contentId: string, contentType: 'channel' | 'vod' | 'episode', streamUrl: string, providerId: string) =>
    set(() => ({
      contentId,
      contentType,
      streamUrl,
      providerId,
      status: 'LOADING',
      currentTime: 0,
    })),

  play: () =>
    set((state) => ({
      status: state.status === 'PAUSED' ? 'PLAYING' : 'PLAYING',
    })),

  pause: () =>
    set(() => ({
      status: 'PAUSED',
    })),

  resume: () =>
    set(() => ({
      status: 'PLAYING',
    })),

  seek: (time: number) =>
    set(() => ({
      currentTime: time,
      status: 'SEEKING',
    })),

  stop: () =>
    set(() => ({
      status: 'STOPPED',
    })),

  setStatus: (status: PlaybackState['status']) =>
    set(() => ({
      status,
    })),

  setCurrentTime: (time: number) =>
    set(() => ({
      currentTime: time,
    })),

  setDuration: (duration: number) =>
    set(() => ({
      duration,
    })),

  setError: (error: PlaybackError | null) =>
    set(() => ({
      error,
      status: error ? 'ERROR' : 'IDLE',
    })),

  selectAudioTrack: (trackId: string) =>
    set(() => ({
      selectedAudioTrack: trackId,
    })),

  selectSubtitleTrack: (trackId: string) =>
    set(() => ({
      selectedSubtitleTrack: trackId,
    })),

  setAudioTracks: (tracks: { id: string; label: string; language?: string }[]) =>
    set(() => ({
      audioTracks: tracks,
    })),

  setSubtitleTracks: (tracks: { id: string; label: string; language?: string }[]) =>
    set(() => ({
      subtitleTracks: tracks,
    })),

  reset: () =>
    set(() => ({
      status: 'IDLE',
      currentTime: 0,
      duration: 0,
      contentId: null,
      contentType: null,
      providerId: null,
      streamUrl: null,
      audioTracks: [],
      subtitleTracks: [],
      selectedAudioTrack: null,
      selectedSubtitleTrack: null,
    })),
}));
