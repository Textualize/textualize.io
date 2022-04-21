/**
 * This is a very simple and naive in-memory cache.
 * Could be replaced by Redis (♥) at some point, so let's only store JSON-able data there.
 */

type CacheKey = string

const cacheStore = new Map<CacheKey, any>()

let debugMode: boolean = false

export function enableDebugMode(): void {
    debugMode = true
}

export async function has(key: CacheKey): Promise<boolean> {
    return cacheStore.has(key)
}

export async function get<T = any>(key: CacheKey, defaultValue: T | null = null): Promise<T | null> {
    const value = cacheStore.get(key)
    if (value === undefined) {
        debugMode && console.debug(`Cache: MISS for key "${key}"`)
        return defaultValue
    }
    debugMode && console.debug(`Cache: HIT for key "${key}"`)
    return value
}

export async function set<T = any>(key: CacheKey, value: T): Promise<void> {
    cacheStore.set(key, value)
}

export async function del<T = any>(key: CacheKey): Promise<void> {
    cacheStore.delete(key)
}
