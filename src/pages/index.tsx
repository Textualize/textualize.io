import React from "react"
import type { GetStaticProps } from "next/types"
import { MailList } from "../components/mail-list"
import { Hero } from "../components/page-specific/home/hero"
import { ProjectsIndex } from "../components/page-specific/home/projects-index"
import { ProjectsDataContext } from "../contexts/projects-data"
import type { ProjectData } from "../domain"
import { getCommonStaticProps as commonGetStaticProps } from "../services/nextjs-bridge/common-static-props"

interface HomePageProps {
    projectsData: ProjectData[]
}

export default function HomePage(props: HomePageProps) {
    // At the moment the video we display in the "Hero" is the Textual one, but that may change in the future
    return (
        <>
            <ProjectsDataContext.Provider value={props.projectsData}>
                <Hero videoUrl={props.projectsData[0].videoUrl} />
                <MailList />
                <ProjectsIndex projectsData={props.projectsData} />
            </ProjectsDataContext.Provider>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    // N.B. This is only executed server-side, thanks to the magic of Next.js 👌
    // @link https://nextjs.org/docs/api-reference/data-fetching/get-static-props
    const { props: commonProps } = await commonGetStaticProps(context)

    return {
        props: commonProps,
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every hour
        revalidate: 3_600, // In seconds
    }
}
