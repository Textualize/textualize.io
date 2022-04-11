import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { Logo } from "./logo";

export const Nav = () => {
  return (
    <div className="container">
      <nav className="nav">
        <a href="/">
          <Logo />
        </a>
        <div className="nav__links">
          <ul className="nav__ul">
            <li>
              <a
                href="#"
                className="button button--ghost"
                aria-label="TODO: add label"
              >
                <svg>
                  <use xlinkHref="#icon-twitter" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="button button--ghost"
                aria-label="TODO: add label"
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
  );
};
