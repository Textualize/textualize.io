import { promises as fs } from "node:fs"
import { basename, join } from "node:path"
import type { ParsedUrlQuery } from "node:querystring"
import { promisify } from "node:util"
import { GetStaticPropsContext, GetStaticPropsResult } from "next/types"
import fastGlob from "fast-glob"
import matter from "gray-matter"
import imageSizeSync from "image-size"
import MarkdownIt from "markdown-it"
import { GALLERY_ITEMS_COUNT_PER_PAGE, PROJECTS_WITH_GALLERY, PROJECT_IDS } from "../../constants"
import type { CategoriesWithCount, Category, ImageProperties, ProjectGalleryItem, ProjectId } from "../../domain"
import { pagesRange } from "../../helpers/pagination-helpers"
import { isProjectId, projectGalleryCategories, projectGalleryForCategory } from "../shared/projects-galleries"
import * as galleryProjectsSharedServices from "../shared/projects-galleries"
import * as githubBackendServices from "./github"

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

export interface ProjectGalleryStaticPathsParams extends ParsedUrlQuery {
    projectId: string
    gallerySegments: string[]
}
export async function projectGalleryStaticPathsParams(): Promise<ProjectGalleryStaticPathsParams[]> {
    const pathParams = await Promise.all(
        PROJECTS_WITH_GALLERY.map(async (projectId): Promise<ProjectGalleryStaticPathsParams[]> => {
            const galleryItems = await projectGallery(projectId)
            const params: ProjectGalleryStaticPathsParams[] = []

            // Let's start with the "/[projectId]/gallery" page:
            params.push({ projectId, gallerySegments: [] })

            // Then, the "/[projectId]/gallery/[page]" and "/[projectId]/gallery/all/[page]" pages:
            params.push(...paginationParamsForProjectAndCategory(projectId, "all", galleryItems.length))

            // ...And then, for _each_ category, the "/[projectId]/gallery/[category]/[page]" pages:
            const galleryCategoriesWithCount = projectGalleryCategories(galleryItems)
            for (const [category, categoryItemsCount] of Object.entries(galleryCategoriesWithCount)) {
                params.push(...paginationParamsForProjectAndCategory(projectId, category, categoryItemsCount))
            }

            return params
        })
    )

    return pathParams.flat()
}

export interface ProjectGalleryPageProps {
    projectId: ProjectId
    page: number
    pagesCount: number
    category: Category
    galleryItems: ProjectGalleryItem[]
    galleryCategoriesWithCount: CategoriesWithCount
}

export async function projectGalleryStaticProps(
    context: GetStaticPropsContext<ProjectGalleryStaticPathsParams>
): Promise<GetStaticPropsResult<ProjectGalleryPageProps>> {
    if (!context.params || !context.params.projectId) {
        throw new Error("Received unexpected params for a project gallery page")
    }

    const projectId = context.params.projectId
    if (!galleryProjectsSharedServices.isProjectId(projectId)) {
        throw new Error(`Invalid projectId "${projectId}"`)
    }
    const [category, page] = galleryCategoryAndPageForSegments(context.params.gallerySegments || [])

    // Take all items for this project's gallery, build global stats with it, then paginate it
    const galleryItems = await projectGallery(projectId)
    const galleryCategoriesWithCount = galleryProjectsSharedServices.projectGalleryCategories(galleryItems)
    const galleryItemsForThisCategory = galleryProjectsSharedServices.projectGalleryForCategory(galleryItems, category)

    const pagesCount = galleryProjectsSharedServices.pagesCount(galleryItemsForThisCategory.length)
    const paginationIndexStart = GALLERY_ITEMS_COUNT_PER_PAGE * (page - 1) // because our pages start at "1"
    const paginationIndexEnd = paginationIndexStart + GALLERY_ITEMS_COUNT_PER_PAGE
    const paginatedGalleryItems = galleryItemsForThisCategory.slice(paginationIndexStart, paginationIndexEnd)

    // Add GitHub starts count for each item
    await githubBackendServices.attachCurrentStarsCountsToRepositories(paginatedGalleryItems)

    return {
        props: {
            projectId,
            page,
            pagesCount,
            category,
            galleryCategoriesWithCount,
            galleryItems: paginatedGalleryItems,
        },
    }
}

function paginationParamsForProjectAndCategory(
    projectId: ProjectId,
    category: Category,
    itemsCount: number
): ProjectGalleryStaticPathsParams[] {
    const pagesCount = galleryProjectsSharedServices.pagesCount(itemsCount)
    const params: ProjectGalleryStaticPathsParams[] = []

    const range = pagesRange(pagesCount)

    params.push(
        ...range.map((page) => {
            return { projectId, gallerySegments: [category, String(page)] }
        })
    )

    if (category === "all") {
        params.push(
            ...range.map((page) => {
                return { projectId, gallerySegments: [String(page)] }
            })
        )
    }

    return params
}

function galleryCategoryAndPageForSegments(segments: string[]): [Category, number] {
    let category: Category = "all"
    let page: number = 1 // our pages start at "1" rather than "0"
    switch (segments.length) {
        case 0:
            // This is a "/[projectId]/gallery" URL
            // Category is "all", page is "1": we have nothing to do here
            break
        case 1:
            // This can be a "/[projectId]/gallery/[category]" or a "/[projectId]/gallery/[page]" URL
            const firstSegmentAsPage = parseInt(segments[0])
            if (isNaN(firstSegmentAsPage)) {
                // The segment is likely a category
                category = segments[0]
            } else {
                // The segment seems to be a page number
                page = firstSegmentAsPage
            }
            break
        case 2:
            // This is a "/[projectId]/gallery/[category]/[page]" URL
            category = segments[0]
            const lastSegmentAsPage = parseInt(segments[1])
            if (!isNaN(lastSegmentAsPage)) {
                page = lastSegmentAsPage
            }
            break
    }

    return [category, page]
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

    const categories = ((matterContent.data["categories"] ?? []) as string[]).map((category) => category.toLowerCase())
    const image = await galleryItemImageProperties(projectId, itemId, options)

    return {
        projectId: projectId,
        id: itemId,
        image,
        description: mainContentHtml,
        title: matterContent.data["title"],
        categories: categories,
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
