import React from "react"
import type { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { GetStaticPropsContext, GetStaticPropsResult } from "next/types"
import { GalleryIndex } from "../../../components/gallery-index"
import { ProjectId } from "../../../domain"
import * as githubBackendServices from "../../../services/backend/github"
import * as galleryProjectsBackendServices from "../../../services/backend/projects-galleries"
import { ProjectGalleryPageProps, ProjectGalleryStaticPathsParams } from "../../../services/backend/projects-galleries"
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

    const codegenForThisGallery = await import(`../../../data/${projectId}`)
    const codegenWasUsed = Boolean(codegenForThisGallery.CODEGEN_USED)

    const gallerySegments =
        context.params.gallerySegments && Array.isArray(context.params.gallerySegments)
            ? context.params.gallerySegments
            : []
    const props = await galleryProjectsBackendServices.projectGalleryStaticProps({
        projectId,
        gallerySegments,
    })

    // Add GitHub stars count for each item - but only if codegen was not used!
    // (when we generate code we attach the GitHub stars count to the generated data)
    if (!codegenWasUsed) {
        console.debug(
            `Codegen was not used for "${projectId}"'s gallery, let's attach GitHub stars count to the data on the fly`
        )
        await githubBackendServices.attachCurrentStarsCountsToRepositories(props.galleryItems)
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
