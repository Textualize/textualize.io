import React from "react"
import { AppConfig } from "../config"
import { Editor } from "./editor"

export const Hero = () => {
    return (
        <section className="container hero">
            <div className="hero__text">
                <h1 className="hero__headline">                  
                    <span className="u-no-wrap">
                        We ♥ terminals
                        <span className="hero__cursor" />
                    </span>
                </h1>
                <p className="hero__desc">
                   The terminal can be more <strong>powerful</strong> and <strong>beautiful</strong> than you ever thought.
                   <br/><br/>
                    <a href="#">Read more...</a>
                </p>
                <a href={AppConfig.hiringUrl} className="button button--hero" target="_blank" rel="noreferrer">
                    We&apos;re&nbsp;<b> hiring!</b>
                </a>
            </div>
            <div className="hero__terminal-wrapper">
                <div className="hero__terminal-animation">
                    <div className="hero__terminal">
                        <div className="hero__terminal-back-layout" />
                        <Editor />
                    </div>
                </div>
            </div>
        </section>
    )
}
