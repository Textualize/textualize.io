import type { ProjectData } from "../domain"

type ProjectRelatedPlaceholderHandler = (_target: string, _projectsData: ProjectData[]) => string

const PROJECT_RELATED_PLACEHOLDER_HANDLERS: ProjectRelatedPlaceholderHandler[] = [
    (target: string, projectsData: ProjectData[]): string => {
        // Manages "[PROJECT_VIDEO_URL:<projectId>]" placeholders:
        return target.replace(/\[PROJECT_VIDEO_URL:(?<projectId>\w+)\]/g, (match, projectId) => {
            const projectData = projectsData.find((project) => project.id === projectId)
            if (!projectData) {
                throw new Error(`Project with ID ${projectId} not found`)
            }
            return projectData.videoUrl
        })
    },
]

export function replaceProjectsRelatedPlaceholders(target: string, projectsData: ProjectData[]): string {
    for (const handler of PROJECT_RELATED_PLACEHOLDER_HANDLERS) {
        target = handler(target, projectsData)
    }
    return target
}
