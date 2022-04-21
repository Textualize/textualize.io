/**
 * Run me with:
 *   $ npm run scripts:transpile && npm run scripts:check-gallery-images-dimensions
 */
import { writeFile } from "node:fs/promises"
import { basename, join } from "node:path"
import { PROJECT_IDS } from "../constants"
import type { ProjectGalleryItem, ProjectId } from "../domain"
import * as githubBackendServices from "../services/backend/github"
import * as galleryProjectsBackendServices from "../services/backend/projects-galleries"

const projectRootPath = join(new URL(import.meta.url).pathname, "..", "..", "..", "..")
const dataFolderBasePath = join(projectRootPath, "data", "projects-galleries")
const imagesFolderBasePath = join(projectRootPath, "public", "projects-galleries")
const codegenTargetFolderBasePath = join(projectRootPath, "src", "data")

const CODE_GEN_MODULE_TEMPLATE = `
// /!\\ This module was generated, don't edit it!
// See "src/scripts/generate-data-code-for-galleries.ts" to learn more.

import { ProjectGalleryItem } from "../domain"

const gallery: ProjectGalleryItem[] = {GALLERY_DATA}
export default gallery
`

async function generateCodeForAllProjectGalleries() {
    console.info("Code generation starts...")

    await Promise.all(
        PROJECT_IDS.map((projectId) => {
            return generateCodeForProjectGallery(projectId)
        })
    )

    console.info("Code generation done.")
}

async function generateCodeForProjectGallery(projectId: ProjectId): Promise<void> {
    const galleryDiscoveryOptions: galleryProjectsBackendServices.ProjectGalleryDiscoveryOptions = {
        dataFolderPath: dataFolderBasePath,
        imagesFolderPath: imagesFolderBasePath,
    }

    const galleryItems = await galleryProjectsBackendServices.projectGallery(projectId, galleryDiscoveryOptions)
    await githubBackendServices.attachCurrentStarsCountsToRepositories(galleryItems)

    await writeTypeScriptDataModule(projectId, galleryItems)
}

async function writeTypeScriptDataModule(projectId: ProjectId, galleryItems: ProjectGalleryItem[]): Promise<void> {
    const moduleContent = CODE_GEN_MODULE_TEMPLATE.replace("{GALLERY_DATA}", JSON.stringify(galleryItems, undefined, 4))
    const moduleFilePath = join(codegenTargetFolderBasePath, `${projectId}.ts`)
    console.debug(`Writing generated code in TypeScript module "${moduleFilePath}"...`)
    await writeFile(moduleFilePath, moduleContent)
}

generateCodeForAllProjectGalleries().then(null, (err) => console.error(err))
