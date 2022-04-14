import React from "react"
import type { GetStaticProps } from "next"
import { Footer } from "../components/footer"
import { GalleryIndex } from "../components/gallery-index"
import { Icons } from "../components/icons"
import { Nav } from "../components/nav"
import type { ProjectGalleryItem, ProjectId } from "../domain"
import * as githubBackendServices from "../services/backend/github"
import * as galleryProjectsBackendServices from "../services/backend/projects-galleries"

interface ProjectsUsingRichPageProps {
    projectId: ProjectId
    galleryItems: ProjectGalleryItem[]
}

export default function ProjectsUsingRichPage(props: ProjectsUsingRichPageProps) {
    return (
        <>
            <Icons />
            <Nav />
            <main>
                <GalleryIndex projectId={props.projectId} galleryItems={props.galleryItems} />
            </main>
            <Footer />
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const projectId = "rich"
    // N.B. This is only executed server-side, thanks to the magic of Next.js 👌
    // @link https://nextjs.org/docs/api-reference/data-fetching/get-static-props
    const galleryItems = await galleryProjectsBackendServices.projectGallery(projectId)
    await githubBackendServices.attachCurrentStarsCountsToRepositories(galleryItems)

    return {
        props: { projectId, galleryItems },
    }
}
