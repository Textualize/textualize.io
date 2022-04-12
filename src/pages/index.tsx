import type { GetStaticProps } from "next"
import React from "react"
import { Footer } from "../components/footer"
import { Hero } from "../components/hero"
import { Icons } from "../components/icons"
import { MailList } from "../components/mail-list"
import { Nav } from "../components/nav"
import { Projects } from "../components/projects"
import { ProjectData } from "../domain"
import * as githubServices from "../services/github"

interface HomeProps {
    projectsData: ProjectData[]
}
export default function Home(props: HomeProps) {
    return (
        <>
            <Icons />
            <Nav />
            <main>
                <Hero />
                <MailList />
                <Projects projectsData={props.projectsData} />
            </main>
            <Footer />
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    // N.B. This is only executed server-side, thanks to the magic of Next.js 👌
    // @link https://nextjs.org/docs/api-reference/data-fetching/get-static-props
    const projects = await githubServices.projectsWithCurrentStarsCounts()

    return {
        props: { projectsData: projects },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every hour
        revalidate: 3_600, // In seconds
    }
}
