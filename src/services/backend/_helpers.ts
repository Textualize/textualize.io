import { join } from "node:path"

export const projectRootPath =
    process.env["PROJECT_ROOT_PATH"] || join(new URL(import.meta.url).pathname, "..", "..", "..", "..")
