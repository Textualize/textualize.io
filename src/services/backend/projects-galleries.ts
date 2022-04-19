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

export async function projectGallery(project: ProjectId): Promise<ProjectGalleryItem[]> {
    const cachedValue = galleryCache.get(project)
    if (cachedValue) {
        return cachedValue
    }

    console.debug(`Traversing gallery for project "${project}"...`)

    const projectsFiles = await fastGlob("*.mdx", { cwd: join(dataFolderBasePath, project), absolute: true })
    const galleryProjects = await Promise.all(
        projectsFiles.map((filePath) => galleryProjectFromMarkdownFilePath(project, filePath))
    )

    console.debug(`Found ${galleryProjects.length} items for project "${project}"'s gallery.`)

    galleryCache.set(project, galleryProjects)

    return galleryProjects
}

async function galleryProjectFromMarkdownFilePath(projectId: ProjectId, filePath: string): Promise<ProjectGalleryItem> {
    const itemId = basename(filePath, ".mdx")

    const fileContent = await fs.readFile(filePath)
    const matterContent = matter(fileContent)

    const mainContentHtml = markdownParser.render(matterContent.content)

    const image = await galleryItemImageProperties(projectId, itemId)

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

async function galleryItemImageProperties(projectId: ProjectId, itemId: string): Promise<ImageProperties | null> {
    const imageLookupPromises = await Promise.allSettled(
        SUPPORTED_FILE_EXTENSIONS.map(async (fileExt): Promise<[string, string]> => {
            const imagePath = join(imagesFolderBasePath, projectId, `${itemId}.${fileExt}`)
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
        console.info(`No images found for item "${itemId}" of project "${projectId}"`)
        return null
    }

    const size = await imageSize(imagePath)

    if (!size || !size.width || !size.height) {
        console.warn(`Can't extract size from image "${imagePath}"`)
        return null
    }

    console.info(`Found "${fileExt}" image for item "${itemId}" of project "${projectId}"`)

    return { url: `/projects-galleries/${projectId}/${itemId}.${fileExt}`, width: size.width, height: size.height }
}
