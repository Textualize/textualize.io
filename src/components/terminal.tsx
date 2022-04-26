import React from "react"
import { Video } from "./atomic/video"

interface TerminalProps {
    videoUrl: string
    tabName?: string
    initialInView?: boolean
}

export const Terminal = (props: TerminalProps) => {
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
                <Video videoUrl={props.videoUrl} initialInView={props.initialInView} />
            </div>
        </div>
    )
}
