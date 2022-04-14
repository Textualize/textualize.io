import React from "react"
import Link from "next/link"
import { AppConfig } from "../config"
import { Logo } from "./logo"

const DISPLAY_SCROLL_HINT = false // set to `true` to re-enable the floating down arrow

export const Footer = (): JSX.Element => {
    React.useEffect(
        () => {
            const oberver = initFooterIntersectionObserver()
            return function disconnectObserver() {
                oberver.disconnect()
            }
        },
        [] // only on mount
    )

    return (
        <div className="footer__wrapper">
            <footer className="footer">
                {DISPLAY_SCROLL_HINT ? <div className="footer__scroll-hint" /> : null}
                <div className="footer__container container">
                    <div className="footer__links">
                        <div className="footer__link_row">
                            <div className="footer__link-head">About</div>
                            <Link href="/what-we-do">
                                <a className="footer__link">What we do</a>
                            </Link>
                            <a href="#" className="footer__link">
                                Contact
                            </a>
                        </div>
                        <div className="footer__link_row">
                            <div className="footer__link-head">Legal</div>
                            <a href="#" className="footer__link">
                                Privacy Policy
                            </a>
                            <a href="#" className="footer__link">
                                Terms
                            </a>
                        </div>
                    </div>
                    <div className="footer__brand">
                        <div>
                            <Logo isFooter />
                        </div>
                        <div className="footer__social-links">
                            <a
                                href={AppConfig.textualize.urls.twitter}
                                aria-label="Twitter"
                                className="footer__social-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <svg className="footer__social-link-icon">
                                    <use xlinkHref="#icon-twitter" />
                                </svg>
                            </a>
                            <a
                                href={AppConfig.textualize.urls.github}
                                aria-label="GitHub"
                                className="footer__social-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <svg className="footer__social-link-icon">
                                    <use xlinkHref="#icon-github" />
                                </svg>
                            </a>
                        </div>
                        <strong translate="no" className="footer__copyright">
                            © Textualize Inc.
                        </strong>
                    </div>
                </div>
                <div className="footer__ellipsis-container">
                    <div className="footer__ellipsis-wrapper">
                        <div className="footer__ellipsis"></div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function initFooterIntersectionObserver(): IntersectionObserver {
    const footerEl = document.querySelector("footer") as HTMLElement

    const observerFooter = new window.IntersectionObserver(
        function (entries) {
            entries.forEach(function (item) {
                footerEl.classList.toggle("footer--visible", item.isIntersecting)
            })
        },
        {
            rootMargin: "0px",
            threshold: 0.3,
        }
    )
    observerFooter.observe(footerEl)

    return observerFooter
}
