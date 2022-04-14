import React from "react"
import type { ProjectData, ProjectId } from "../domain"
import { Button, ButtonProps } from "./atomic/button"
import { Terminal } from "./terminal"

interface ProjectProps {
    project: ProjectData
    nth: number
}

const PROJECTS_WITH_GALLERY: ProjectId[] = ["textual", "rich"]

export const Project = (props: ProjectProps) => {
    const { project, nth } = props

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
            url: `/projects-using-${project.id}`,
            color: "blue-light",
            xlinkHref: "#icon-list",
        })
    }

    let videoUrl = `/video/${project.id}.mp4`
    //TODO: remove that line when we have a video for each project
    videoUrl = "/video/test.mp4"

    return (
        <section className="container project" id={`project-${project.id}`}>
            <div className="project__terminal-wrapper">
                <div className="project__terminal-back-layout-wrapper">
                    <div className={`project__back-layout project__back-layout-${nth}`} />
                    <Terminal videoUrl={videoUrl} tabName={project.headline} />
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
                <div className="project__btns">
                    {buttons.map((buttonData) => {
                        return <Button {...buttonData} key={buttonData.url} />
                    })}
                </div>
            </div>
        </section>
    )
}
