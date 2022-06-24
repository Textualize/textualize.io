import React from "react"
import Image from "next/image"
import type { ProjectGalleryItem } from "../../../domain"
import { Categories } from "../../atomic/categories"
import { GalleryItemButtons } from "./gallery-item-buttons"

interface GalleryItemZoomProps {
    item: ProjectGalleryItem
}

export const GalleryItemZoom = (props: GalleryItemZoomProps): JSX.Element => {
    const item = props.item
    const itemHtmlContent = item.longDescription || item.description

    return (
        <article className="container gallery-item-zoom" id={`gallery-item-${item.id}`}>
            <div className="gallery-item-zoom__categories">
                <Categories categories={item.categories} />
            </div>
            {item.image ? (
                <div className="gallery-item-zoom__image-wrapper">
                    <Image
                        className="gallery-item-zoom__image"
                        src={item.image.url}
                        alt={item.title}
                        width={item.image.width}
                        height={item.image.height}
                    />
                </div>
            ) : null}

            <div className="gallery-item-zoom__content" dangerouslySetInnerHTML={{ __html: itemHtmlContent }} />
            <GalleryItemButtons item={item} additionalCssClasses={["item-btns"]} />
        </article>
    )
}
