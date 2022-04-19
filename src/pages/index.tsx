import React from "react"
import type { GetStaticProps } from "next"
import { Hero } from "../components/hero"
import { MailList } from "../components/mail-list"
import { ProjectsIndex } from "../components/projects-index"
import type { ProjectData } from "../domain"
import * as githubBackendServices from "../services/backend/github"
import * as projectsBackendServices from "../services/backend/projects"

interface HomePageProps {
    projectsData: ProjectData[]
}

export default function HomePage(props: HomePageProps) {
    // At the moment the video we display in the "Hero" is the Textual one, but that may change in the future
    return (
        <>
            <Hero videoUrl={props.projectsData[0].videoUrl} />
            <MailList />
            <ProjectsIndex projectsData={props.projectsData} />
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    // N.B. This is only executed server-side, thanks to the magic of Next.js 👌
    // @link https://nextjs.org/docs/api-reference/data-fetching/get-static-props
    const projects = await projectsBackendServices.projects()
    await githubBackendServices.attachCurrentStarsCountsToRepositories(projects)

    return {
        props: { projectsData: projects },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every hour
        revalidate: 3_600, // In seconds
    }
}
