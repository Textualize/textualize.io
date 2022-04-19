import type { NextRouter } from "next/router"
import * as Fathom from "fathom-client"
import { AppConfig } from "../../config"
import { isServerSideRendering } from "../shared/rendering-context"

// This type is defined in the `@types/react` package, but not exported, so we have to duplicate it here: 😔
type UseEffectDestructor = () => void

const noOpDestructor = (): void => {}

let analyticsEnabled: boolean = false

export function initAnalytics(router: NextRouter): UseEffectDestructor {
    if (isServerSideRendering()) {
        return noOpDestructor // shouldn't happen, but just in case...
    }

    // @link https://vercel.com/guides/deploying-nextjs-using-fathom-analytics-with-vercel
    const { trackingCode, includedDomains } = AppConfig.fathom

    if (!trackingCode || !includedDomains) {
        console.info("Fathom is not configured, analytics are disabled.")
        return noOpDestructor
    }

    analyticsEnabled = true

    Fathom.load(trackingCode, {
        includedDomains: includedDomains,
    })

    function onRouteChangeComplete() {
        Fathom.trackPageview()
    }

    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete)

    const destructor = (): void => {
        router.events.off("routeChangeComplete", onRouteChangeComplete)
    }

    return destructor
}

export function trackEvent(code: string): void {
    if (isServerSideRendering()) {
        return // shouldn't happen, but just in case...
    }
    if (!analyticsEnabled) {
        return
    }

    Fathom.trackGoal(code, 0)
}
