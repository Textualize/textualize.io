import type { ProjectData } from "../domain"

interface TerminalProps {
    videoUrl: string
    tabName?: string
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
                <div className="video">
                    <video src={props.videoUrl} className="video__content" autoPlay loop muted playsInline />
                </div>
            </div>
        </div>
    )
}
