// One setting per line: makes it easy to replace a setting at deployment time with a `sed` command
// (note that we could also rely on `process.env` and env vars prefixed with `NEXT_PUBLIC_`)
export const AppConfig = {
    fathom: {
        trackingCode: process.env["NEXT_PUBLIC_FATHOM_TRACKING_CODE"] || "",
        includedDomains: (process.env["NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS"] || "").split(","),
    },
    subscribeUrl: "https://textualize.us5.list-manage.com/subscribe/post?u=54502e6fe10e01c3c186d5de1&amp;id=bb8c187ac0",
    hiringUrl: "https://blog.textualize.io/2022/03/06/were-hiring/",
    textualize: {
        urls: {
            twitter: "https://twitter.com/textualizeio",
            github: "https://github.com/Textualize",
            discourse: "https://community.textualize.io/",
        },
    },
}
