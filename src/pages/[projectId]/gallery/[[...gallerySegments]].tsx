import React from "react"
import type { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { GetStaticPropsResult } from "next/types"
import { GalleryIndex } from "../../../components/page-specific/gallery/gallery-index"
import * as githubBackendServices from "../../../services/backend/github"
import * as galleryProjectsBackendServices from "../../../services/backend/projects-galleries"
import { ProjectGalleryPageProps } from "../../../services/backend/projects-galleries"
import * as galleryProjectsSharedServices from "../../../services/shared/projects-galleries"

export default function ProjectGalleryPage(props: galleryProjectsBackendServices.ProjectGalleryPageProps) {
    const canonicalUrl = galleryProjectsSharedServices.projectGalleryPageUrl(props)

    return (
        <>
            <Head>
                <link rel="canonical" href={canonicalUrl} />
            </Head>
            <GalleryIndex
                projectId={props.projectId}
                currentPage={props.page}
                pagesCount={props.pagesCount}
                galleryItems={props.galleryItems}
                selectedCategory={props.category ?? undefined}
                galleryCategoriesWithCount={props.galleryCategoriesWithCount}
            />
        </>
    )
}

export const getStaticProps: GetStaticProps = async (
    context
): Promise<GetStaticPropsResult<ProjectGalleryPageProps>> => {
    if (!context.params || !context.params.projectId) {
        throw new Error("Received unexpected params for a project gallery page")
    }

    const projectId = context.params.projectId
    if (!galleryProjectsSharedServices.isProjectId(projectId)) {
        throw new Error(`Invalid projectId "${projectId}"`)
    }

    //TODO: remove this once we're confident enough in our static pages generation :-)
    const cacheSharedServices = await import("../../../services/shared/cache")
    cacheSharedServices.enableDebugMode()

    const gallerySegments =
        context.params.gallerySegments && Array.isArray(context.params.gallerySegments)
            ? context.params.gallerySegments
            : []
    const props = await galleryProjectsBackendServices.projectGalleryStaticProps({
        projectId,
        gallerySegments,
    })

    if (props.galleryItems.length) {
        // Add GitHub stars count for each item - but only if codegen was not used!
        // It's not a very clean way to detect codegen, but let's assume that we don't need to dynamically
        // fetch the GitHub stars count if our gallery items seem to already have such metrics attached:
        const codegenWasUsed = Boolean(props.galleryItems[0].stars)
        if (!codegenWasUsed) {
            console.debug(
                `Codegen was not used for "${projectId}"'s gallery, let's attach GitHub stars count to the data on the fly`
            )
            await githubBackendServices.attachCurrentStarsCountsToRepositories(props.galleryItems)
        }
    }

    return { props }
}

export const getStaticPaths: GetStaticPaths = async () => {
    // @link https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
    const pathsParams = await galleryProjectsBackendServices.projectGalleryStaticPathsParams()

    console.debug("Gallery paths params=", pathsParams)

    return {
        paths: pathsParams.map((params) => {
            // N.B. Creating new params this way makes TypeScript happy,
            // as the params implement the ParsedUrlQuery interface this way :-)
            return { params: { ...params } }
        }),
        fallback: "blocking",
    }
}
