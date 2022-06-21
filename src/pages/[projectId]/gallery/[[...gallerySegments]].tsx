import React from "react"
import Head from "next/head"
import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next/types"
import { GalleryIndex } from "../../../components/page-specific/gallery/gallery-index"
import { ProjectsDataContext } from "../../../contexts/projects-data"
import { ProjectData } from "../../../domain"
import { absoluteUrl } from "../../../helpers/url-helpers"
import * as githubBackendServices from "../../../services/backend/github"
import { getCommonStaticProps as commonGetStaticProps } from "../../../services/nextjs-bridge/common-static-props"
import * as galleryProjectsNextBridgeServices from "../../../services/nextjs-bridge/projects-galleries"
import * as galleryProjectsSharedServices from "../../../services/shared/projects-galleries"

interface ProjectGalleryPageProps extends galleryProjectsNextBridgeServices.ProjectGalleryPageProps {
    projectsData: ProjectData[]
}
export default function ProjectGalleryPage(props: ProjectGalleryPageProps) {
    const canonicalUrl = absoluteUrl(galleryProjectsSharedServices.projectGalleryPageUrl(props))

    return (
        <>
            <Head>
                <link rel="canonical" href={canonicalUrl} />
            </Head>
            <ProjectsDataContext.Provider value={props.projectsData}>
                <GalleryIndex
                    projectId={props.projectId}
                    currentPage={props.page}
                    pagesCount={props.pagesCount}
                    galleryItems={props.galleryItems}
                    selectedCategory={props.category ?? undefined}
                    galleryCategoriesWithCount={props.galleryCategoriesWithCount}
                />
            </ProjectsDataContext.Provider>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (
    context
): Promise<GetStaticPropsResult<ProjectGalleryPageProps>> => {
    if (!context.params || !context.params.projectId) {
        return { notFound: true }
    }

    const projectId = context.params.projectId
    if (!galleryProjectsSharedServices.isProjectId(projectId)) {
        return { notFound: true }
    }

    const gallerySegments =
        context.params.gallerySegments && Array.isArray(context.params.gallerySegments)
            ? context.params.gallerySegments
            : []
    const props = await galleryProjectsNextBridgeServices.projectGalleryStaticProps({
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

    const { props: commonProps } = await commonGetStaticProps(context)

    return { props: { ...commonProps, ...props } }
}

export const getStaticPaths: GetStaticPaths = async () => {
    // @link https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
    const pathsParams = await galleryProjectsNextBridgeServices.projectGalleryStaticPathsParams()

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
