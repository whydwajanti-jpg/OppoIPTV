import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { AppSettings, UserProfile } from '@types/index';

type ScreenType = 'home' | 'livetv' | 'vod' | 'series' | 'search' | 'favorites' | 'provider-setup' | 'playback' | 'settings';

interface AppState {
  currentScreen: ScreenType;
  previousScreen: ScreenType | null;
  screenHistory: ScreenType[];
  settings: AppSettings;
  currentProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  navigateTo: (screen: ScreenType) => void;
  goBack: () => void;
  clearHistory: () => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  setProfile: (profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeApp: () => void;
  resetApp: () => void;
}

const defaultSettings: AppSettings = {
  language: 'en',
  theme: 'dark',
  autoStart: false,
  subtitleEnabled: true,
  epgTimezone: 'UTC',
  bufferingTimeout: 30000,
  maxRetries: 3,
};

export const useAppStore = create<AppState>()(subscribeWithSelector((set) => ({
  currentScreen: 'home',
  previousScreen: null,
  screenHistory: ['home'],
  settings: defaultSettings,
  currentProfile: null,
  isLoading: false,
  error: null,

  navigateTo: (screen: ScreenType) =>
    set((state) => ({
      previousScreen: state.currentScreen,
      currentScreen: screen,
      screenHistory: [...state.screenHistory, screen],
    })),

  goBack: () =>
    set((state) => {
      if (state.screenHistory.length <= 1) return state;
      const newHistory = state.screenHistory.slice(0, -1);
      return {
        screenHistory: newHistory,
        previousScreen: state.currentScreen,
        currentScreen: newHistory[newHistory.length - 1],
      };
    }),

  clearHistory: () =>
    set((state) => ({
      screenHistory: [state.currentScreen],
    })),

  setSettings: (newSettings: Partial<AppSettings>) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  setProfile: (profile: UserProfile) =>
    set(() => ({
      currentProfile: profile,
    })),

  setLoading: (loading: boolean) =>
    set(() => ({
      isLoading: loading,
    })),

  setError: (error: string | null) =>
    set(() => ({
      error,
    })),

  initializeApp: async () => {
    set({ isLoading: true });
    try {
      // Load settings from local storage
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        set({ settings: JSON.parse(savedSettings) });
      }
      // Load profile from local storage
      const savedProfile = localStorage.getItem('user-profile');
      if (savedProfile) {
        set({ currentProfile: JSON.parse(savedProfile) });
      }
    } catch (err) {
      set({ error: 'Failed to initialize application' });
    } finally {
      set({ isLoading: false });
    }
  },

  resetApp: () =>
    set(() => ({
      currentScreen: 'home',
      previousScreen: null,
      screenHistory: ['home'],
      settings: defaultSettings,
      currentProfile: null,
      isLoading: false,
      error: null,
    })),
})));

// Subscribe to settings changes and persist
useAppStore.subscribe(
  (state) => state.settings,
  (settings) => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }
);

// Subscribe to profile changes and persist
useAppStore.subscribe(
  (state) => state.currentProfile,
  (profile) => {
    if (profile) {
      localStorage.setItem('user-profile', JSON.stringify(profile));
    }
  }
);
