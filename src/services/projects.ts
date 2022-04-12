import * as TOML from "@iarna/toml"
import { readFile } from "fs/promises"
import { join } from "path"
import type { ProjectData } from "../domain"
import * as githubServices from "./github"

interface ProjectDataFromToml {
    headline: string
    stars: string
    desc: string
    code: string
    docs?: string
}

const ProjectsDataFilePath = join(new URL(import.meta.url).pathname, "..", "..", "..", "data", "projects.toml")

export async function projects(): Promise<ProjectData[]> {
    const projects = await projectsRawData()

    return projects.map((rawData) => {
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

export async function projectsDataFileContent(): Promise<string> {
    return await readFile(ProjectsDataFilePath.toString(), { encoding: "utf-8" })
}

export async function projectsRawData(): Promise<ProjectDataFromToml[]> {
    const tomlContent = await projectsDataFileContent()
    const tomlData = TOML.parse(tomlContent)

    return (tomlData as any)["projects"] as ProjectDataFromToml[]
}
