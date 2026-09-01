import { parseISO, format, addHours, isAfter, isBefore } from 'date-fns';
import type { Program } from '@types/index';

export class EPGService {
  parseTimestamp(timeStr: string, timezone?: string): Date {
    try {
      if (timeStr.includes('T')) {
        return parseISO(timeStr);
      }
      
      const parsed = parseInt(timeStr, 10);
      if (!isNaN(parsed)) {
        return new Date(parsed * 1000);
      }

      return new Date(timeStr);
    } catch (error) {
      console.error('Failed to parse timestamp:', timeStr, error);
      return new Date();
    }
  }

  formatTime(date: Date, format_str: string = 'HH:mm'): string {
    try {
      return format(date, format_str);
    } catch (error) {
      console.error('Failed to format time:', error);
      return '';
    }
  }

  formatDuration(startTime: Date, endTime: Date): string {
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  getCurrentProgram(programs: Program[]): Program | undefined {
    const now = new Date();
    return programs.find(
      (p) => isBefore(now, p.endTime) && isAfter(now, p.startTime)
    );
  }

  getNextProgram(programs: Program[], current: Program): Program | undefined {
    return programs.find(
      (p) => isAfter(p.startTime, current.endTime)
    );
  }

  isStaleEPG(lastUpdated: Date, maxAge: number = 86400000): boolean {
    return Date.now() - lastUpdated.getTime() > maxAge;
  }

  normalizeEPGData(programs: any[]): Program[] {
    return programs.map((p) => ({
      id: p.id || `${p.channelId}-${p.start}`,
      title: p.title || 'Unknown',
      description: p.description,
      startTime: this.parseTimestamp(p.start || p.startTime),
      endTime: this.parseTimestamp(p.end || p.endTime),
      category: p.category || p.genre,
      rating: p.rating,
      channelId: p.channelId,
      epgId: p.epgId,
    }));
  }
}

export const epgService = new EPGService();
