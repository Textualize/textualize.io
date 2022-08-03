import { GALLERY_ITEMS_COUNT_PER_PAGE, PROJECTS_WITH_GALLERY } from "../../constants"
import type { CategoriesWithCount, Category, ProjectGalleryItem, ProjectId } from "../../domain"
import { pagesRange } from "../../helpers/pagination-helpers"
import * as galleryProjectsBackendServices from "../backend/projects-galleries"
import * as galleryProjectsSharedServices from "../shared/projects-galleries"

export interface ProjectGalleryStaticPathsParams {
    projectId: ProjectId
    gallerySegments: string[]
}
export async function projectGalleryStaticPathsParams(): Promise<ProjectGalleryStaticPathsParams[]> {
    const pathParams = await Promise.all(
        PROJECTS_WITH_GALLERY.map(async (projectId): Promise<ProjectGalleryStaticPathsParams[]> => {
            const galleryItems = await galleryProjectsBackendServices.projectGallery(projectId)
            const params: ProjectGalleryStaticPathsParams[] = []

            // Let's start with the "/[projectId]/gallery" page:
            params.push({ projectId, gallerySegments: [] })

            // Then, the "/[projectId]/gallery/[page]" and "/[projectId]/gallery/all/[page]" pages:
            params.push(...paginationParamsForProjectAndCategory(projectId, "all", galleryItems.length))

            // ...And finally, for _each_ category, the "/[projectId]/gallery/[category]/[page]" pages:
            const galleryCategoriesWithCount = galleryProjectsSharedServices.projectGalleryCategories(galleryItems)
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

export async function projectGalleryStaticProps({
    projectId,
    gallerySegments,
}: ProjectGalleryStaticPathsParams): Promise<ProjectGalleryPageProps> {
    const [category, page] = galleryCategoryAndPageForSegments(gallerySegments || [])

    // Take all items for this project's gallery, build global stats with it, then paginate it
    const galleryItems = await galleryProjectsBackendServices.projectGallery(projectId)
    const galleryCategoriesWithCount = galleryProjectsSharedServices.projectGalleryCategories(galleryItems)
    const galleryItemsForThisCategory = galleryProjectsSharedServices.projectGalleryForCategory(galleryItems, category)

    const pagesCount = galleryProjectsSharedServices.pagesCount(galleryItemsForThisCategory.length)
    const paginationIndexStart = GALLERY_ITEMS_COUNT_PER_PAGE * (page - 1) // because our pages start at "1"
    const paginationIndexEnd = paginationIndexStart + GALLERY_ITEMS_COUNT_PER_PAGE
    const paginatedGalleryItems = galleryItemsForThisCategory.slice(paginationIndexStart, paginationIndexEnd)

    return {
        projectId,
        page,
        pagesCount,
        category,
        galleryCategoriesWithCount,
        galleryItems: paginatedGalleryItems,
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

    // A "params" object for "implicit page 1" (when the page is not part of the URL)
    params.push({ projectId, gallerySegments: [category] })

    // A "params" object for each page
    params.push(
        ...range.map((page) => {
            return { projectId, gallerySegments: [category, String(page)] }
        })
    )

    // And for the "all" category, a "params" object for each page without the category in it
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
