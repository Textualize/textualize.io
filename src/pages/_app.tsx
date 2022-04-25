import React from "react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import { Layout } from "../components/layout/layout"
import { initAnalytics } from "../services/frontend/analytics"
import * as themeServices from "../services/shared/theme"
import "../style/index.scss"

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()

    React.useEffect(
        () => {
            themeServices.initTheme()
        },
        [] // trigger only once, when the component is initialised
    )
    React.useEffect(() => {
        const destructor = initAnalytics(router)
        return destructor
    }, [router])

    return (
        <>
            <Head>
                <title>Textualize</title>
                <meta name="description" content="Because Terminals are here to stay" />
            </Head>

            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}
