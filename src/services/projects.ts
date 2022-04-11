import * as TOML from "@iarna/toml"
import { readFile } from "fs/promises"
import { join } from "path"
import type { ProjectData } from "../domain"

interface ProjectDataFromToml {
    headline: string
    stars: string
    desc: string
    code?: string
    docs?: string
}

export async function projects(): Promise<ProjectData[]> {
    const projectsData = await projectsRawData()

    return projectsData.map((rawData) => {
        return {
            headline: rawData.headline,
            stars: rawData.stars,
            desc: rawData.desc,
            codeUrl: rawData.code ?? null,
            docsUrl: rawData.docs ?? null,
        }
    })
}

export async function projectsDataFileContent(): Promise<string> {
    const fileUrl = join(new URL(import.meta.url).pathname, "..", "..", "..", "data", "projects.toml")

    return await readFile(fileUrl.toString(), { encoding: "utf-8" })
}

export async function projectsRawData(): Promise<ProjectDataFromToml[]> {
    const tomlContent = await projectsDataFileContent()
    const tomlData = TOML.parse(tomlContent)

    return (tomlData as unknown)["projects"] as ProjectDataFromToml[]
}
