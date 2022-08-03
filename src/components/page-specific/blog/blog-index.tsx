import React from "react"
import { BlogPost } from "../../../domain"
import { BlogItem } from "./blog-item"

interface BlogIndexProps {
    currentPagePosts: BlogPost[]
    currentPage: number // 1-based
    pagesCount: number
}

export const BlogIndex = (props: BlogIndexProps): JSX.Element => {
    return (
        <section className="blog-items page__content_container">
            <div className="page__headline__bg" />
            <div className="container">
                <h2 className="page__headline">Blog</h2>
            </div>

            <div className="container">
                <div className="blog-items__items">
                    {props.currentPagePosts.map((post, i) => (
                        <React.Fragment key={post.slug}>
                            {i !== 0 ? <hr className="container items__divider" /> : null}
                            <BlogItem post={post} displayTitle={true} onlyExcerpt={true} />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    )
}
