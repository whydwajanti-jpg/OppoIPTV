import { create } from 'zustand';
import type { Favorite } from '@types/index';

interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadFavorites: () => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (favoriteId: string) => void;
  isFavorite: (contentType: string, contentId: string, providerId: string) => boolean;
  getFavoritesByType: (contentType: 'channel' | 'vod' | 'series') => Favorite[];
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  loadFavorites: () => {
    set({ isLoading: true });
    try {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        set({ favorites: JSON.parse(saved) });
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load favorites';
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  },

  addFavorite: (favorite: Favorite) =>
    set((state) => {
      const newFavorites = [...state.favorites, favorite];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    }),

  removeFavorite: (favoriteId: string) =>
    set((state) => {
      const newFavorites = state.favorites.filter((f) => f.id !== favoriteId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    }),

  isFavorite: (contentType: string, contentId: string, providerId: string) => {
    const state = get();
    return state.favorites.some(
      (f) =>
        f.contentType === contentType &&
        f.contentId === contentId &&
        f.providerId === providerId
    );
  },

  getFavoritesByType: (contentType: 'channel' | 'vod' | 'series') => {
    const state = get();
    return state.favorites.filter((f) => f.contentType === contentType);
  },

  clearFavorites: () =>
    set(() => ({
      favorites: [],
    })),
}));
