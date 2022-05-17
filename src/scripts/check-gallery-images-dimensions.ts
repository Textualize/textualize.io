/**
 * Run me with:
 *   $ npm run scripts:transpile && npm run scripts:check-gallery-images-dimensions
 */
import { basename, join } from "node:path"
import * as core from "@actions/core"
import { PROJECT_IDS } from "../constants"
import type { ProjectId } from "../domain"
import * as galleryProjectsBackendServices from "../services/backend/projects-galleries"
import { PROJECT_ROOT_PATH } from "./_helpers"

const dataFolderBasePath = join(PROJECT_ROOT_PATH, "data", "projects-galleries")
const imagesFolderBasePath = join(PROJECT_ROOT_PATH, "public", "projects-galleries")

const MAX_SIZE: ImageSize = { width: 800, height: 600 }

const IS_CI = Boolean(process.env["CI"] === "true")

interface ImageSize {
    width: number
    height: number
}
interface ImageTooLargeError {
    path: string
    size: ImageSize
}

async function checkGalleryImagesDimensions() {
    const results = await Promise.all(
        PROJECT_IDS.map((projectId) => {
            return checkGalleryImagesDimensionsForProject(projectId)
        })
    )
    let hasErrors: boolean = false
    for (const errors of results) {
        if (errors.length) {
            hasErrors = true
            for (const error of errors) {
                console.log(`Image "${basename(error.path)}" is too large (${error.size.width}x${error.size.height})`)
            }
        }
    }

    if (hasErrors) {
        if (IS_CI) {
            await reportErrorsToGitHubActionsSummary(results)
            core.setFailed(`Action failed because of too large image(s)`)
        } else {
            process.exit(1)
        }
    }
}

async function reportErrorsToGitHubActionsSummary(results: ImageTooLargeError[][]): Promise<void> {
    const dimensionDisplay = (dimension: number, maxValue: Number): string => {
        return `${dimension} ${dimension > maxValue ? ":x:" : ":heavy_check_mark:"}`
    }

    await core.summary
        .addHeading("Too large images detected")
        .addTable([
            [
                { data: "File", header: true },
                { data: "Width", header: true },
                { data: "Height", header: true },
            ],
            ...results
                .map((galleryErrors) => {
                    return galleryErrors.map((error) => {
                        return [
                            error.path,
                            dimensionDisplay(error.size.width, MAX_SIZE.width),
                            dimensionDisplay(error.size.height, MAX_SIZE.height),
                        ]
                    })
                })
                .flat(),
        ])
        .write()
}

async function checkGalleryImagesDimensionsForProject(projectId: ProjectId): Promise<ImageTooLargeError[]> {
    const galleryDiscoveryOptions: galleryProjectsBackendServices.ProjectGalleryDiscoveryOptions = {
        dataFolderPath: dataFolderBasePath,
        imagesFolderPath: imagesFolderBasePath,
    }
    const galleryItems = await galleryProjectsBackendServices.projectGallery(projectId, galleryDiscoveryOptions)
    const errors: ImageTooLargeError[] = []
    for (const item of galleryItems) {
        if (item.image) {
            if (item.image.width > MAX_SIZE.width || item.image.height > MAX_SIZE.height) {
                errors.push({ path: item.image.url, size: { width: item.image.width, height: item.image.height } })
            }
        }
    }

    return errors
}

checkGalleryImagesDimensions().then(null, (err) => console.error(err))
