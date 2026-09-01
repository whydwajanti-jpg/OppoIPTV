import { create } from 'zustand';
import type { Provider } from '@types/index';

interface ProviderState {
  providers: Provider[];
  selectedProviderId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadProviders: () => Promise<void>;
  addProvider: (provider: Provider) => void;
  removeProvider: (providerId: string) => void;
  updateProvider: (providerId: string, updates: Partial<Provider>) => void;
  selectProvider: (providerId: string) => void;
  validateProvider: (provider: Omit<Provider, 'id' | 'status'>) => Promise<boolean>;
  getProvider: (providerId: string) => Provider | undefined;
  setError: (error: string | null) => void;
  clearProviders: () => void;
}

export const useProviderStore = create<ProviderState>((set, get) => ({
  providers: [],
  selectedProviderId: null,
  isLoading: false,
  error: null,

  loadProviders: async () => {
    set({ isLoading: true, error: null });
    try {
      const savedProviders = localStorage.getItem('providers');
      if (savedProviders) {
        const providers = JSON.parse(savedProviders);
        set({ providers });
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load providers';
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  addProvider: (provider: Provider) =>
    set((state) => {
      const newProviders = [...state.providers, provider];
      localStorage.setItem('providers', JSON.stringify(newProviders));
      return { providers: newProviders };
    }),

  removeProvider: (providerId: string) =>
    set((state) => {
      const newProviders = state.providers.filter((p) => p.id !== providerId);
      localStorage.setItem('providers', JSON.stringify(newProviders));
      const selectedProviderId =
        state.selectedProviderId === providerId ? null : state.selectedProviderId;
      return { providers: newProviders, selectedProviderId };
    }),

  updateProvider: (providerId: string, updates: Partial<Provider>) =>
    set((state) => {
      const newProviders = state.providers.map((p) =>
        p.id === providerId ? { ...p, ...updates } : p
      );
      localStorage.setItem('providers', JSON.stringify(newProviders));
      return { providers: newProviders };
    }),

  selectProvider: (providerId: string) =>
    set(() => ({
      selectedProviderId: providerId,
    })),

  validateProvider: async (provider: Omit<Provider, 'id' | 'status'>): Promise<boolean> => {
    try {
      if (provider.type === 'xtream') {
        if (!provider.baseUrl || !provider.username || !provider.password) {
          set({ error: 'Missing required fields for Xtream provider' });
          return false;
        }
        // Validate Xtream connection
        const response = await fetch(
          `${provider.baseUrl}/player_api.php?username=${provider.username}&password=${provider.password}&action=get_live_categories`,
          { method: 'GET', timeout: 10000 }
        );
        if (!response.ok) {
          set({ error: 'Authentication failed' });
          return false;
        }
      } else if (provider.type === 'm3u') {
        if (!provider.playlistUrl) {
          set({ error: 'Missing playlist URL for M3U provider' });
          return false;
        }
        // Validate M3U playlist
        const response = await fetch(provider.playlistUrl, { timeout: 10000 });
        if (!response.ok) {
          set({ error: 'Failed to fetch playlist' });
          return false;
        }
        const text = await response.text();
        if (!text.includes('#EXTM3U')) {
          set({ error: 'Invalid M3U playlist format' });
          return false;
        }
      }
      set({ error: null });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Validation failed';
      set({ error });
      return false;
    }
  },

  getProvider: (providerId: string) => {
    return get().providers.find((p) => p.id === providerId);
  },

  setError: (error: string | null) =>
    set(() => ({
      error,
    })),

  clearProviders: () =>
    set(() => ({
      providers: [],
      selectedProviderId: null,
    })),
}));
