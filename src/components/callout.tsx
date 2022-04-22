import React from "react"

interface CalloutProps {
    children: React.ReactNode
}

export const Callout = (props: CalloutProps) => {
    return <div className="callout">{props.children}</div>
}
