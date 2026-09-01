interface CacheOptions {
  ttl: number;
  version?: string;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  version?: string;
}

export class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly maxSize = 100;

  set<T>(key: string, data: T, options: CacheOptions): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + options.ttl,
      version: options.version,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidateByPattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  private evictOldest(): void {
    let oldest: [string, CacheEntry<any>] | null = null;
    this.cache.forEach((entry, key) => {
      if (!oldest || entry.expiresAt < oldest[1].expiresAt) {
        oldest = [key, entry];
      }
    });
    if (oldest) {
      this.cache.delete(oldest[0]);
    }
  }
}

export const cacheService = new CacheService();
