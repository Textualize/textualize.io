import React from "react"
import type { ProjectData } from "../domain"
import { Project } from "./project"

interface ProjectsIndexProps {
    projectsData: ProjectData[]
}

export const ProjectsIndex = (props: ProjectsIndexProps): JSX.Element => {
    React.useEffect(
        () => {
            const observers = initProjectBackgroundsIntersectionObservers()
            return function disconnectObservers() {
                observers.forEach((obs) => obs.disconnect())
            }
        },
        [] // only on mount
    )

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

function initProjectBackgroundsIntersectionObservers(): IntersectionObserver[] {
    const observers: IntersectionObserver[] = []

    document.querySelectorAll(".project__editor-back-layout-wrapper").forEach(function (el) {
        const projectObserver = new window.IntersectionObserver(
            function (entries) {
                entries.forEach(function (item) {
                    if (item.isIntersecting) {
                        el.classList.add("project__terminal-back-layout-wrapper--visible")
                    }
                })
            },
            {
                rootMargin: "0px",
                threshold: 1.0,
            }
        )
        projectObserver.observe(el)
        observers.push(projectObserver)
    })

    return observers
}
