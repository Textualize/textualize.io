import React from "react"
import type { GetStaticProps, GetStaticPropsResult } from "next/types"
import { BlogIndex } from "../../components/page-specific/blog/blog-index"
import { BLOG_ITEMS_COUNT_PER_PAGE } from "../../constants"
import type { BlogPost } from "../../domain"
import * as blogPostsBackendServices from "../../services/backend/blog"

interface BlogIndexPageProps {
    currentPagePosts: BlogPost[]
    currentPage: number // 1-based
    pagesCount: number
}

export default function BlogIndexPage(props: BlogIndexPageProps): JSX.Element {
    // TODO handle pagination, via a `?page=X` querystring
    return <BlogIndex {...props} />
}

export const getStaticProps: GetStaticProps = async (_context): Promise<GetStaticPropsResult<BlogIndexPageProps>> => {
    const blogPosts = await blogPostsBackendServices.blogPosts()
    const pagesCount = Math.ceil(blogPosts.length / BLOG_ITEMS_COUNT_PER_PAGE)
    return {
        props: {
            currentPagePosts: blogPosts, //TODO: handle pagination
            currentPage: 1,
            pagesCount,
        },
    }
}
