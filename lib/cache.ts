const cache = new Map<string, { data: unknown; expires: number }>();

export interface CacheOptions {
  ttl?: number;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

export async function cacheSet(key: string, data: unknown, options: CacheOptions = {}): Promise<void> {
  const ttl = options.ttl || 300;
  cache.set(key, {
    data,
    expires: Date.now() + ttl * 1000,
  });
}

export async function cacheDelete(key: string): Promise<void> {
  cache.delete(key);
}

export async function cacheClear(): Promise<void> {
  cache.clear();
}

export function cacheKeys(): string[] {
  return Array.from(cache.keys());
}

export function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  return cacheGet<T>(key).then((cached) => {
    if (cached !== null) {
      return cached;
    }
    return fn().then((data) => {
      cacheSet(key, data, options);
      return data;
    });
  });
}

export const CACHE_KEYS = {
  PRODUCTS: "products:all",
  PRODUCT: (id: number) => `product:${id}`,
  CATEGORIES: "categories:all",
  FEATURED: "products:featured",
  BESTSELLING: "products:bestselling",
  NEW: "products:new",
  INVENTORY: "inventory:summary",
  ANALYTICS: (period: string) => `analytics:${period}`,
  ORDERS_STATS: "orders:stats",
  CUSTOMER_SEGMENTS: "customers:segments",
};

export const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600,
  VERY_LONG: 86400,
};
