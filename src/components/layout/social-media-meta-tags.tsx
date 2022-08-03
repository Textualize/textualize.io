import React from "react"
import { absoluteUrl } from "../../helpers/url-helpers"
import * as metadata from "../../metadata"

// OpenGraph-specific stuff
const OPENGRAPH_TYPE = "website"

export function SocialMediaMetaTags(): JSX.Element {
    // Basically modeled after `view-source:https://github.com/Textualize/rich` ^_^
    const imageUrl = absoluteUrl(metadata.IMAGE_URL)

    return (
        <>
            {/* Let's start with Twitter-specific tags...*/}
            {/* @link https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup */}
            <meta name="twitter:image:src" content={imageUrl} />
            <meta name="twitter:site" content={metadata.TWITTER_SITE} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metadata.TITLE} />
            <meta name="twitter:description" content={metadata.DESCRIPTION} />
            {/* And now for the OpenGraph tags...*/}
            {/* @link https://ogp.me/ */}
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:alt" content={metadata.DESCRIPTION} />
            <meta property="og:type" content={OPENGRAPH_TYPE} />
            <meta property="og:title" content={metadata.TITLE} />
            <meta property="og:url" content={metadata.CANONICAL_SITE_URL} />
            <meta property="og:description" content={metadata.DESCRIPTION} />
        </>
    )
}
