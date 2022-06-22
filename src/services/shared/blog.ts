import type { BlogPost } from "../../domain"

export function blogPageUrl(): string {
    return "/blog"
}

export function blogPostPageUrl(post: BlogPost): string {
    const canonicalUrlSegments = ["blog", "posts", post.slug]
    return "/" + canonicalUrlSegments.join("/")
}
