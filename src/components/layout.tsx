import React from "react"
import { Footer } from "./footer"
import { Icons } from "./icons"
import { Nav } from "./nav"

interface LayoutProps {
    children: React.ReactNode
}
export const Layout = ({ children }: LayoutProps): JSX.Element => {
    return (
        <>
            <Icons />
            <Nav />
            <main>{children}</main>
            <Footer />
        </>
    )
}
