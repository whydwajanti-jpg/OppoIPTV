import type { WatchProgress } from '@types/index';

const STORAGE_KEY = 'watch-progress';

export class PlaybackService {
  saveProgress(progress: WatchProgress): void {
    try {
      const all = this.getAllProgress();
      const existingIndex = all.findIndex(
        (p) => p.contentId === progress.contentId && p.providerId === progress.providerId
      );

      if (existingIndex >= 0) {
        all[existingIndex] = progress;
      } else {
        all.push(progress);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (error) {
      console.error('Failed to save watch progress:', error);
    }
  }

  getProgress(contentId: string, providerId: string): WatchProgress | null {
    try {
      const all = this.getAllProgress();
      return all.find((p) => p.contentId === contentId && p.providerId === providerId) || null;
    } catch (error) {
      console.error('Failed to get watch progress:', error);
      return null;
    }
  }

  getAllProgress(): WatchProgress[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load watch progress:', error);
      return [];
    }
  }

  clearProgress(contentId: string, providerId: string): void {
    try {
      const all = this.getAllProgress();
      const filtered = all.filter(
        (p) => !(p.contentId === contentId && p.providerId === providerId)
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to clear watch progress:', error);
    }
  }

  canResume(progress: WatchProgress): boolean {
    if (!progress || progress.completed) return false;
    
    const threshold = progress.duration * 0.9;
    return progress.position < threshold;
  }

  getResumePosition(progress: WatchProgress): number {
    if (!progress) return 0;
    if (progress.completed) return 0;
    return Math.max(0, progress.position);
  }
}

export const playbackService = new PlaybackService();
