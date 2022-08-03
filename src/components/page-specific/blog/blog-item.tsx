import React from "react"
import Link from "next/link"
import { BlogPost } from "../../../domain"
import { formatBlogPostDate } from "../../../helpers/date-helpers"
import * as blogSharedServices from "../../../services/shared/blog"
import { blogPageUrl } from "../../../services/shared/blog"

interface BlogItemProps {
    post: BlogPost
    displayTitle: boolean
    onlyExcerpt?: boolean
}

export const BlogItem = (props: BlogItemProps): JSX.Element => {
    const post = props.post

    const hasExcerpt = Boolean(post.excerpt)
    // We fall back to displaying the full content if no excerpt was defined for this blog post:
    const content = props.onlyExcerpt && hasExcerpt ? post.excerpt : post.content

    const postUrl = blogSharedServices.blogPostPageUrl(props.post)
    const postTitle = post.title
    const postPublicationDate = new Date(post.date)
    const readingTime = Math.round(post.readingTime)

    return (
        <>
            <article className="container blog-item" id={`blog-post-${post.slug}`}>
                {props.displayTitle ? (
                    <h3 className="blog-item__title">
                        <Link href={postUrl}>
                            <a>{postTitle}</a>
                        </Link>
                    </h3>
                ) : null}
                {props.onlyExcerpt ? null : (
                    <p className="breadcrumb">
                        ❰{" "}
                        <Link href={blogPageUrl()}>
                            <a>Blog index</a>
                        </Link>
                    </p>
                )}
                <p className="blog-item__date">🗓 Posted on {formatBlogPostDate(postPublicationDate)}</p>
                {hasExcerpt && post.readingTime > 1 ? (
                    <div className="blog-item__reading_time">🕰 Reading time: {readingTime} minutes</div>
                ) : null}
                <div className="blog-item__content" dangerouslySetInnerHTML={{ __html: content }} />
                {props.onlyExcerpt && hasExcerpt ? (
                    <Link href={postUrl}>
                        <a>Read more</a>
                    </Link>
                ) : null}
            </article>
        </>
    )
}
