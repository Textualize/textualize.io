import React from "react"
import type { ProjectData } from "../domain"

export const ProjectsDataContext = React.createContext<ProjectData[]>([])
