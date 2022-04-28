/**
 * This is a very simple and naive "across Vercel builds" cache.
 * Pretty inefficient, as we're constantly reading cache entries JSON files,
 * but still better than querying the GitHub API again and again... :-)
 * We can only store JSON-able data there.
 *
 * @link https://vercel.com/docs/concepts/deployments/build-step#caching
 */
import { createHash } from "node:crypto"
import { promises as fs } from "node:fs"
import { join } from "node:path"
import { projectRootPath } from "./_helpers"

type CacheKey = string

const cacheFolderPath = join(projectRootPath, ".next", "cache")
const hash = createHash("sha256")

const debugMode = { miss: false, hit: false, set: false }

export function enableDebugMode(debug: { miss: boolean; hit: boolean; set: boolean }): void {
    Object.assign(debugMode, debug)
}

export async function get<T = any>(key: CacheKey, defaultValue: T | null = null): Promise<T | null> {
    try {
        const cacheContent = await JSON.parse(await fs.readFile(cacheFilePath(key), "utf8"))
        debugMode.hit && console.debug(`BuildCache: HIT for key "${key}"`)
        return cacheContent["value"]
    } catch (err) {
        debugMode.miss && console.debug(`BuildCache: MISS for key "${key}"`)
        return defaultValue
    }
}

export async function set<T = any>(key: CacheKey, value: T): Promise<void> {
    debugMode.set && console.debug(`BuildCache: saving data for key "${key}"`)
    // N.B. We don't do anything with the "createdAt" key for nw, but it could be useful to
    // progressively refresh our cache later on.
    const cacheContent = { value, createAt: new Date().toISOString() }
    await fs.writeFile(cacheFilePath(key), JSON.stringify(cacheContent) + "\n", "utf8")
}

function cacheFilePath(key: CacheKey): string {
    return join(cacheFolderPath, `textualize-cache.${cacheKeyAsHash(key)}.json`)
}

function cacheKeyAsHash(key: CacheKey): string {
    return hash.copy().update(key).digest("hex")
}
