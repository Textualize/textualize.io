import React from "react"
import { Footer } from "../components/footer"
import { Hero } from "../components/hero"
import { Icons } from "../components/icons"
import { MailList } from "../components/mail-list"
import { Nav } from "../components/nav"
import { Projects } from "../components/projects"

export default function Home() {
    return (
        <>
            <Icons />
            <Nav />
            <main>
                <Hero />
                <MailList />
                <Projects />
            </main>
            <Footer />
        </>
    )
}
