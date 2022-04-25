import React from "react"
import type { ProjectData } from "../../../domain"
import { Project } from "./project-item"

interface ProjectsIndexProps {
    projectsData: ProjectData[]
}

export const ProjectsIndex = (props: ProjectsIndexProps): JSX.Element => {
    return (
        <section className="projects">
            <div className="projects__bg" />
            <div className="container">
                <h2 className="projects__headline">Projects</h2>
            </div>
            <div className="projects__items">
                {props.projectsData.map((project, i) => (
                    <React.Fragment key={project.id}>
                        {i !== 0 && <hr className="container projects__divider" />}
                        <Project nth={i + 1} project={project} />
                    </React.Fragment>
                ))}
            </div>
        </section>
    )
}
