import React from "react"
import Link from "next/link"
import { FILTER_URL_HASH_PREFIX } from "../../constants"
import type { CategoriesWithCount, Category } from "../../domain"

export interface CategoriesProps {
    categoriesWithCounts?: CategoriesWithCount
    categories?: Category[]
    selectedCategory?: Category
    categoryLinkHrefFactory?: (cat: Category) => string
}

export const Categories = (props: CategoriesProps): JSX.Element => {
    const withCounts = Boolean(props.categoriesWithCounts)

    let categoriesRecord: CategoriesWithCount = {}
    if (withCounts) {
        categoriesRecord = props.categoriesWithCounts!
    } else {
        categoriesRecord = Object.fromEntries((props.categories || []).map((cat) => [cat, 0]))
    }

    return (
        <div className="categories-wrapper">
            {Object.entries(categoriesRecord).map(([category, itemsCount]) => {
                const categoryContent = (
                    <>
                        <span>{category}</span>
                        {withCounts ? <span className="categories-wrapper__category__count">{itemsCount}</span> : null}
                    </>
                )

                const classes = ["categories-wrapper__category"]
                if (props.selectedCategory === category) {
                    classes.push("selected")
                }
                if (props.categoryLinkHrefFactory) {
                    classes.push("link")
                }
                const commonProps = { className: classes.join(" ") }

                return props.categoryLinkHrefFactory ? (
                    <Link href={props.categoryLinkHrefFactory(category)} key={category}>
                        <a {...commonProps}>{categoryContent}</a>
                    </Link>
                ) : (
                    <span {...commonProps} key={category}>
                        {categoryContent}
                    </span>
                )
            })}
        </div>
    )
}
