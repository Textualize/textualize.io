import { promises as fs } from "node:fs"
import { basename, join } from "node:path"
import { promisify } from "node:util"
import fastGlob from "fast-glob"
import matter from "gray-matter"
import imageSizeSync from "image-size"
import type { ImageProperties, ProjectGalleryItem, ProjectId } from "../../domain"
import { renderMarkdown } from "../../helpers/markdown-helpers"
import * as cacheSharedServices from "../shared/cache"
import * as galleryProjectsSharedServices from "../shared/projects-galleries"
import { projectRootPath } from "./_helpers"

const dataFolderBasePath = join(projectRootPath, "data", "projects-galleries")
const imagesFolderBasePath = join(projectRootPath, "public", "projects-galleries")

const imageSize = promisify(imageSizeSync)

// N.B. First file we find stops the lookup, so order in this array matters.
// (only if we have multiple files uploaded for a single project though, which is unlikely to happen)
const SUPPORTED_FILE_EXTENSIONS = ["png", "jpg", "jpeg", "gif"] as const

export interface ProjectGalleryDiscoveryOptions {
    dataFolderPath?: string
    imagesFolderPath?: string
    verbose?: boolean
}

export async function projectGallery(
    projectId: ProjectId,
    options: ProjectGalleryDiscoveryOptions = {}
): Promise<ProjectGalleryItem[]> {
    const cacheKey = `project-gallery:${projectId}`
    const cachedValue = await cacheSharedServices.get(cacheKey)
    if (cachedValue) {
        return cachedValue
    }

    try {
        // See `src/scripts/generate-data-code-for-galleries.ts` to see what code we generate there
        const codegenForThisGallery = await import(`../../codegen/data/project-galleries/${projectId}`)
        const galleryProjects = codegenForThisGallery.gallery
        await cacheSharedServices.set(cacheKey, galleryProjects)
        return galleryProjects
    } catch (err) {
        // Codegen was not triggered; that's fine, we''ll just compute the data on the fly right away
    }

    const folderPath = join(options.dataFolderPath || dataFolderBasePath, projectId)
    options.verbose && console.debug(`Traversing gallery folder "${folderPath}" for project "${projectId}"...`)

    const projectsFiles = await fastGlob("*.md", { cwd: folderPath, absolute: true })
    const galleryProjects = await Promise.all(
        projectsFiles.map((filePath) => galleryProjectFromMarkdownFilePath(projectId, filePath, options))
    )

    options.verbose && console.debug(`Found ${galleryProjects.length} items for project "${projectId}"'s gallery.`)

    await cacheSharedServices.set(cacheKey, galleryProjects)

    return galleryProjects
}

export async function projectGalleryPageUrlForItem(projectId: ProjectId, itemId: string): Promise<string> {
    const galleryItems = await projectGallery(projectId)
    const page = projectGalleryPageNumberForItem(galleryItems, itemId)

    return galleryProjectsSharedServices.projectGalleryPageUrl({
        projectId,
        category: "all",
        page,
    })
}

function projectGalleryPageNumberForItem(galleryItems: ProjectGalleryItem[], itemId: string): number {
    for (let i = 0, j = galleryItems.length; i < j; i++) {
        if (galleryItems[i].id === itemId) {
            return i + 1 // because page numbers start at 1
        }
    }
    throw new Error(`Can't find page number for item "${itemId}"`)
}

async function galleryProjectFromMarkdownFilePath(
    projectId: ProjectId,
    filePath: string,
    options: ProjectGalleryDiscoveryOptions
): Promise<ProjectGalleryItem> {
    const itemId = basename(filePath, ".md")

    const fileContent = await fs.readFile(filePath)
    const { content, data } = matter(fileContent)

    const descriptionHtml = renderMarkdown(data["description"].trim())
    const mainContentHtml = renderMarkdown(content.trim())

    const categories = ((data["categories"] ?? []) as string[]).map((category) => category.toLowerCase())
    const image = await galleryItemImageProperties(projectId, itemId, options)

    return {
        projectId: projectId,
        id: itemId,
        image,
        description: descriptionHtml,
        longDescription: mainContentHtml || null,
        title: data["title"],
        categories: categories,
        codeUrl: data["codeUrl"] ?? null,
        websiteUrl: data["websiteUrl"] ?? null,
        docsUrl: data["docsUrl"] ?? null,
        stars: null, // will be set with `attachCurrentStarsCountsToRepositories()`
    }
}

async function galleryItemImageProperties(
    projectId: ProjectId,
    itemId: string,
    options: ProjectGalleryDiscoveryOptions
): Promise<ImageProperties | null> {
    const folderPath = options.imagesFolderPath || imagesFolderBasePath

    const imageLookupPromises = await Promise.allSettled(
        SUPPORTED_FILE_EXTENSIONS.map(async (fileExt): Promise<[string, string]> => {
            const imagePath = join(folderPath, projectId, `${itemId}.${fileExt}`)
            // N.B. We deliberately let the errors pop here if the file doesn't exist
            const hasImage = (await fs.stat(imagePath)).isFile()
            if (hasImage) {
                return [fileExt, imagePath]
            }
            throw `No "${fileExt}" image found` // we won't do anything with this error msg anyhow
        })
    )

    let [fileExt, imagePath]: [string, string] = ["", ""]
    for (const result of imageLookupPromises) {
        if (result.status === "fulfilled") {
            ;[fileExt, imagePath] = result.value
            break // we stop at the first image we find
        }
    }

    if (!imagePath || !fileExt) {
        options.verbose && console.info(`No images found for item "${itemId}" of project "${projectId}"`)
        return null
    }

    const size = await imageSize(imagePath)

    if (!size || !size.width || !size.height) {
        console.warn(`Can't extract size from image "${imagePath}"`)
        return null
    }

    options.verbose && console.info(`Found "${fileExt}" image for item "${itemId}" of project "${projectId}"`)

    return { url: `/projects-galleries/${projectId}/${itemId}.${fileExt}`, width: size.width, height: size.height }
}
