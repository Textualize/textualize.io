import React from "react"
import Image from "next/image"
import Link from "next/link"
import type { ProjectGalleryItem } from "../../../domain"
import { projectGalleryItemPageUrl } from "../../../services/shared/projects-galleries"
import { Categories } from "../../atomic/categories"
import { GalleryItemButtons } from "./gallery-item-buttons"

interface GalleryItemProps {
    nth: number
    item: ProjectGalleryItem
}

export const GalleryItem = (props: GalleryItemProps) => {
    const { item } = props

    return (
        <section className="container gallery-item" id={`gallery-item-${item.id}`}>
            <div className="gallery-item__image-wrapper">
                <div className="gallery-item__image-back-layout-wrapper">
                    {item.image ? (
                        <Image
                            className="gallery-item__image"
                            src={item.image.url}
                            alt={item.title}
                            width={item.image.width}
                            height={item.image.height}
                        />
                    ) : null}
                </div>
            </div>
            <div className="gallery-item__text-wrapper">
                <div className="gallery-item__head">
                    <h3 className="gallery-item__headline">{item.title}</h3>
                    {item.stars ? (
                        <div className="badge">
                            <svg height="1em" width="1em" className="badge__icon">
                                <use xlinkHref="#icon-start" />
                            </svg>
                            <span className="badge__label">{item.stars}</span>
                        </div>
                    ) : null}
                </div>
                <div className="gallery-item__desc" dangerouslySetInnerHTML={{ __html: item.description }} />
                {item.longDescription ? (
                    <div className="gallery-item__read-more">
                        ❱{" "}
                        <Link href={projectGalleryItemPageUrl(item)}>
                            <a>Read more</a>
                        </Link>
                    </div>
                ) : null}
                <div className="gallery-item__categories">
                    <Categories categories={item.categories} />
                </div>
                <GalleryItemButtons item={item} additionalCssClasses={["item-btns"]} />
            </div>
        </section>
    )
}
