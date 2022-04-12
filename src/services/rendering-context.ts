export function isServerSideRendering(): boolean {
    return typeof window !== "object"
}
