import { createProjectPayload } from '../services/projectService/projectService.types'
import { Dependencies, ControllerResult } from '../types/app.types'
import { logger } from '../utils/logger'
import { failedResult, successResult } from './controllerResults'

export interface ProjectController {
    createProject: (uid: string, project: createProjectPayload) => Promise<ControllerResult>
    // updateProject: (projectId: string, ProjectChanges: UpdateProjectPayload) => Promise<ControllerResult>
    // deleteProject: (projectId: string) => Promise<ControllerResult>
}

export const ProjectController = (deps: Dependencies): ProjectController => {

    const createProject = async (uid: string, project: createProjectPayload) => {
        try {
            const newProject = {
                ...project,
                creator: uid
            }
            const { success, data } = await deps.projectService.createProject(newProject)
            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    return { createProject }
}