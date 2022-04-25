import React from "react"
import { Icons } from "../icons"
import { Footer } from "./footer"
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
