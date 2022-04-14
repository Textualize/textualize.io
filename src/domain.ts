export type ProjectUrl = string

export interface ProjectData {
    id: ProjectId
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

export type ProjectId = "textual" | "rich" | "rich-cli"

export type Category = string

export interface ImageProperties {
    url: string
    width: number
    height: number
}

export interface ProjectGalleryItem {
    projectId: ProjectId
    id: string
    title: string
    image: ImageProperties | null
    stars: string | null
    websiteUrl: string | null
    codeUrl: string | null
    docsUrl: string | null
    categories: Category[]
    description: string
}
