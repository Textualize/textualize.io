import { promises as fs } from "node:fs"
import { join } from "node:path"
import fastGlob from "fast-glob"
import matter from "gray-matter"
import { dump as dumpYaml } from "js-yaml"

const projectRootPath = join(new URL(import.meta.url).pathname, "..")
const dataFolderBasePath = join(projectRootPath, "data", "projects-galleries")
const PROJECT_IDS = ["textual"]

await run()

async function run() {
    for (const projectId of PROJECT_IDS) {
        const folderPath = join(dataFolderBasePath, projectId)
        const projectsFiles = await fastGlob("*.mdx", { cwd: folderPath, absolute: true })
        await Promise.all(projectsFiles.map((filePath) => galleryProjectFromMarkdownFilePath(projectId, filePath)))
    }
}

async function galleryProjectFromMarkdownFilePath(projectId, filePath) {
    const fileContent = await fs.readFile(filePath)
    const { content, data } = matter(fileContent)

    const newYamlData = {
        ...data,
        description: content,
    }

    // console.log(dumpYaml(newYamlData))
    const newYamlDataAsString = dumpYaml(newYamlData, { lineWidth: -1 })

    const newFilePath = filePath.replace(/\.mdx$/, ".md")
    const newFileContent = `---
${newYamlDataAsString}
---

`
    await fs.writeFile(newFilePath, newFileContent)
}
