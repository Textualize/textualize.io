import { promises as fs } from "node:fs"
import { basename, join } from "node:path"
import fastGlob from "fast-glob"
import matter from "gray-matter"
import type { TeamMember } from "../../domain"
import { renderMarkdown } from "../../helpers/markdown-helpers"
import * as cacheSharedServices from "../shared/cache"
import { projectRootPath } from "./_helpers"

const dataFolderBasePath = join(projectRootPath, "data", "about-us")

export interface TeamMembersDiscoveryOptions {
    dataFolderPath?: string
    verbose?: boolean
}

export async function teamMembers(options: TeamMembersDiscoveryOptions = {}): Promise<TeamMember[]> {
    const cacheKey = "team-members"
    const cachedValue = await cacheSharedServices.get(cacheKey)
    if (cachedValue) {
        return cachedValue
    }

    const folderPath = options.dataFolderPath || dataFolderBasePath
    options.verbose && console.debug(`Traversing team members folder "${folderPath}"...`)

    const teamMembersFiles = await fastGlob("*.mdx", { cwd: folderPath, absolute: true })
    const teamMembers = await Promise.all(teamMembersFiles.map((filePath) => teamMemberFromMarkdownFilePath(filePath)))

    options.verbose && console.debug(`Found ${teamMembers.length} team members.`)

    await cacheSharedServices.set(cacheKey, teamMembers)

    return teamMembers
}

async function teamMemberFromMarkdownFilePath(filePath: string): Promise<TeamMember> {
    const memberId = basename(filePath, ".mdx")

    const fileContent = await fs.readFile(filePath)
    const { content, data } = matter(fileContent)

    const mainContentHtml = renderMarkdown(content)

    return {
        id: memberId,
        name: data.name,
        role: data.role,
        imageUrl: data.imageUrl,
        twitterHandle: data.twitterHandle,
        description: mainContentHtml,
    }
}
