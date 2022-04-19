import React from "react"
import type { ProjectData } from "../domain"

interface CalloutProps {
    children: React.ReactNode
}

export const Callout = (props: CalloutProps) => {
    return <div className="callout">{props.children}</div>
}
