import { AppConfig } from "./config"

export const FILTER_URL_HASH_PREFIX = "#category-"

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
    Discourse: {
        url: AppConfig.textualize.urls.discourse,
        xlinkHref: "#icon-discourse",
        appearsInHeader: true,
        appearsInFooter: false,
    },
} as const
