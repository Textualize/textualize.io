import React from "react"
import Head from "next/head"
import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next/types"
import ellipsize from "ellipsize"
import striptags from "striptags"
import { BlogItem } from "../../../components/page-specific/blog/blog-item"
import type { BlogPost } from "../../../domain"
import { absoluteUrl } from "../../../helpers/url-helpers"
import * as metadata from "../../../metadata"
import * as blogBackendServices from "../../../services/backend/blog"
import * as blogNextBridgeServices from "../../../services/nextjs-bridge/blog"
import * as blogSharedServices from "../../../services/shared/blog"

const DESCRIPTION_CONTENT_ELLIPSIS_LENGTH = 200

interface BlogItemPageProps {
    post: BlogPost
}

export default function BlogItemPage(props: BlogItemPageProps): JSX.Element {
    const post = props.post

    const hasExcerpt = Boolean(post.excerpt)

    // Metadata management is basically modeled after a `view-source:` on a Medium page ^_^
    const postUrl = blogSharedServices.blogPostPageUrl(props.post)
    const postUrlAbsolute = absoluteUrl(postUrl)
    const postTitle = post.title
    const postPublicationDate = new Date(post.date)
    const postPublicationDateISO = postPublicationDate.toISOString()
    const pageTitle = metadata.BLOG_POST_PAGE_TITLE_PATTERN.replace("[POST_TITLE]", postTitle)
    const readingTime = Math.round(post.readingTime)
    const description = ellipsize(
        striptags(hasExcerpt ? post.excerpt : post.content).replace(/\n/g, " "),
        DESCRIPTION_CONTENT_ELLIPSIS_LENGTH,
        {
            ellipse: "…",
        }
    )

    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "url": postUrlAbsolute,
        "dateCreated": postPublicationDateISO,
        "datePublished": postPublicationDateISO,
        "dateModified": post.lastModifiedDate ? new Date(post.lastModifiedDate).toISOString() : postPublicationDateISO,
        "headline": postTitle,
        "name": postTitle,
        "description": description,
        "identifier": post.slug,
        "author": { "@type": "Person", "name": post.author },
        "creator": [post.author],
        "publisher": {
            "@type": "Organization",
            "name": "Textualize",
            "url": metadata.CANONICAL_SITE_URL,
            "logo": {
                "@type": "ImageObject",
                "url": absoluteUrl(metadata.LOGO_URL),
            },
        },
        "mainEntityOfPage": postUrlAbsolute,
        "isAccessibleForFree": "True",
    }

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <link rel="canonical" href={postUrlAbsolute} />
                <meta property="article:published_time" content={postPublicationDateISO} />
                <meta name="title" content={pageTitle} />
                <meta name="description" content={description} />
                <meta property="twitter:description" content={pageTitle} />
                <meta property="twitter:title" content={pageTitle} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageTitle} />
                <meta name="twitter:label1" content="Reading time" />
                <meta name="twitter:data1" content={`${readingTime} min read`} />
                <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
            </Head>
            <section className="blog-item-container page__content_container">
                <div className="page__headline__bg" />
                <div className="container">
                    <h2 className="page__headline">{props.post.title}</h2>
                </div>

                <div className="container">
                    <BlogItem post={props.post} displayTitle={false} />
                </div>
            </section>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context): Promise<GetStaticPropsResult<BlogItemPageProps>> => {
    if (!context.params || !context.params.postSlug || typeof context.params.postSlug !== "string") {
        return { notFound: true }
    }

    const postSlug = context.params.postSlug
    const post = await blogBackendServices.blogPostFromSlug(postSlug)
    if (!post) {
        return { notFound: true }
    }

    return {
        props: {
            post,
        },
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    // @link https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
    const pathsParams = await blogNextBridgeServices.blogPostsStaticPathsParams()

    return {
        paths: pathsParams.map((params) => {
            // N.B. Creating new params this way makes TypeScript happy,
            // as the params implement the ParsedUrlQuery interface this way :-)
            return { params: { ...params } }
        }),
        fallback: "blocking",
    }
}
