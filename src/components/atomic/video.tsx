import React from "react"
import fscreen from "fscreen"
import { useInView } from "react-intersection-observer"

interface VideoProps {
    videoUrl: string
    initialInView?: boolean
    withoutFullscreen?: boolean
}
export const Video = (props: VideoProps): JSX.Element => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        initialInView: props.initialInView,
        // Once a video was displayed, we leave it in place:
        triggerOnce: true,
    })
    const [videoIsFullScreen, setVideoIsFullScreen] = React.useState<boolean>(false)
    const videoElementRef = React.useRef<HTMLVideoElement>(null)

    const scrollTopBeforeFullscreen = React.useRef<number>(0)

    const onFullScreenChange = React.useCallback(() => {
        setVideoIsFullScreen(
            Boolean(fscreen.fullscreenElement && fscreen.fullscreenElement === videoElementRef.current)
        )
    }, [videoElementRef])

    React.useEffect(function subscribeToFullScreenChanges() {
        fscreen.addEventListener("fullscreenchange", onFullScreenChange)
        return () => {
            fscreen.removeEventListener("fullscreenchange", onFullScreenChange)
        }
    })

    React.useEffect(
        function restoreScrollAfterFullscreen() {
            if (scrollTopBeforeFullscreen.current && !videoIsFullScreen) {
                window.scrollTo(0, scrollTopBeforeFullscreen.current)
            }
        },
        [videoIsFullScreen]
    )

    const onFullscreenableOnClick = async (e: React.MouseEvent): Promise<void> => {
        e.preventDefault()
        if (videoIsFullScreen) {
            await fscreen.exitFullscreen()
        } else {
            scrollTopBeforeFullscreen.current = window.scrollY
            await fscreen.requestFullscreen(videoElementRef.current!)
        }
    }

    const video = (
        <video
            src={props.videoUrl}
            ref={videoElementRef}
            className="video__content"
            autoPlay
            loop
            muted
            playsInline
            controls={videoIsFullScreen}
        />
    )

    const videoWrapper =
        props.withoutFullscreen || !fscreen.fullscreenEnabled ? (
            <span className="video__container">{video}</span>
        ) : (
            <span
                className={[
                    "video__container",
                    "fullscreenable",
                    videoIsFullScreen ? "fullscreen" : "not-fullscreen",
                ].join(" ")}
                onClick={onFullscreenableOnClick}
            >
                {video}

                <span className="video__container__fullscreen_bar">
                    <svg>
                        <use xlinkHref="#icon-fullscreen" />
                    </svg>
                </span>
            </span>
        )

    return (
        <div className="video" ref={ref}>
            {inView ? videoWrapper : null}
        </div>
    )
}
