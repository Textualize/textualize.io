/**
 * This is a very simple and naive "across Vercel builds" cache.
 * Pretty inefficient, as we're constantly reading the whole cache content from a JSON file,
 * but still better than querying the GitHub API again and again... :-)
 * We can only store JSON-able data there.
 *
 * @link https://vercel.com/docs/concepts/deployments/build-step#caching
 */
import { promises as fs } from "node:fs"
import { join } from "node:path"
import { projectRootPath } from "./_helpers"

type CacheKey = string
type CacheContent = Record<CacheKey, any>

const cacheFilePath = join(projectRootPath, ".next", "cache", "textualize-cache.json")

let debugMode: boolean = true

export function enableDebugMode(): void {
    debugMode = true
}

export async function get<T = any>(key: CacheKey, defaultValue: T | null = null): Promise<T | null> {
    const cacheContent = await wholeCacheContent()

    const value = cacheContent[key]
    if (value === undefined) {
        debugMode && console.debug(`BuildCache: MISS for key "${key}"`)
        return defaultValue
    }
    debugMode && console.debug(`BuildCache: HIT for key "${key}"`)
    return value
}

export async function set<T = any>(key: CacheKey, value: T): Promise<void> {
    debugMode && console.debug(`BuildCache: saving data for key "${key}"`)
    const cacheContent = await wholeCacheContent()
    cacheContent[key] = value
    await saveWholeCacheContent(cacheContent)
}

async function wholeCacheContent(): Promise<CacheContent> {
    try {
        const cacheContentRaw = await fs.readFile(cacheFilePath, "utf8")
        return JSON.parse(cacheContentRaw)
    } catch (err) {
        return {}
    }
}

async function saveWholeCacheContent(cacheContent: CacheContent): Promise<void> {
    try {
        const cacheContentRaw = JSON.stringify(cacheContent)
        await fs.writeFile(cacheFilePath, cacheContentRaw, "utf8")
    } catch (err) {
        debugMode && console.warn(`Couldn't save the build cache in "${cacheFilePath}": ${err}`)
    }
}
