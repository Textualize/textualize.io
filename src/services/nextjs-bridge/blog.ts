import * as blogBackendServices from "../backend/blog"

export interface BlogPostStaticPathsParams {
    postSlug: string
}
export async function blogPostsStaticPathsParams(): Promise<BlogPostStaticPathsParams[]> {
    const blogPosts = await blogBackendServices.blogPosts()

    return blogPosts.map((blogPost) => {
        return { postSlug: blogPost.slug }
    })
}
