import MarkdownIt from "markdown-it"

const markdownParser = new MarkdownIt()

export function renderMarkdown(source: string): string {
    return markdownParser.render(source)
}
