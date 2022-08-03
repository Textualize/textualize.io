import { promises as fs } from "node:fs"
import { basename, join } from "node:path"
import fastGlob from "fast-glob"
import { inPlaceSort } from "fast-sort"
import matter from "gray-matter"
import readingTime from "reading-time"
import stripTags from "striptags"
import type { BlogPost } from "../../domain"
import { renderMarkdownWithDangerouslyKeptHtml } from "../../helpers/markdown-helpers"
import * as metadata from "../../metadata"
import * as cacheSharedServices from "../shared/cache"
import { projectRootPath } from "./_helpers"

const dataFolderBasePath = join(projectRootPath, "data", "blog")

const BLOG_POST_EXCERPT_SEPARATOR = "<!-- end excerpt -->"

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

    const blogPostsFiles = await fastGlob("*.md", { cwd: folderPath, absolute: true })
    const blogPosts = await Promise.all(blogPostsFiles.map((filePath) => blogPostFromMarkdownFilePath(filePath)))

    options.verbose && console.debug(`Found ${blogPosts.length} blog posts.`)

    const blogPostsSlugs = new Set(blogPosts.map((blogPost) => blogPost.slug))
    if (blogPostsSlugs.size !== blogPosts.length) {
        throw new Error("Duplicate blog post slugs detected")
    }

    // Blog articles are sorted from most recently published to oldest ones:
    inPlaceSort(blogPosts).desc("date")

    await cacheSharedServices.set(cacheKey, blogPosts)

    return blogPosts
}

export async function blogPostFromSlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await blogPosts()
    return posts.find((blogPost) => blogPost.slug === slug)
}

async function blogPostFromMarkdownFilePath(filePath: string): Promise<BlogPost> {
    const fileBaseName = basename(filePath, ".md")
    const fileBaseNameMatch = fileBaseName.match(/^(\d{4}-\d{2}-\d{2})---([a-z0-9-]+)$/)
    if (!fileBaseNameMatch) {
        throw new Error(`Invalid blog post file name "${fileBaseName}" (should be YYYY-MM-DD---slug.mdx)`)
    }
    const [_, date, slug] = fileBaseNameMatch

    const fileContent = await fs.readFile(filePath)
    const { content, excerpt, data } = matter(fileContent, {
        excerpt: true,
        excerpt_separator: BLOG_POST_EXCERPT_SEPARATOR,
    })

    const excerptHtml = renderMarkdownWithDangerouslyKeptHtml(excerpt || "").trim()
    const mainContentHtml = renderMarkdownWithDangerouslyKeptHtml(content).trim()
    const mainContentReadingTime = readingTime(stripTags(mainContentHtml)).minutes

    return {
        slug,
        title: data.title,
        date,
        lastModifiedDate: data.lastModifiedDate || null,
        author: data.author || metadata.BLOG_POST_DEFAULT_AUTHOR,
        content: mainContentHtml,
        excerpt: excerptHtml,
        readingTime: mainContentReadingTime,
    }
}
