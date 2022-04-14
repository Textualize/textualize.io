import React from "react"
import Link from "next/link"

export interface ButtonProps {
    text: string
    url: string | null
    color: "lilac" | "blue" | "yellow"
    xlinkHref: string
}
export const Button = (props: ButtonProps): JSX.Element | null => {
    if (!props.url) {
        return null
    }

    const isAbsoluteUrl = props.url.startsWith("https://")
    const link = (
        <a
            href={isAbsoluteUrl ? props.url : undefined}
            className={`button button--${props.color} u-fx-no-shrink`}
            target={isAbsoluteUrl ? "_blank" : undefined}
            rel="noreferrer"
            key={props.text}
        >
            <svg height="1em" width="1em">
                <use xlinkHref={props.xlinkHref} />
            </svg>
            {props.text}
        </a>
    )

    if (isAbsoluteUrl) {
        return link
    } else {
        return (
            <Link href={props.url} passHref>
                {link}
            </Link>
        )
    }
}
