import MarkdownIt from "markdown-it"
// @ts-ignore
import inlineTokensIterator from "markdown-it-for-inline"
import type Token from "markdown-it/lib/token"

const markdownParser = new MarkdownIt()
const markdownParserWithDangerouslyKeptHtmlParser = new MarkdownIt({ html: true })

for (const parser of [markdownParser, markdownParserWithDangerouslyKeptHtmlParser]) {
    // Quick addition of an inline rule that adds `target="_blank"` to our links:
    // @link https://github.com/markdown-it/markdown-it-for-inline#use
    parser.use(inlineTokensIterator, "url_new_win", "link_open", function (tokens: Token[], idx: number) {
        tokens[idx].attrPush(["target", "_blank"])
        tokens[idx].attrPush(["rel", "noreferrer"])
    })
}

export function renderMarkdown(source: string): string {
    return markdownParser.render(source)
}

export function renderMarkdownWithDangerouslyKeptHtml(source: string): string {
    return markdownParserWithDangerouslyKeptHtmlParser.render(source)
}
