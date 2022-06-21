import React from "react"
import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next/types"
import { BlogItem } from "../../../components/page-specific/blog/blog-item"
import type { BlogPost } from "../../../domain"
import * as blogBackendServices from "../../../services/backend/blog"
import * as blogNextBridgeServices from "../../../services/nextjs-bridge/blog"

interface BlogItemPageProps {
    post: BlogPost
}

export default function BlogItemPage(props: BlogItemPageProps): JSX.Element {
    return (
        <section className="blog-item-container page__content_container">
            <div className="page__headline__bg" />
            <div className="container">
                <h2 className="page__headline">{props.post.title}</h2>
            </div>

            <div className="container">
                <BlogItem post={props.post} displayTitle={false} />
            </div>
        </section>
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

    console.debug("Blog paths params=", pathsParams)

    return {
        paths: pathsParams.map((params) => {
            // N.B. Creating new params this way makes TypeScript happy,
            // as the params implement the ParsedUrlQuery interface this way :-)
            return { params: { ...params } }
        }),
        fallback: "blocking",
    }
}
