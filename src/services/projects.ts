import projectsData from "../../data/projects.json"
import type { ProjectData } from "../domain"
import * as githubServices from "./github"

export async function projects(): Promise<ProjectData[]> {
    return projectsData["projects"].map((rawData) => {
        return {
            headline: rawData.headline,
            stars: rawData.stars,
            desc: rawData.desc,
            codeUrl: rawData.code,
            codeRepoId: githubServices.repoIdFromUrl(rawData.code),
            docsUrl: rawData.docs ?? null,
        }
    })
}
