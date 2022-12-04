import { AppConfig } from "./config"
import type { ProjectId } from "./domain"

export const PROJECT_IDS: readonly ProjectId[] = ["textual", "rich", "rich-cli"] as const

export const PROJECTS_WITH_GALLERY: ProjectId[] = ["textual", "rich"]

export const GALLERY_ITEMS_COUNT_PER_PAGE = 5

export const BLOG_ITEMS_COUNT_PER_PAGE = 5

interface SocialLink {
    url: string
    xlinkHref: string
    appearsInHeader: boolean
    appearsInFooter: boolean
}
export const SOCIAL_LINKS: { [name: string]: SocialLink } = {
    Twitter: {
        url: AppConfig.textualize.urls.twitter,
        xlinkHref: "#icon-twitter",
        appearsInHeader: true,
        appearsInFooter: true,
    },
    GitHub: {
        url: AppConfig.textualize.urls.github,
        xlinkHref: "#icon-github",
        appearsInHeader: true,
        appearsInFooter: true,
    },
    Blog: {
        url: "/blog", // self-hosted :-)
        xlinkHref: "#icon-blog",
        appearsInHeader: false,
        appearsInFooter: true,
    },
} as const
