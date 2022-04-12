export type ProjectUrl = string

export interface ProjectData {
    headline: string
    stars: string
    desc: string

    codeUrl: ProjectUrl
    codeRepoId: RepoId
    docsUrl: string | null
}

export interface RepoId {
    // N.B. We follow GitHub's own conventions there:
    // @link https://docs.github.com/en/rest/reference/repos#get-a-repository
    owner: string
    repo: string
}
