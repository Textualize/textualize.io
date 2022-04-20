import { promises as fs } from "node:fs"
import { basename, join } from "node:path"
import { promisify } from "node:util"
import fastGlob from "fast-glob"
import matter from "gray-matter"
import imageSizeSync from "image-size"
import MarkdownIt from "markdown-it"
import type { ImageProperties, ProjectGalleryItem, ProjectId } from "../../domain"

const projectRootPath = join(new URL(import.meta.url).pathname, "..", "..", "..", "..")
const dataFolderBasePath = join(projectRootPath, "data", "projects-galleries")
const imagesFolderBasePath = join(projectRootPath, "public", "projects-galleries")

const markdownParser = new MarkdownIt()

const galleryCache = new Map<ProjectId, ProjectGalleryItem[]>()

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
    project: ProjectId,
    options: ProjectGalleryDiscoveryOptions = {}
): Promise<ProjectGalleryItem[]> {
    const cachedValue = galleryCache.get(project)
    if (cachedValue) {
        return cachedValue
    }

    const folderPath = join(options.dataFolderPath || dataFolderBasePath, project)
    options.verbose && console.debug(`Traversing gallery folder "${folderPath}" for project "${project}"...`)

    const projectsFiles = await fastGlob("*.mdx", { cwd: folderPath, absolute: true })
    const galleryProjects = await Promise.all(
        projectsFiles.map((filePath) => galleryProjectFromMarkdownFilePath(project, filePath, options))
    )

    options.verbose && console.debug(`Found ${galleryProjects.length} items for project "${project}"'s gallery.`)

    galleryCache.set(project, galleryProjects)

    return galleryProjects
}

async function galleryProjectFromMarkdownFilePath(
    projectId: ProjectId,
    filePath: string,
    options: ProjectGalleryDiscoveryOptions
): Promise<ProjectGalleryItem> {
    const itemId = basename(filePath, ".mdx")

    const fileContent = await fs.readFile(filePath)
    const matterContent = matter(fileContent)

    const mainContentHtml = markdownParser.render(matterContent.content)

    const image = await galleryItemImageProperties(projectId, itemId, options)

    return {
        projectId: projectId,
        id: itemId,
        image,
        description: mainContentHtml,
        title: matterContent.data["title"],
        categories: matterContent.data["categories"] ?? [],
        codeUrl: matterContent.data["codeUrl"] ?? null,
        websiteUrl: matterContent.data["websiteUrl"] ?? null,
        docsUrl: matterContent.data["docsUrl"] ?? null,
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
