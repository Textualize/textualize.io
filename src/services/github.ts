import { ProjectData, ProjectUrl, RepoId } from "../domain"
import { humanizeStargazersCount } from "../helpers/conversion-helpers"
import * as projectServices from "./projects"

const REPO_URL_REGEX = /^https:\/\/github.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)$/
const REPO_URL_PATTERN = "https://github.com/{owner}/{repo}"
const GET_REPO_API_URL_PATTERN = "https://api.github.com/repos/{owner}/{repo}"

export interface GitHubRepoStatistics {
    repoId: RepoId
    starsCount: number
}

const gitHubApiHeaders = new Headers({
    Accept: "application/vnd.github.v3+json",
})

export async function projectsWithCurrentStarsCounts(): Promise<ProjectData[]> {
    const projectsFromJson = await projectServices.projects()

    // Each promise fetches the GitHub stats for a single repo...
    const repositoriesStatsPromises = projectsFromJson.map((projectData) => {
        return repoStatistics(projectData.codeRepoId)
    })
    // ...But we launch them in parallel:
    const repositoriesStatsSettledPromises = await Promise.allSettled(repositoriesStatsPromises)

    // Now we just have to replace the "stars" from the JSON with the ones we got from the GitHub API
    // (but only for successfully fulfilled Promises)
    return projectsFromJson.map((projectData, index) => {
        let stars = projectData.stars // our fallback value, as stored in the JSON file

        const matchingRepositoriesStatsSettledPromise = repositoriesStatsSettledPromises[index]
        switch (matchingRepositoriesStatsSettledPromise.status) {
            case "fulfilled":
                // Replace this value with the dynamically retrieved one:
                const repoStats = matchingRepositoriesStatsSettledPromise.value
                stars = humanizeStargazersCount(repoStats.starsCount)
                break
            case "rejected":
                console.error(
                    "Could not fetch GitHub repo stats for repo ",
                    projectData.codeRepoId,
                    ": ",
                    matchingRepositoriesStatsSettledPromise.reason,
                    ". Fall back to value from JSON: ",
                    stars
                )
                break
        }

        return {
            ...projectData,
            stars,
        }
    })
}

export async function repoStatistics(repoId: RepoId): Promise<GitHubRepoStatistics> {
    const targetEndpointUrl = repoDataApiEndpointUrl(repoId)
    console.debug("Fetching GitHub repo stats for repo ", repoId, "...")
    const resp = await fetch(targetEndpointUrl, {
        headers: gitHubApiHeaders,
    })
    if (resp.status !== 200) {
        throw new Error(
            `GitHub repo stats for repo "${repoId.owner}/${repoId.repo}" failed: status code=${resp.status}`
        )
    }

    const respData = await resp.json()
    const stargazersCount = respData["stargazers_count"]
    console.debug("Stargazers count for repo ", repoId, ": ", stargazersCount)

    return {
        repoId,
        starsCount: stargazersCount,
    }
}

export function repoIdFromUrl(repoUrl: string): RepoId {
    const regexMatch = REPO_URL_REGEX.exec(repoUrl)
    if (!regexMatch) {
        throw new Error(`Can't extract a repoId from repo URL "${repoUrl}"`)
    }
    // @ts-ignore
    const { owner, repo } = regexMatch.groups
    return { owner, repo }
}

export function repoUrl(repoId: RepoId): string {
    return REPO_URL_PATTERN.replace("{owner}", repoId.owner).replace("{repo}", repoId.repo)
}

export function repoDataApiEndpointUrl(repoId: RepoId): string {
    return GET_REPO_API_URL_PATTERN.replace("{owner}", repoId.owner).replace("{repo}", repoId.repo)
}
