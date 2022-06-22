import React from "react"
import Link from "next/link"
import { BlogPost } from "../../../domain"
import * as blogSharedServices from "../../../services/shared/blog"
import { blogPageUrl } from "../../../services/shared/blog"

interface BlogItemProps {
    post: BlogPost
    displayTitle: boolean
    onlyExcerpt?: boolean
}

export const BlogItem = (props: BlogItemProps): JSX.Element => {
    const hasExcerpt = Boolean(props.post.excerpt)
    const content = props.onlyExcerpt
        ? hasExcerpt
            ? // We fall back to displaying the full content if no excerpt was defined
              // for this blog post:
              props.post.excerpt
            : props.post.content
        : props.post.content
    const postUrl = blogSharedServices.blogPostPageUrl(props.post)

    return (
        <article className="container blog-item" id={`blog-post-${props.post.slug}`}>
            {props.displayTitle ? (
                <h3 className="blog-item__title">
                    <Link href={postUrl}>
                        <a>{props.post.title}</a>
                    </Link>
                </h3>
            ) : null}
            {props.onlyExcerpt ? null : (
                <p className="breadcrumb">
                    ❰{" "}
                    <Link href={blogPageUrl()}>
                        <a>Back to blog index</a>
                    </Link>
                </p>
            )}
            <p className="blog-item__date">🗓 Posted on {formatDate(new Date(props.post.date))}</p>
            {hasExcerpt && props.post.readingTime > 1 ? (
                <div className="blog-item__reading_time">
                    🕰 Reading time: {Math.round(props.post.readingTime)} minutes{" "}
                </div>
            ) : null}
            <div className="blog-item__content" dangerouslySetInnerHTML={{ __html: content }} />
            {props.onlyExcerpt && hasExcerpt ? (
                <Link href={postUrl}>
                    <a>Read more</a>
                </Link>
            ) : null}
        </article>
    )
}

function formatDate(date: Date): string {
    const thisYear = new Date().getFullYear() === date.getFullYear()
    if (!thisYear) {
        return date.toLocaleDateString("short")
    }
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}
