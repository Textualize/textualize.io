import React from "react"
import Link from "next/link"
import type { BlogPost } from "../domain"
import * as blogSharedServices from "../services/shared/blog"

interface BlogSummaryProps {
    lastBlogPost: BlogPost
}

export const BlogSummary = (props: BlogSummaryProps): JSX.Element => {
    const lastBlogPostUrl = blogSharedServices.blogPostPageUrl(props.lastBlogPost)

    return (
        <section className="container">
            <div className="blog-summary">
                <Link href={lastBlogPostUrl}>
                    <a>{props.lastBlogPost.title}</a>
                </Link>
            </div>
        </section>
    )
}
