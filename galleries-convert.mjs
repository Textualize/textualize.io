import { promises as fs } from "node:fs"
import {promisify} from "node:util"
import {exec} from "node:child_process"
import { join } from "node:path"
import fastGlob from "fast-glob"
import matter from "gray-matter"
import { dump as dumpYaml } from "js-yaml"

const execAsync = promisify(exec)

const projectRootPath = join(new URL(import.meta.url).pathname, "..")
const dataFolderBasePath = join(projectRootPath, "data", "projects-galleries")
const PROJECT_IDS = ["textual", "rich"]

await run()

async function run() {
    for (const projectId of PROJECT_IDS) {
        const folderPath = join(dataFolderBasePath, projectId)
        const projectsFiles = await fastGlob("*.mdx", { cwd: folderPath, absolute: true })
        await Promise.all(projectsFiles.map((filePath) => convertGalleryProjectMarkdownFile(projectId, filePath)))
    }
}

async function convertGalleryProjectMarkdownFile(projectId, filePath) {
    const fileContent = await fs.readFile(filePath)
    
    const newFilePath = filePath.replace(/\.mdx$/, ".md")
    
    await execAsync(`git mv "${filePath}" "${newFilePath}"`)
    
    const { content, data } = matter(fileContent)
    const newYamlData = {
        ...data,
        description: content,
    }
    const newYamlDataAsString = dumpYaml(newYamlData, { lineWidth: -1 })

    const newFileContent = `---
${newYamlDataAsString}
---

`
    await fs.writeFile(newFilePath, newFileContent)
}
