import MarkdownIt from "markdown-it"

const markdownParser = new MarkdownIt()
const markdownParserWithDangerouslyKeptHtmlParser = new MarkdownIt({ html: true })

export function renderMarkdown(source: string): string {
    return markdownParser.render(source)
}

export function renderMarkdownWithDangerouslyKeptHtml(source: string): string {
    return markdownParserWithDangerouslyKeptHtmlParser.render(source)
}
