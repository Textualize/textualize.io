import * as Humanize from "humanize-plus"

export function humanizeStargazersCount(starsCount: number): string {
    const humanizedRepr = Humanize.compactInteger(starsCount, 1)
    return humanizedRepr.replace(".0", "") // Returns "9k" for "9.0k"
}
