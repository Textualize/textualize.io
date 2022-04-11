import React from "react"
import { ProjectData } from "../domain"
import { Editor } from "./editor"

interface Props extends ProjectData {
    nth: number
}

interface ButtonData {
    text: string
    url: string | null
    color: "lilac" | "blue"
    xlinkHref: string
}

export const Project = (props: Props) => {
    const { headline, stars, desc, tabName, codeUrl, docsUrl, nth } = props

    const buttons: ButtonData[] = [
        {
            text: "Code",
            url: codeUrl,
            color: "lilac",
            xlinkHref: "#icon-github",
        },
        {
            text: "Docs",
            url: docsUrl,
            color: "blue",
            xlinkHref: "#icon-doc",
        },
    ]

    return (
        <section className="container project">
            <div className="project__editor-wrapper">
                <div className="project__editor-back-layout-wrapper">
                    <div className={"project__back-layout project__back-layout-" + nth} />
                    <Editor tabName={tabName} />
                </div>
            </div>
            <div className="project__text-wrapper">
                <div className="project__head">
                    <h3 className="project__headline">{headline}</h3>
                    <div className="badge">
                        <svg height="1em" width="1em" className="badge__icon">
                            <use xlinkHref="#icon-start" />
                        </svg>
                        <span className="badge__label">{stars}</span>
                    </div>
                </div>
                <p className="project__desc">{desc}</p>
                <div className="project__btns">
                    {buttons.map((buttonData) => {
                        if (!buttonData.url) {
                            return null
                        }
                        return (
                            <a
                                href={buttonData.url}
                                className={`button button--${buttonData.color} u-fx-no-shrink`}
                                target="_blank"
                                rel="noreferrer"
                                key={buttonData.text}
                            >
                                <svg height="1em" width="1em">
                                    <use xlinkHref={buttonData.xlinkHref} />
                                </svg>
                                {buttonData.text}
                            </a>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
