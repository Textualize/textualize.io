import type { GetStaticPropsContext } from "next/types"
import type { ProjectData } from "../../domain"
import * as githubBackendServices from "../backend/github"
import * as projectsBackendServices from "../backend/projects"

interface CommonStaticProps {
    projectsData: ProjectData[]
}

export async function getCommonStaticProps(_context: GetStaticPropsContext): Promise<{ props: CommonStaticProps }> {
    const projectsData = await projectsBackendServices.projects()
    await githubBackendServices.attachCurrentStarsCountsToRepositories(projectsData)

    return {
        props: { projectsData },
    }
}
