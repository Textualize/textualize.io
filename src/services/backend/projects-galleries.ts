import { promises as fs } from "node:fs"
import { basename, join } from "node:path"
import { promisify } from "node:util"
import fastGlob from "fast-glob"
import matter from "gray-matter"
import imageSizeSync from "image-size"
import MarkdownIt from "markdown-it"
import type { Category, ImageProperties, ProjectGalleryItem, ProjectId } from "../../domain"

const projectRootPath = join(new URL(import.meta.url).pathname, "..", "..", "..", "..")
const dataFolderBasePath = join(projectRootPath, "data", "projects-galleries")
const imagesFolderBasePath = join(projectRootPath, "public", "projects-galleries")

const markdownParser = new MarkdownIt()

const galleryCache = new Map<ProjectId, ProjectGalleryItem[]>()

const imageSize = promisify(imageSizeSync)

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
        categories: matterContent.data["categories"] ?? ([] as Category[]),
        codeUrl: matterContent.data["codeUrl"] ?? null,
        websiteUrl: matterContent.data["websiteUrl"] ?? null,
        docsUrl: matterContent.data["docsUrl"] ?? null,
        stars: null, // will be set with `attachCurrentStarsCountsToRepositories()`
    }
}

async function galleryItemImageProperties(projectId: ProjectId, itemId: string): Promise<ImageProperties | null> {
    const imagePath = join(imagesFolderBasePath, projectId, `${itemId}.png`)
    let hasImage: boolean = false
    try {
        hasImage = (await fs.stat(imagePath)).isFile()
    } catch (e) {
        // pass
    }
    if (!hasImage) {
        return null
    }

    const size = await imageSize(imagePath)

    if (!size || !size.width || !size.height) {
        console.info(`Can't extract size from image "${imagePath}"`)
        return null
    }

    return { url: `/projects-galleries/${projectId}/${itemId}.png`, width: size.width, height: size.height }
}
