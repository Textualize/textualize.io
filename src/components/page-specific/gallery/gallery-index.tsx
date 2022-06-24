import React from "react"
import Link from "next/link"
import type { Category, ProjectGalleryItem, ProjectId } from "../../../domain"
import { CategoriesWithCount } from "../../../domain"
import { PROJECT_NAMES } from "../../../i18n"
import * as galleryProjectsSharedServices from "../../../services/shared/projects-galleries"
import { Categories } from "../../atomic/categories"
import { Pagination } from "../../pagination"
import { GalleryItem } from "./gallery-item"

interface GalleryIndexProps {
    projectId: ProjectId
    galleryItems: ProjectGalleryItem[]
    pagesCount: number
    currentPage: number
    selectedCategory: Category
    galleryCategoriesWithCount: CategoriesWithCount
}

export const GalleryIndex = (props: GalleryIndexProps): JSX.Element => {
    const galleryPageUrl = React.useCallback(
        (category: Category, page: number = 1): string => {
            return galleryProjectsSharedServices.projectGalleryPageUrl({ projectId: props.projectId, page, category })
        },
        [props.projectId]
    )

    const categoryLinkHrefFactory = React.useCallback(
        (category: Category): string => {
            return galleryPageUrl(category)
        },
        [galleryPageUrl]
    )

    const pageUrlFactory = galleryPageUrl.bind(null, props.selectedCategory)
    const pagination = (
        <Pagination currentPage={props.currentPage} pagesCount={props.pagesCount} pageUrlFactory={pageUrlFactory} />
    )

    return (
        <section className="gallery-items page__content_container">
            <div className="page__headline__bg" />
            <div className="container">
                <h2 className="page__headline">Projects using {PROJECT_NAMES[props.projectId]}</h2>
            </div>

            <div className="container">
                <p className="hint">
                    <Link href="/gallery-instructions">
                        <a>Submit a project to the gallery</a>
                    </Link>
                </p>
                {pagination}
                <div className="gallery-items__categories">
                    <Categories
                        categoriesWithCounts={props.galleryCategoriesWithCount}
                        selectedCategory={props.selectedCategory}
                        categoryLinkHrefFactory={categoryLinkHrefFactory}
                    />
                    {props.selectedCategory !== "all" ? (
                        <p className="hint">
                            <Link href={galleryPageUrl("all")}>
                                <a className="clear-filters-button">⨯ Clear filters</a>
                            </Link>
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="gallery-items__items">
                {props.galleryItems.map((item, i) => (
                    <React.Fragment key={item.id}>
                        {i !== 0 ? <hr className="container items__divider" /> : null}
                        <GalleryItem nth={i + 1} item={item} />
                    </React.Fragment>
                ))}
            </div>

            {pagination}
        </section>
    )
}
