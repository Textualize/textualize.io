import React from "react"
import type { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { GalleryIndex } from "../../../components/gallery-index"
import * as galleryProjectsBackendServices from "../../../services/backend/projects-galleries"
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

export const getStaticProps: GetStaticProps<
    { [key: string]: any },
    galleryProjectsBackendServices.ProjectGalleryStaticPathsParams
> = galleryProjectsBackendServices.projectGalleryStaticProps

export const getStaticPaths: GetStaticPaths = async () => {
    // @link https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
    const pathsParams = await galleryProjectsBackendServices.projectGalleryStaticPathsParams()

    console.debug("Gallery paths params=", pathsParams)

    return {
        paths: pathsParams.map((params) => {
            return { params }
        }),
        fallback: "blocking",
    }
}
