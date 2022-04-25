import React from "react"
import Link from "next/link"
import { FiMoon, FiSun } from "react-icons/fi"
import { SOCIAL_LINKS } from "../../constants"
import * as themeServices from "../../services/shared/theme"
import { Logo } from "../logo"

export const Nav = (): JSX.Element => {
    const onThemeTogglerClick = () => {
        themeServices.toggleTheme()
    }

    return (
        <div className="container">
            <nav className="nav">
                <Link href="/">
                    <a>
                        <Logo />
                    </a>
                </Link>
                <div className="nav__links">
                    <ul className="nav__ul">
                        {Object.entries(SOCIAL_LINKS)
                            .filter(([_name, linkData]) => linkData.appearsInHeader)
                            .map(([name, linkData]) => {
                                return (
                                    <li key={name}>
                                        <a
                                            href={linkData.url}
                                            className="button button--ghost"
                                            aria-label={name}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <svg>
                                                <use xlinkHref={linkData.xlinkHref} />
                                            </svg>
                                        </a>
                                    </li>
                                )
                            })}
                    </ul>
                    <div className="nav__divider"></div>
                    <button
                        id="theme-toggler"
                        className="button button--ghost"
                        aria-label="Toggle theme color"
                        onClick={onThemeTogglerClick}
                    >
                        <FiSun className="nav__icon nav__icon--sun" />
                        <FiMoon className="nav__icon nav__icon--moon" />
                    </button>
                </div>
                <div className="nav__ellipsis-wrapper">
                    <div className="nav__ellipsis" />
                </div>
            </nav>
        </div>
    )
}
