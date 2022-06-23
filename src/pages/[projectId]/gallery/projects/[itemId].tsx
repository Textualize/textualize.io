import React from "react"
import Link from "next/link"
import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next/types"
import { GalleryItemZoom } from "../../../../components/page-specific/gallery/gallery-item-zoom"
import type { ProjectData, ProjectGalleryItem } from "../../../../domain"
import { PROJECT_NAMES } from "../../../../i18n"
import * as githubBackendServices from "../../../../services/backend/github"
import * as projectsBackendServices from "../../../../services/backend/projects"
import * as galleryProjectsBackendServices from "../../../../services/backend/projects-galleries"
import * as galleryProjectsNextBridgeServices from "../../../../services/nextjs-bridge/projects-galleries"
import * as galleryProjectsSharedServices from "../../../../services/shared/projects-galleries"

interface ProjectGalleryItemPageProps {
    item: ProjectGalleryItem
    project: ProjectData
    galleryPageUrl: string
}

export default function ProjectGalleryItemPage(props: ProjectGalleryItemPageProps): JSX.Element {
    const item = props.item

    return (
        <section className="gallery-item-zoom-container page__content_container">
            <div className="page__headline__bg" />
            <div className="container">
                <h2 className="page__headline">
                    <div className="page__headline__main">
                        <span className="project-name">{item.title}</span>
                        {item.stars ? (
                            <div className="badge">
                                <svg height="1em" width="1em" className="badge__icon">
                                    <use xlinkHref="#icon-start" />
                                </svg>
                                <span className="badge__label">{item.stars}</span>
                            </div>
                        ) : null}
                    </div>
                    <p className="page__headline__caption">
                        uses{" "}
                        <a href={props.project.codeUrl} target="_blank" rel="noreferrer">
                            {PROJECT_NAMES[item.projectId]}
                        </a>
                    </p>
                </h2>
            </div>

            <div className="container">
                <p className="breadcrumb">
                    ❰{" "}
                    <Link href={props.galleryPageUrl}>
                        <a>Projects index</a>
                    </Link>
                </p>
            </div>

            <div className="container">
                <GalleryItemZoom item={item} />
            </div>
        </section>
    )
}

export const getStaticProps: GetStaticProps = async (
    context
): Promise<GetStaticPropsResult<ProjectGalleryItemPageProps>> => {
    if (
        !context.params ||
        !context.params.projectId ||
        !context.params.itemId ||
        typeof context.params.itemId !== "string"
    ) {
        return { notFound: true }
    }

    const projectId = context.params.projectId
    if (!galleryProjectsSharedServices.isProjectId(projectId)) {
        return { notFound: true }
    }
    const itemId = context.params.itemId
    const item = (await galleryProjectsBackendServices.projectGallery(projectId)).find((item) => item.id === itemId)
    if (!item) {
        return { notFound: true }
    }
    await githubBackendServices.attachCurrentStarsCountsToRepository(item)

    const project = await projectsBackendServices.projectById(projectId)

    const galleryPageUrl = await galleryProjectsBackendServices.projectGalleryPageUrlForItem(item.projectId, item.id)

    return {
        props: {
            item,
            project,
            galleryPageUrl,
        },
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    // @link https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
    const pathsParams = await galleryProjectsNextBridgeServices.projectGalleryItemStaticPathsParams()

    return {
        paths: pathsParams.map((params) => {
            // N.B. Creating new params this way makes TypeScript happy,
            // as the params implement the ParsedUrlQuery interface this way :-)
            return { params: { ...params } }
        }),
        fallback: "blocking",
    }
}
