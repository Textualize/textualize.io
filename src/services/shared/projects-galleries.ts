import type { ProjectGalleryItem } from "../../domain"

export function projectGalleryCategories(galleryItems: ProjectGalleryItem[]): Record<string, number> {
    const categoriesWithStats: Record<string, number> = {}
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
