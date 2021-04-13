import { createProjectPayload, updateProjectPayload } from '../services/projectService/projectService.types'
import { Dependencies, ControllerResult } from '../types/app.types'
import { logger } from '../utils/logger'
import { failedResult, successResult } from './controllerResults'

export interface ProjectController {
    createProject: (uid: string, project: createProjectPayload, files) => Promise<ControllerResult>
    updateProject: (uid: string, projectId: string, ProjectChanges: updateProjectPayload) => Promise<ControllerResult>
    deleteProject: (uid: string, projectId: string) => Promise<ControllerResult>
}

export const ProjectController = (deps: Dependencies): ProjectController => {

    const createProject = async (uid: string, project: createProjectPayload, files) => {
        try {
            if (files) {
                project.images = []
                files.forEach(file => {
                    project.images.push(file.cloudStoragePublicUrl)
                    logger.info(file.cloudStoragePublicUrl)
                })
            }
            const newProject = {
                ...project,
                creator: uid,
                reactions: {
                    like: {
                        total: 0,
                        authorsIds: []
                    },
                    dislike: {
                        total: 0,
                        authorsIds: []
                    },
                    fire: {
                        total: 0,
                        authorsIds: []
                    },
                    laugh: {
                        total: 0,
                        authorsIds: []
                    },
                    rocket: {
                        total: 0,
                        authorsIds: []
                    },
                    applause: {
                        total: 0,
                        authorsIds: []
                    },
                    angry: {
                        total: 0,
                        authorsIds: []
                    },
                    confused: {
                        total: 0,
                        authorsIds: []
                    },
                }
            }
            const { success, data } = await deps.projectService.createProject(newProject)
            const projectId = data
            if (!success) {
                return failedResult(data)
            } else {
                const { success, data } = await deps.projectService.updateProjectHistory(uid, projectId, 'created project')
                if (success) {
                    return successResult(data)
                } else {
                    return failedResult(data)
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const updateProject = async (uid: string, projectId: string, projectChanges: createProjectPayload) => {
        try {
            const { success, data } = await deps.projectService.updateProject(projectId, projectChanges)
            if (!success) {
                return failedResult(data)
            } else {
                const { success, data } = await deps.projectService.updateProjectHistory(uid, projectId, 'updated project')
                if (success) {
                    return successResult(data)
                } else {
                    return failedResult(data)
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const deleteProject = async (uid: string, projectId: string) => {
        try {
            const { success, data } = await deps.projectService.deleteProject(projectId)
            if (!success) {
                return failedResult(data)
            } else {
                const { success, data } = await deps.projectService.updateProjectHistory(uid, projectId, 'deleted project')
                if (success) {
                    return successResult(data)
                } else {
                    return failedResult(data)
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    return { createProject, updateProject, deleteProject }
}