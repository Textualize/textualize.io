import { promises as fs } from "node:fs"
import { basename, join } from "node:path"
import fastGlob from "fast-glob"
import { inPlaceSort } from "fast-sort"
import matter from "gray-matter"
import type { BlogPost } from "../../domain"
import { renderMarkdown } from "../../helpers/markdown-helpers"
import * as cacheSharedServices from "../shared/cache"
import { projectRootPath } from "./_helpers"

const dataFolderBasePath = join(projectRootPath, "data", "blog")

export interface BlogPostsDiscoveryOptions {
    dataFolderPath?: string
    verbose?: boolean
}

export async function blogPosts(options: BlogPostsDiscoveryOptions = {}): Promise<BlogPost[]> {
    const cacheKey = "blog-posts"
    const cachedValue = await cacheSharedServices.get(cacheKey)
    if (cachedValue) {
        return cachedValue
    }

    const folderPath = options.dataFolderPath || dataFolderBasePath
    options.verbose && console.debug(`Traversing blog posts folder "${folderPath}"...`)

    const blogPostsFiles = await fastGlob("*.mdx", { cwd: folderPath, absolute: true })
    const blogPosts = await Promise.all(blogPostsFiles.map((filePath) => blogPostFromMarkdownFilePath(filePath)))

    options.verbose && console.debug(`Found ${blogPosts.length} blog posts.`)

    const blogPostsSlugs = new Set(blogPosts.map((blogPost) => blogPost.slug))
    if (blogPostsSlugs.size !== blogPosts.length) {
        throw new Error("Duplicate blog post slugs detected")
    }

    inPlaceSort(blogPosts).desc("date")

    await cacheSharedServices.set(cacheKey, blogPosts)

    return blogPosts
}

export async function blogPostFromSlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await blogPosts()
    return posts.find((blogPost) => blogPost.slug === slug)
}

async function blogPostFromMarkdownFilePath(filePath: string): Promise<BlogPost> {
    const fileBaseName = basename(filePath, ".mdx")
    const fileBaseNameMatch = fileBaseName.match(/^(\d{4}-\d{2}-\d{2})---([a-z0-9-]+)$/)
    if (!fileBaseNameMatch) {
        throw new Error(`Invalid blog post file name "${fileBaseName}" (should be YYYY-MM-DD---slug.mdx)`)
    }
    const [_, date, slug] = fileBaseNameMatch

    const fileContent = await fs.readFile(filePath)
    const { content, data } = matter(fileContent)

    const mainContentHtml = renderMarkdown(content)

    return {
        slug,
        date,
        title: data.title,
        content: mainContentHtml,
    }
}
