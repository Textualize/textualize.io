import React, { Fragment } from "react"
import { Project } from "./project"

const projects = [
    {
        headline: "Rich",
        stars: "35.5k",
        desc: "A Python framework for rich text and beautiful formatting in the terminal",
        tabName: "Rich",
    },
    {
        headline: "Textual",
        stars: "8.5k",
        desc: "Build amazing TUIs (Text User Interfaces) with this innovative Python framework",
        tabName: "Textual",
    },
    {
        headline: "Rich CLI",
        stars: "1.3k",
        desc: "Syntax highlighting, markdown, JSON, and more, at the command prompt.",
        tabName: "Rich CLI",
    },
]

export const Projects = () => (
    <section className="projects">
        <div className="projects__bg"></div>
        <div className="container">
            <h2 className="projects__headline">Projects</h2>
        </div>
        <div className="projects__items">
            {projects.map((project, i) => (
                <Fragment key={i}>
                    {i !== 0 && <hr className="container projects__divider" />}
                    <Project nth={i + 1} {...project} />
                </Fragment>
            ))}
        </div>
    </section>
)
