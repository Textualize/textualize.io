import { AppConfig } from "../config"
import { isFrontendSideRendering } from "./runtime-helpers"

export function absoluteUrl(relativeUrl: string, opts: { absoluteUrl?: string } = {}): string {
    // /!\ Note that this function might return the relative URL unchanged,
    // if it's not able to determine the absolute URL from the runtime context.
    let absoluteUrl: string = ""

    if (opts?.absoluteUrl) {
        absoluteUrl = opts.absoluteUrl
    } else {
        const absoluteUrlFromConfig = AppConfig.absoluteUrl
        if (absoluteUrlFromConfig) {
            absoluteUrl = absoluteUrlFromConfig
        } else if (isFrontendSideRendering() && window.location?.origin) {
            absoluteUrl = window.location.origin
        }
    }

    // Make sure the absolute URL doesn't end with a slash:
    if (absoluteUrl && absoluteUrl.endsWith("/")) {
        absoluteUrl = absoluteUrl.substring(0, absoluteUrl.length - 1)
    }
    // ...And also make sure the relative one _starts_ with one:
    if (!relativeUrl) {
        relativeUrl = "/"
    } else if (relativeUrl.charAt(0) !== "/") {
        relativeUrl = "/" + relativeUrl
    }

    return absoluteUrl + relativeUrl
}
