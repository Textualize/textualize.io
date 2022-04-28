import React from "react"
import { absoluteUrl } from "../../helpers/url-helpers"

// Shared content
const TITLE = `Textualize.io`
const DESCRIPTION = `The terminal can be more powerful and beautiful than you ever thought`
const IMAGE_URL = "/img/social-share-view.png"
const CANONICAL_SITE_URL = "https://www.textualize.io/"
// Twitter-specific stuff
const TWITTER_SITE = "@textualizeio"
// OpenGraph-specific stuff
const OPENGRAPH_TYPE = "website"

export function SocialMediaMetaTags(): JSX.Element {
    // Basically modeled after `view-source:https://github.com/Textualize/rich` ^_^
    const imageUrl = absoluteUrl(IMAGE_URL, { absoluteUrl: CANONICAL_SITE_URL })

    return (
        <>
            {/* Let's start with Twitter-specific tags...*/}
            {/* @link https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup */}
            <meta name="twitter:image:src" content={imageUrl} />
            <meta name="twitter:site" content={TWITTER_SITE} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={TITLE} />
            <meta name="twitter:description" content={DESCRIPTION} />
            {/* And now for the OpenGraph tags...*/}
            {/* @link https://ogp.me/ */}
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:alt" content={DESCRIPTION} />
            <meta property="og:type" content={OPENGRAPH_TYPE} />
            <meta property="og:title" content={TITLE} />
            <meta property="og:url" content={CANONICAL_SITE_URL} />
            <meta property="og:description" content={DESCRIPTION} />
        </>
    )
}
