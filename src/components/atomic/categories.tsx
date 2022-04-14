import React from "react"
import { FILTER_URL_HASH_PREFIX } from "../../constants"
import type { Category } from "../../domain"

export interface CategoriesProps {
    categoriesWithCounts?: Record<Category, number>
    categories?: Category[]
    selectedCategories?: Category[]
    onCategoryClick?: (cat: Category) => void
}

export const Categories = (props: CategoriesProps): JSX.Element => {
    const withCounts = Boolean(props.categoriesWithCounts)

    let categoriesRecord: Record<Category, number> = {}
    if (withCounts) {
        categoriesRecord = props.categoriesWithCounts!
    } else {
        categoriesRecord = Object.fromEntries((props.categories || []).map((cat) => [cat, 0]))
    }

    const onCategoryClick = (category: Category, e: React.MouseEvent): void => {
        props.onCategoryClick?.(category)
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
                if (props.selectedCategories?.includes(category)) {
                    classes.push("selected")
                }
                if (props.onCategoryClick) {
                    classes.push("link")
                }
                const commonProps = { className: classes.join(" "), key: category }

                return props.onCategoryClick ? (
                    <a
                        {...commonProps}
                        href={`${FILTER_URL_HASH_PREFIX}${category}`}
                        onClick={onCategoryClick.bind(null, category)}
                    >
                        {categoryContent}
                    </a>
                ) : (
                    <span {...commonProps}>{categoryContent}</span>
                )
            })}
        </div>
    )
}
