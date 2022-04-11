import React, { Fragment } from "react"
import { ProjectData } from "../domain"
import { Project } from "./project"

interface ProjectsProps {
    projectsData: ProjectData[]
}

export const Projects = (props: ProjectsProps) => (
    <section className="projects">
        <div className="projects__bg" />
        <div className="container">
            <h2 className="projects__headline">Projects</h2>
        </div>
        <div className="projects__items">
            {props.projectsData.map((project, i) => (
                <Fragment key={project.headline}>
                    {i !== 0 && <hr className="container projects__divider" />}
                    <Project nth={i + 1} {...project} />
                </Fragment>
            ))}
        </div>
    </section>
)
