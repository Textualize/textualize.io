import React from "react"
import { Head, Html, Main, NextScript } from "next/document"
import { SocialMediaMetaTags } from "../components/layout/social-media-meta-tags"

export default function Document() {
    // @link https://nextjs.org/docs/advanced-features/custom-document
    return (
        <Html lang="en">
            <Head>
                {/* @link https://nextjs.org/docs/basic-features/font-optimization */}
                <link href="https://fonts.googleapis.com/css2?family=Fira+Mono&amp;display=optional" rel="stylesheet" />
                <SocialMediaMetaTags />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
