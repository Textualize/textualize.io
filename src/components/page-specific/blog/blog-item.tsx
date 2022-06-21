import React from "react"
import Link from "next/link"
import { BlogPost } from "../../../domain"
import * as blogSharedServices from "../../../services/shared/blog"

interface BlogItemProps {
    post: BlogPost
    displayTitle: boolean
}

export const BlogItem = ({ post, displayTitle }: BlogItemProps): JSX.Element => {
    return (
        <article className="container blog-item" id={`blog-post-${post.slug}`}>
            {displayTitle ? (
                <h3 className="blog-item__title">
                    <Link href={blogSharedServices.blogPostPageUrl(post)}>
                        <a>{post.title}</a>
                    </Link>
                </h3>
            ) : null}
            <p className="blog-item__date">{formatDate(new Date(post.date))}</p>
            <div className="blog-item__content" dangerouslySetInnerHTML={{ __html: post.content }} />
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
