import React from "react"
import type { ProjectGalleryItem } from "../../../domain"
import { Button, ButtonProps } from "../../atomic/button"

interface GalleryItemButtonsProps {
    item: ProjectGalleryItem
    additionalCssClasses?: string[]
}

export const GalleryItemButtons = (props: GalleryItemButtonsProps): JSX.Element => {
    const buttons: ButtonProps[] = []
    if (props.item.codeUrl) {
        buttons.push({
            text: "Code",
            url: props.item.codeUrl,
            color: "lilac",
            xlinkHref: "#icon-github",
        })
    }
    if (props.item.docsUrl) {
        buttons.push({
            text: "Docs",
            url: props.item.docsUrl,
            color: "blue",
            xlinkHref: "#icon-doc",
        })
    }

    return (
        <div className={`gallery-item__btns ${props.additionalCssClasses?.join(" ")}`}>
            {buttons.map((buttonData) => {
                return <Button {...buttonData} key={buttonData.url} />
            })}
        </div>
    )
}
