import { join } from "node:path"

// This goes one level too high in the folders tree, compared to the location of this file.
// However, when we compile to JavaScript code in order to run our scripts with vanilla Node.js
// (simpler setup than using `ts-node`) there will be one more level to traverse, since we
// compile our TypeScript code into a "scripts-output/" folder that contains the "src/" one.
// --> This value is therefore adjusted for the context in which this code will run
export const PROJECT_ROOT_PATH = join(new URL(import.meta.url).pathname, "..", "..", "..", "..")
