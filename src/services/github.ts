const REPO_URL_REGEX = /^https:\/\/github.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)$/
const REPO_URL_PATTERN = "https://github.com/{owner}/{repo}"
const GET_REPO_API_URL_PATTERN = "https://api.github.com/repos/{owner}/{repo}"

export interface RepoData {
    // N.B. We follow GitHub's own conventions there:
    // @link https://docs.github.com/en/rest/reference/repos#get-a-repository
    owner: string
    repo: string
}

export interface GitHubRepoStatistics {
    repo: RepoData
    starsCount: number
}

const gitHubApiHeaders = new Headers({
    Accept: "application/vnd.github.v3+json",
})

export async function repoStatistics(repo: RepoData): Promise<GitHubRepoStatistics> {
    const targetEndpointUrl = repoDataApiEndpointUrl(repo)
    console.debug("Fetching GitHub repo stats for repo ", repo, "...")
    const resp = await fetch(targetEndpointUrl, {
        headers: gitHubApiHeaders,
    })
    const respData = await resp.json()

    const stargazersCount = respData["stargazers_count"]
    console.debug("Stargazers count for repo ", repo, ": ", stargazersCount)

    return {
        repo,
        starsCount: stargazersCount,
    }
}

export function repoFromUrl(repoUrl: string): RepoData {
    const regexMatch = REPO_URL_REGEX.exec(repoUrl)
    return { owner: regexMatch.groups["owner"], repo: regexMatch.groups["repo"] }
}

export function repoUrl(repo: RepoData): string {
    return REPO_URL_PATTERN.replaceAll("{owner}", repo.owner).replaceAll("{repo}", repo.repo)
}

export function repoDataApiEndpointUrl(repo: RepoData): string {
    return GET_REPO_API_URL_PATTERN.replaceAll("{owner}", repo.owner).replaceAll("{repo}", repo.repo)
}
