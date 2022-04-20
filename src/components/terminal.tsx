import React from "react"
import { useInView } from "react-intersection-observer"

interface TerminalProps {
    videoUrl: string
    tabName?: string
    initialInView?: boolean
}

export const Terminal = (props: TerminalProps) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        initialInView: props.initialInView,
        // Once a video was displayed, we leave it in place:
        triggerOnce: true,
    })

    return (
        <div className="terminal">
            <div className="terminal__head">
                <div className="terminal__dots">
                    <div className="terminal__dot terminal__dot--red"></div>
                    <div className="terminal__dot terminal__dot--yellow"></div>
                    <div className="terminal__dot terminal__dot--green"></div>
                </div>
                {props.tabName ? <div className="terminal__tab">{props.tabName}</div> : null}
            </div>
            <div className="terminal__body">
                <div className="video" ref={ref}>
                    {inView ? (
                        <video src={props.videoUrl} className="video__content" autoPlay loop muted playsInline />
                    ) : null}
                </div>
            </div>
        </div>
    )
}
