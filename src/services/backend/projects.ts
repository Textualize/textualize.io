import projectsData from "../../../data/projects.json"
import type { ProjectData, ProjectId } from "../../domain"
import * as githubBackendServices from "./github"

let cache: ProjectData[] | null = null

export async function projects(): Promise<ProjectData[]> {
    if (cache) {
        return cache
    }

    const projects = projectsData["projects"].map((rawData) => {
        return {
            id: rawData.id as ProjectId,
            headline: rawData.headline,
            stars: rawData.stars,
            desc: rawData.desc,
            videoUrl: rawData.videoUrl,
            codeUrl: rawData.code,
            codeRepoId: githubBackendServices.repoIdFromUrl(rawData.code),
            docsUrl: rawData.docs ?? null,
        }
    })

    cache = projects

    return projects
}
