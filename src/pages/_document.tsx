import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
    // Just to add `lang="en"`...
    // @link https://nextjs.org/docs/advanced-features/custom-document
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
