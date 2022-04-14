import React from "react"
import type { AppProps } from "next/app"
import Head from "next/head"
import * as themeServices from "../services/shared/theme"
import "../style/index.scss"

/* eslint @next/next/no-page-custom-font: "off" */

function MyApp({ Component, pageProps }: AppProps) {
    React.useEffect(
        () => {
            themeServices.initTheme()
        },
        [] // trigger only once, when the component is initialised
    )

    return (
        <>
            <Head>
                <title>Textualize</title>
                <meta name="description" content="Because Terminals are here to stay" />
                <link rel="icon" href="/textualize-logo.svg" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Fira+Mono&amp;display=swap" rel="stylesheet" />
            </Head>

            <Component {...pageProps} />
        </>
    )
}

export default MyApp
