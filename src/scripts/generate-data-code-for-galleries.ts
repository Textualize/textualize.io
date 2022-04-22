/**
 * Run me with:
 *   $ npm run scripts:transpile && npm run scripts:generate-data-code-for-galleries
 */
import { writeFile } from "node:fs/promises"
import { join } from "node:path"
// We import this to be able to use our GitHub service (which relies on Next.js poyfill of `fetch()`)
// in a non-Next.js context, at build time.
// Note that this path could of course be broken by future Next.js releases - in which case we'll
// take the time to manage that polyfilling in a cleaner way :-)
import "next/dist/server/node-polyfill-fetch"
import { PROJECT_IDS } from "../constants"
import type { ProjectGalleryItem, ProjectId } from "../domain"
import * as githubBackendServices from "../services/backend/github"
import * as galleryProjectsBackendServices from "../services/backend/projects-galleries"
import { PROJECT_ROOT_PATH } from "./_helpers"

const dataFolderBasePath = join(PROJECT_ROOT_PATH, "data", "projects-galleries")
const imagesFolderBasePath = join(PROJECT_ROOT_PATH, "public", "projects-galleries")
const codegenTargetFolderBasePath = join(PROJECT_ROOT_PATH, "src", "codegen", "data", "project-galleries")

const CODE_GEN_MODULE_TEMPLATE = `
// /!\\ This module was generated, don't edit it!
// See "src/scripts/generate-data-code-for-galleries.ts" to learn more.

import { ProjectGalleryItem } from "../../../domain"

export const gallery: ProjectGalleryItem[] = {GALLERY_DATA}
`

async function generateCodeForAllProjectGalleries() {
    console.info("Code generation starts...")

    // We generate projects' galleries data one by one rather than with parallel Promises,
    // in order to avoid sending too many queries in parallel to the GitHub API:
    for (const projectId of PROJECT_IDS) {
        console.debug(`\nStarting code generation for gallery items data of project "${projectId}"...`)
        await generateCodeForProjectGallery(projectId)
        console.debug(`Code generation for project "${projectId}" done.\n`)
    }

    console.info("Code generation done.")
}

async function generateCodeForProjectGallery(projectId: ProjectId): Promise<void> {
    const galleryDiscoveryOptions: galleryProjectsBackendServices.ProjectGalleryDiscoveryOptions = {
        dataFolderPath: dataFolderBasePath,
        imagesFolderPath: imagesFolderBasePath,
    }

    const galleryItems = await galleryProjectsBackendServices.projectGallery(projectId, galleryDiscoveryOptions)
    console.debug(`Fetching GitHub stars for the ${galleryItems.length} gallery items of project "${projectId}"...`)
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
