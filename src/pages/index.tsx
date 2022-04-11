import type { GetStaticProps } from "next"
import React from "react"
import { Footer } from "../components/footer"
import { Hero } from "../components/hero"
import { Icons } from "../components/icons"
import { MailList } from "../components/mail-list"
import { Nav } from "../components/nav"
import { Projects } from "../components/projects"
import { ProjectData } from "../domain"
import { humanizeStargazersCount } from "../helpers/conversion-helpers"
import * as githubServices from "../services/github"
import { RepoData } from "../services/github"
import * as projectServices from "../services/projects"

interface HomeProps {
    projectsData: ProjectData[]
}
export default function Home(props: HomeProps) {
    return (
        <>
            <Icons />
            <Nav />
            <main>
                <Hero />
                <MailList />
                <Projects projectsData={props.projectsData} />
            </main>
            <Footer />
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    // N.B. This is only executed server-side, thanks to the magic of Next.js 👌
    // @link https://nextjs.org/docs/api-reference/data-fetching/get-static-props
    const projects = await projectsWithCurrentStarsCounts()

    return {
        props: { projectsData: projects },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every hour
        revalidate: 3_600, // In seconds
    }
}

const projectsWithCurrentStarsCounts = async (): Promise<ProjectData[]> => {
    const projectsFromToml = await projectServices.projects()

    // Each promise fetches the GitHub stats for a single repo...
    const repositoriesStatsPromises = projectsFromToml.map((projectData) => {
        const repoData = githubServices.repoFromUrl(projectData.codeUrl)
        return githubServices.repoStatistics(repoData)
    })
    // ...But we launch them in parallel:
    const repositoriesStats = await Promise.all(repositoriesStatsPromises)

    // Now we just have to replace the "stars" from the TOML with the ones we got from the GitHub API
    // TODO: handle API errors, and just use the stars count from the TOML as a fallback in such cases
    return projectsFromToml.map((projectData) => {
        const repoData = githubServices.repoFromUrl(projectData.codeUrl)
        const githubStats = githubStatsForRepo(repositoriesStats, repoData)
        const stars = humanizeStargazersCount(githubStats.starsCount)

        return {
            ...projectData,
            stars,
        }
    })
}

const githubStatsForRepo = (
    projectsStatistics: githubServices.GitHubRepoStatistics[],
    repo: RepoData
): githubServices.GitHubRepoStatistics | null => {
    for (const projectStats of projectsStatistics) {
        if (projectStats.repo.owner === repo.owner && projectStats.repo.repo === repo.repo) {
            return projectStats
        }
    }
    return null
}
