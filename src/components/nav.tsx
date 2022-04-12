import Link from "next/link"
import React from "react"
import { FiMoon, FiSun } from "react-icons/fi"
import { AppConfig } from "../config"
import * as themeServices from "../services/theme"
import { Logo } from "./logo"

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
                        <li>
                            <a
                                href={AppConfig.textualize.urls.twitter}
                                className="button button--ghost"
                                aria-label="Twitter"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <svg>
                                    <use xlinkHref="#icon-twitter" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a
                                href={AppConfig.textualize.urls.github}
                                className="button button--ghost"
                                aria-label="GitHub"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <svg>
                                    <use xlinkHref="#icon-github" />
                                </svg>
                            </a>
                        </li>
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
