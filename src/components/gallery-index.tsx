import React from "react"
import { FILTER_URL_HASH_PREFIX } from "../constants"
import type { Category, ProjectGalleryItem, ProjectId } from "../domain"
import { PROJECT_NAMES } from "../i18n"
import * as galleryProjectsSharedServices from "../services/shared/projects-galleries"
import { Categories } from "./atomic/categories"
import { GalleryItem } from "./gallery-item"

interface GalleryIndexProps {
    projectId: ProjectId
    galleryItems: ProjectGalleryItem[]
}

export const GalleryIndex = (props: GalleryIndexProps): JSX.Element => {
    const { projectId, galleryItems } = props

    const [categoriesFilter, setCategoriesFilter] = React.useState<string[]>([])

    React.useEffect(
        function activateFilterFromUrlOnMount() {
            if (window?.location?.hash.startsWith(FILTER_URL_HASH_PREFIX)) {
                const filteredCategory = window.location.hash.replace(FILTER_URL_HASH_PREFIX, "")
                // N.B. Without the `setTimeout` we get errors popping from the `ǹext/image` components
                setTimeout(setCategoriesFilter.bind(null, [filteredCategory]), 0)
            }
        },
        [] // only on mount
    )

    const categories = galleryProjectsSharedServices.projectGalleryCategories(galleryItems)

    const galleryItemsToDisplay = galleryItems.filter((item) => {
        if (!categoriesFilter.length) {
            return true
        }
        for (const categoryToDisplay of categoriesFilter) {
            if (item.categories.includes(categoryToDisplay)) {
                return true
            }
        }
        return false
    })

    const onClearFiltersClick = (e: React.MouseEvent): void => {
        setCategoriesFilter([]);
        e.preventDefault();
    }
    const onCategoryClick = (category: Category): void => {
        setCategoriesFilter([category])
    }

    return (
        <section className="gallery-items">
            <div className="gallery-items__bg" />
            <div className="container">
                <h2 className="gallery-items__headline">Projects using {PROJECT_NAMES[projectId]}</h2>
            </div>

            <div className="gallery-items__categories">
                
                    <Categories
                        categoriesWithCounts={categories}
                        onCategoryClick={onCategoryClick}
                        selectedCategories={categoriesFilter}
                    />
                    {categoriesFilter.length ? (
                        <p className="hint">
                            <a href="#" onClick={onClearFiltersClick}>
                                ⨯ Clear filters
                            </a>
                        </p>
                    ) : (
                        <p className="hint">
            
            
                            <a href="/gallery-instructions">Submit a project to the gallery</a>
                        </p>
                    )}
                
               
            </div>

            <div className="gallery-items__items">
                {galleryItemsToDisplay.map((item, i) => (
                    <React.Fragment key={item.id}>
                        {i !== 0 && <hr className="container gallery-items__divider" />}
                        <GalleryItem nth={i + 1} item={item} />
                    </React.Fragment>
                ))}
            </div>
        </section>
    )
}
