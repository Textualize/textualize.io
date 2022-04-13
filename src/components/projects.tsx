import React, { Fragment } from "react"
import { ProjectData } from "../domain"
import { Project } from "./project"

interface ProjectsProps {
    projectsData: ProjectData[]
}

export const Projects = (props: ProjectsProps): JSX.Element => {
    React.useEffect(
        () => {
            const obervers = initProjectBackgroundsIntersectionObservers()
            return function disconnectObservers() {
                obervers.forEach((obs) => obs.disconnect())
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
                    <Fragment key={project.headline}>
                        {i !== 0 && <hr className="container projects__divider" />}
                        <Project nth={i + 1} {...project} />
                    </Fragment>
                ))}
            </div>
        </section>
    )
}

function initProjectBackgroundsIntersectionObservers(): IntersectionObserver[] {
    const observers: IntersectionObserver[] = []

    document.querySelectorAll(".project__editor-back-layout-wrapper").forEach(function (el) {
        const observerProjects = new window.IntersectionObserver(
            function (entries) {
                entries.forEach(function (item) {
                    if (item.isIntersecting) {
                        el.classList.add("project__editor-back-layout-wrapper--visible")
                    }
                })
            },
            {
                rootMargin: "0px",
                threshold: 1.0,
            }
        )
        observerProjects.observe(el)
        observers.push(observerProjects)
    })

    return observers
}
