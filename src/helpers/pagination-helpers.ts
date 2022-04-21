export function pagesRange(pagesCount: number): number[] {
    // N.B. We use `i+1` here, as the first page is "1" rather than "0"
    return new Array(pagesCount).fill(true).map((_, i) => i + 1)
}
