import React from "react"
import Link from "next/link"
import { Logo } from "./logo"

export const Footer = () => (
    <div className="footer__wrapper">
        <footer className="footer">
            <div className="footer__scroll-hint" />
            <div className="footer__container container">
                <div className="footer__links">
                    <div className="footer__link_row">
                        <div className="footer__link-head">About</div>
                        <Link href="/text">
                            <a className="footer__link">Who we are</a>
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
                        <a href="#" aria-label="TODO: add label" className="footer__social-link">
                            <svg className="footer__social-link-icon">
                                <use xlinkHref="#icon-twitter" />
                            </svg>
                        </a>
                        <a href="#" aria-label="TODO: add label" className="footer__social-link">
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
