export function formatBlogPostDate(date: Date): string {
    const isThisYear = new Date().getFullYear() === date.getFullYear()
    if (!isThisYear) {
        return date.toLocaleDateString("short")
    }
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}
