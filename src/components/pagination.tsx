import React from "react"
import Link from "next/link"
import { pagesRange } from "../helpers/pagination-helpers"

// N.B. This component is inspired by MUI's one: (notably regarding the ARIA attributes)
// @link https://mui.com/material-ui/react-pagination/

export interface PaginationProps {
    currentPage: number
    pagesCount: number
    pageUrlFactory: (_page: number) => string
}
export const Pagination = (props: PaginationProps): JSX.Element | null => {
    if (props.pagesCount < 2) {
        return null
    }

    const commonProps: Omit<PaginationItemProps, "itemData"> = {
        currentPage: props.currentPage,
        pagesCount: props.pagesCount,
        pageUrlFactory: props.pageUrlFactory,
    }

    return (
        <nav className="pagination" aria-label="pagination navigation">
            <ul>
                <PaginationItem itemData={{ type: "previous" }} {...commonProps} key="previous" />
                {pagesRange(props.pagesCount).map((page) => (
                    <PaginationItem itemData={{ type: "page", targetPage: page }} {...commonProps} key={page} />
                ))}
                <PaginationItem itemData={{ type: "next" }} {...commonProps} key="next" />
            </ul>
        </nav>
    )
}

interface PaginationItemProps {
    itemData: PaginationItemPreviousNextData | PaginationItemPageData
    currentPage: number
    pagesCount: number
    pageUrlFactory: (_page: number) => string
}
interface PaginationItemPreviousNextData {
    type: "previous" | "next"
}
interface PaginationItemPageData {
    type: "page"
    targetPage: number
}
const PaginationItem = (props: PaginationItemProps): JSX.Element => {
    let content = ""
    let ariaAttributes: React.AriaAttributes = {}
    let classNames: string[] = []
    let targetPage = 1
    let enabled = true

    switch (props.itemData.type) {
        case "previous":
            content = "<"
            targetPage = Math.max(1, props.currentPage - 1)
            enabled = props.currentPage > 1
            classNames.push("previous")
            ariaAttributes["aria-label"] = "Go to previous page"
            break
        case "next":
            content = ">"
            targetPage = Math.min(props.pagesCount, props.currentPage + 1)
            enabled = props.currentPage < props.pagesCount
            classNames.push("next")
            ariaAttributes["aria-label"] = "Go to next page"
            break
        case "page":
            content = String(props.itemData.targetPage)
            targetPage = props.itemData.targetPage
            const isCurrentPage = props.itemData.targetPage === props.currentPage
            enabled = !isCurrentPage
            classNames.push("page")
            if (isCurrentPage) {
                classNames.push("selected")
            }
            ariaAttributes["aria-current"] = isCurrentPage
            ariaAttributes["aria-label"] = `page ${targetPage}`
            break
    }

    if (!enabled) {
        ariaAttributes["aria-disabled"] = true
    }
    const url = enabled ? props.pageUrlFactory(targetPage) : ""

    return (
        <li className={classNames.join(" ")} {...ariaAttributes}>
            {enabled ? (
                <Link href={url}>
                    <a> {content}</a>
                </Link>
            ) : (
                <span>{content}</span>
            )}
        </li>
    )
}
