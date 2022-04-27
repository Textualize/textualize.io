import type { ProjectData } from "../domain"

type ProjectRelatedPlaceholderHandler = (_target: string, _projectsData: ProjectData[]) => string

const projectRelatedPlaceholderHandlers: ProjectRelatedPlaceholderHandler[] = [
    (target: string, projectsData: ProjectData[]): string => {
        for (const project of projectsData) {
            // N.B. We should use `replaceAll()` and manage a polyfill for it, but for the moment
            // we don't need that so let's keep it simple and only replace the 1st occurrence of each placeholder:-)
            target = target.replace(`[PROJECT_VIDEO_URL:${project.id}]`, project.videoUrl)
        }
        return target
    },
]

export function replaceProjectsRelatedPlaceholders(target: string, projectsData: ProjectData[]): string {
    for (const handler of projectRelatedPlaceholderHandlers) {
        target = handler(target, projectsData)
    }
    return target
}
