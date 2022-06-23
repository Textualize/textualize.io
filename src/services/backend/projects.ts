import projectsData from "../../../data/projects.json"
import type { ProjectData, ProjectId } from "../../domain"
import * as cacheSharedServices from "../shared/cache"
import * as githubBackendServices from "./github"

export async function projects(): Promise<ProjectData[]> {
    const cacheKey = "projects"
    const cachedValue = await cacheSharedServices.get(cacheKey)
    if (cachedValue) {
        return cachedValue
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

    await cacheSharedServices.set(cacheKey, projects)

    return projects
}

export async function projectById(id: ProjectId): Promise<ProjectData> {
    return (await projects()).find((project) => project.id === id)!
}
