export const Terminal = ({ tabName }: { tabName?: string }) => {
    return (
        <div className="terminal">
            <div className="terminal__head">
                <div className="terminal__dots">
                    <div className="terminal__dot terminal__dot--red"></div>
                    <div className="terminal__dot terminal__dot--yellow"></div>
                    <div className="terminal__dot terminal__dot--green"></div>
                </div>
                {tabName && <div className="terminal__tab">{tabName}</div>}
            </div>
            <div className="terminal__body">
                <div className="video">
                    <video src="/video/test.mp4" className="video__content" autoPlay loop muted playsInline />
                </div>
            </div>
        </div>
    )
}
