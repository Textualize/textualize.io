import React from "react"
import Image from "next/image"
import type { ProjectGalleryItem } from "../domain"
import { Button, ButtonProps } from "./atomic/button"
import { Categories } from "./atomic/categories"

interface GalleryItemProps {
    nth: number
    item: ProjectGalleryItem
}

export const GalleryItem = (props: GalleryItemProps) => {
    const { item } = props

    const buttons: ButtonProps[] = []
    if (item.codeUrl) {
        buttons.push({
            text: "Code",
            url: item.codeUrl,
            color: "lilac",
            xlinkHref: "#icon-github",
        })
    }
    if (item.docsUrl) {
        buttons.push({
            text: "Docs",
            url: item.docsUrl,
            color: "blue",
            xlinkHref: "#icon-doc",
        })
    }

    return (
        <section className="container gallery-item">
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
                <div className="gallery-item__categories">
                    <Categories categories={item.categories} />
                </div>
                <div className="gallery-item__btns">
                    {buttons.map((buttonData) => {
                        return <Button {...buttonData} key={buttonData.url} />
                    })}
                </div>
            </div>
        </section>
    )
}
