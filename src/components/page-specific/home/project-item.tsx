import React from "react"
import { useInView } from "react-intersection-observer"
import { PROJECTS_WITH_GALLERY } from "../../../constants"
import type { ProjectData } from "../../../domain"
import * as galleryProjectsSharedServices from "../../../services/shared/projects-galleries"
import { Button, ButtonProps } from "../../atomic/button"
import { Terminal } from "../../terminal"

interface ProjectProps {
    project: ProjectData
    nth: number
}

export const Project = (props: ProjectProps) => {
    const { project, nth } = props

    const { ref, inView } = useInView({
        threshold: 0.9,
        // Once a project background effect was displayed, we leave it in place:
        triggerOnce: true,
    })

    const buttons: ButtonProps[] = [
        {
            text: "Code",
            url: project.codeUrl,
            color: "lilac",
            xlinkHref: "#icon-github",
        },
        {
            text: "Docs",
            url: project.docsUrl,
            color: "blue",
            xlinkHref: "#icon-doc",
        },
    ]

    if (PROJECTS_WITH_GALLERY.includes(project.id)) {
        buttons.push({
            text: "Gallery",
            url: galleryProjectsSharedServices.projectGalleryPageUrl({
                projectId: project.id,
                category: "all",
                page: 1,
            }),
            color: "blue-light",
            xlinkHref: "#icon-list",
        })
    }

    const terminalBackLayoutWrapperClassNames = ["project__terminal-back-layout-wrapper"]
    if (inView) {
        terminalBackLayoutWrapperClassNames.push("project__terminal-back-layout-wrapper--visible")
    }

    return (
        <section className="container project" id={`project-${project.id}`}>
            <div className="project__terminal-wrapper">
                <div className={terminalBackLayoutWrapperClassNames.join(" ")} ref={ref}>
                    <div className={`project__back-layout project__back-layout-${nth}`} />
                    <Terminal videoUrl={project.videoUrl} tabName={project.headline} />
                </div>
            </div>
            <div className="project__text-wrapper">
                <div className="project__head">
                    <h3 className="project__headline">{project.headline}</h3>
                    <div className="badge">
                        <svg height="1em" width="1em" className="badge__icon">
                            <use xlinkHref="#icon-start" />
                        </svg>
                        <span className="badge__label">{project.stars}</span>
                    </div>
                </div>
                <p className="project__desc">{project.desc}</p>
                <div className="project__btns item-btns">
                    {buttons.map((buttonData) => {
                        return <Button {...buttonData} key={buttonData.url} />
                    })}
                </div>
            </div>
        </section>
    )
}
