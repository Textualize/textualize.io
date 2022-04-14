import React from "react"
import type { GetStaticProps } from "next"
import { GalleryIndex } from "../components/gallery-index"
import type { ProjectGalleryItem, ProjectId } from "../domain"
import * as githubBackendServices from "../services/backend/github"
import * as galleryProjectsBackendServices from "../services/backend/projects-galleries"

interface ProjectsUsingTextualPageProps {
    projectId: ProjectId
    galleryItems: ProjectGalleryItem[]
}

export default function ProjectsUsingTextualPage(props: ProjectsUsingTextualPageProps) {
    return (
        <>
            <GalleryIndex projectId={props.projectId} galleryItems={props.galleryItems} />
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const projectId = "textual"
    // N.B. This is only executed server-side, thanks to the magic of Next.js 👌
    // @link https://nextjs.org/docs/api-reference/data-fetching/get-static-props
    const galleryItems = await galleryProjectsBackendServices.projectGallery(projectId)
    await githubBackendServices.attachCurrentStarsCountsToRepositories(galleryItems)

    return {
        props: { projectId, galleryItems },
    }
}
