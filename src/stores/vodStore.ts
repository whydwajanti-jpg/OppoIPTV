import { create } from 'zustand';
import type { VodItem } from '@types/index';

interface VODState {
  items: VodItem[];
  selectedItemId: string | null;
  currentCategory: string | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadVOD: (providerId: string) => Promise<void>;
  selectItem: (itemId: string) => void;
  setCategory: (category: string | null) => void;
  toggleFavorite: (itemId: string) => void;
  getItemsByCategory: (category: string) => VodItem[];
  getSelectedItem: () => VodItem | undefined;
  setError: (error: string | null) => void;
  clearVOD: () => void;
}

export const useVODStore = create<VODState>((set, get) => ({
  items: [],
  selectedItemId: null,
  currentCategory: null,
  categories: [],
  isLoading: false,
  error: null,

  loadVOD: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cacheKey = `vod-items-${providerId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { items, categories } = JSON.parse(cached);
        set({ items, categories });
        return;
      }

      const items: VodItem[] = [];
      const categories = [...new Set(items.map((i) => i.genre).filter(Boolean))] as string[];

      localStorage.setItem(cacheKey, JSON.stringify({ items, categories }));
      set({ items, categories });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load VOD';
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  selectItem: (itemId: string) =>
    set(() => ({
      selectedItemId: itemId,
    })),

  setCategory: (category: string | null) =>
    set(() => ({
      currentCategory: category,
    })),

  toggleFavorite: (itemId: string) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, isFavorite: !i.isFavorite } : i
      ),
    })),

  getItemsByCategory: (category: string) => {
    const state = get();
    return state.items.filter((i) => i.genre === category);
  },

  getSelectedItem: () => {
    const state = get();
    return state.items.find((i) => i.id === state.selectedItemId);
  },

  setError: (error: string | null) =>
    set(() => ({
      error,
    })),

  clearVOD: () =>
    set(() => ({
      items: [],
      selectedItemId: null,
      currentCategory: null,
      categories: [],
    })),
}));
