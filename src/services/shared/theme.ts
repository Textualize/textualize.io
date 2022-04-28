import { isServerSideRendering } from "../../helpers/runtime-helpers"

export function initTheme(): void {
    if (isServerSideRendering()) {
        return
    }

    try {
        const theme = localStorage.getItem("theme")
        if (theme === "dark") {
            return
        }

        if (theme === "light" || window.matchMedia?.("(prefers-color-scheme: light)").matches) {
            /*
             "Boolean attributes are considered to be true if they're present on the element at all.
             You should set value to the empty string ("") or the attribute's name, with no leading or trailing whitespace."
             @link https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
             */
            document.documentElement.setAttribute("light", "light")
        }
    } catch (e) {
        console.error(e)
    }
}

export function toggleTheme(): void {
    if (isServerSideRendering()) {
        return
    }

    try {
        if (document.documentElement.getAttribute("light")) {
            localStorage.setItem("theme", "dark")
            document.documentElement.removeAttribute("light")
        } else {
            localStorage.setItem("theme", "light")
            document.documentElement.setAttribute("light", "light")
        }
    } catch (e) {
        console.error(e)
    }
}
