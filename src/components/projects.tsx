import React, { Fragment } from "react"
import { AppConfig } from "../config"
import { ProjectData } from "../domain"
import { Project } from "./project"

const projectsConfig = AppConfig.textualize.projects

const projects: ProjectData[] = [
    {
        headline: "Rich",
        stars: "36.5k",
        desc: "A Python framework for rich text and beautiful formatting in the terminal",
        tabName: "Rich",
        codeUrl: projectsConfig["rich"].code,
        docsUrl: projectsConfig["rich"].docs,
    },
    {
        headline: "Textual",
        stars: "9k",
        desc: "Build amazing TUIs (Text User Interfaces) with this innovative Python framework",
        tabName: "Textual",
        codeUrl: projectsConfig["textual"].code,
        docsUrl: projectsConfig["textual"].docs,
    },
    {
        headline: "Rich CLI",
        stars: "1.5k",
        desc: "Syntax highlighting, markdown, JSON, and more, at the command prompt.",
        tabName: "Rich CLI",
        codeUrl: projectsConfig["rich-cli"].code,
        docsUrl: projectsConfig["rich-cli"].docs,
    },
]

export const Projects = () => (
    <section className="projects">
        <div className="projects__bg" />
        <div className="container">
            <h2 className="projects__headline">Projects</h2>
        </div>
        <div className="projects__items">
            {projects.map((project, i) => (
                <Fragment key={project.headline}>
                    {i !== 0 && <hr className="container projects__divider" />}
                    <Project nth={i + 1} {...project} />
                </Fragment>
            ))}
        </div>
    </section>
)
