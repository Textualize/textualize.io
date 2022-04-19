import React from "react"
import Link from "next/link"
import { AppConfig } from "../config"
import { trackEvent } from "../services/frontend/analytics"
import { Terminal } from "./terminal"

interface HeroProps {
    videoUrl: string
}

export const Hero = (props: HeroProps): JSX.Element => {
    const ReadMoreLink = (
        <Link href="/what-we-do">
            <a
                onClick={(_e) => {
                    trackEvent("what-we-do")
                }}
            >
                Read more...
            </a>
        </Link>
    )

    return (
        <section className="container hero">
            <div className="hero__text">
                <h1 className="hero__headline">
                    <span className="u-no-wrap">
                        We love terminals
                        <span className="hero__cursor" />
                    </span>
                </h1>
                <p className="hero__desc">
                    The terminal can be more <strong>powerful</strong> and <strong>beautiful</strong> than you ever
                    thought. {ReadMoreLink}
                </p>
                <a
                    href={AppConfig.textualize.urls.discourse}
                    className="button button--hero"
                    target="_blank"
                    rel="noreferrer"
                >
                    Join the Community
                </a>
            </div>
            <div className="hero__terminal-wrapper">
                <div className="hero__terminal-animation">
                    <div className="hero__terminal">
                        <div className="hero__terminal-back-layout" />
                        <Terminal videoUrl={props.videoUrl} tabName="Screen-recording of a terminal (no editing)" />
                    </div>
                </div>
            </div>
        </section>
    )
}
