import { create } from 'zustand';
import type { Channel, Program } from '@types/index';

interface LiveTVState {
  channels: Channel[];
  selectedChannelId: string | null;
  currentCategory: string | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadChannels: (providerId: string) => Promise<void>;
  selectChannel: (channelId: string) => void;
  setCategory: (category: string | null) => void;
  toggleFavorite: (channelId: string) => void;
  updateEPG: (channelId: string, current: Program | undefined, next: Program | undefined) => void;
  getChannelsByCategory: (category: string) => Channel[];
  getSelectedChannel: () => Channel | undefined;
  setError: (error: string | null) => void;
  clearChannels: () => void;
}

export const useLiveTVStore = create<LiveTVState>((set, get) => ({
  channels: [],
  selectedChannelId: null,
  currentCategory: null,
  categories: [],
  isLoading: false,
  error: null,

  loadChannels: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cacheKey = `livetv-channels-${providerId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { channels, categories } = JSON.parse(cached);
        set({ channels, categories });
        return;
      }

      // Fetch from provider (implementation depends on provider type)
      // This is a placeholder
      const channels: Channel[] = [];
      const categories = [...new Set(channels.map((c) => c.group).filter(Boolean))] as string[];

      localStorage.setItem(cacheKey, JSON.stringify({ channels, categories }));
      set({ channels, categories });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load channels';
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  selectChannel: (channelId: string) =>
    set(() => ({
      selectedChannelId: channelId,
    })),

  setCategory: (category: string | null) =>
    set(() => ({
      currentCategory: category,
    })),

  toggleFavorite: (channelId: string) =>
    set((state) => ({
      channels: state.channels.map((c) =>
        c.id === channelId ? { ...c, isFavorite: !c.isFavorite } : c
      ),
    })),

  updateEPG: (channelId: string, current: Program | undefined, next: Program | undefined) =>
    set((state) => ({
      channels: state.channels.map((c) =>
        c.id === channelId
          ? { ...c, currentProgram: current, nextProgram: next }
          : c
      ),
    })),

  getChannelsByCategory: (category: string) => {
    const state = get();
    return state.channels.filter((c) => c.group === category);
  },

  getSelectedChannel: () => {
    const state = get();
    return state.channels.find((c) => c.id === state.selectedChannelId);
  },

  setError: (error: string | null) =>
    set(() => ({
      error,
    })),

  clearChannels: () =>
    set(() => ({
      channels: [],
      selectedChannelId: null,
      currentCategory: null,
      categories: [],
    })),
}));
