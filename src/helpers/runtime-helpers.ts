export function isServerSideRendering(): boolean {
    return typeof window !== "object"
}

export function isFrontendSideRendering(): boolean {
    return !isServerSideRendering()
}
