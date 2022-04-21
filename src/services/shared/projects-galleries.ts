import { GALLERY_ITEMS_COUNT_PER_PAGE, PROJECT_IDS } from "../../constants"
import type { CategoriesWithCount, Category, ProjectGalleryItem, ProjectId } from "../../domain"

export function pagesCount(itemsCount: number): number {
    return Math.ceil(itemsCount / GALLERY_ITEMS_COUNT_PER_PAGE)
}

export function isProjectId(projectId: any): projectId is ProjectId {
    return PROJECT_IDS.includes(projectId)
}

export function projectGalleryCategories(galleryItems: ProjectGalleryItem[]): CategoriesWithCount {
    const categoriesWithStats: CategoriesWithCount = {}
    for (const item of galleryItems) {
        for (const category of item.categories) {
            if (categoriesWithStats[category] === undefined) {
                categoriesWithStats[category] = 0
            }
            categoriesWithStats[category]++
        }
    }

    return categoriesWithStats
}

export function projectGalleryForCategory(
    galleryItems: ProjectGalleryItem[],
    category: Category
): ProjectGalleryItem[] {
    if (category === "all") {
        return galleryItems.slice()
    }
    return galleryItems.filter((item) => item.categories.includes(category))
}

export function projectGalleryPageUrl(kwargs: { projectId: ProjectId; category: Category; page: number }): string {
    const canonicalUrlSegments = [kwargs.projectId, "gallery"]
    if (kwargs.category !== "all") {
        canonicalUrlSegments.push(encodeURIComponent(kwargs.category))
    }
    if (kwargs.page > 1) {
        canonicalUrlSegments.push(String(kwargs.page))
    }
    return "/" + canonicalUrlSegments.join("/")
}
