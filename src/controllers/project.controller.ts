import { createProjectPayload, updateProjectPayload } from '../services/projectService/projectService.types'
import { Dependencies, ControllerResult } from '../types/app.types'
import { logger } from '../utils/logger'
import { generateIdWithTimestamp, userIsOwner } from '../utils/utils'
import { failedResult, successResult } from './controllerResults'

export interface ProjectController {
  getUserProjects: (userId: string) => Promise<ControllerResult>
  getProjects: () => Promise<ControllerResult>
  getProject: (projectId: string) => Promise<ControllerResult>
  createProject: (uid: string, username: string, project: createProjectPayload, files) => Promise<ControllerResult>
  updateProject: (uid: string, projectId: string, ProjectChanges: updateProjectPayload, files) => Promise<ControllerResult>
  deleteProjectImage: (uid: string, projectId: string, image: string) => Promise<ControllerResult>
  deleteProject: (uid: string, projectId: string) => Promise<ControllerResult>
}

export const ProjectController = (deps: Dependencies): ProjectController => {
  const createProject = async (uid: string, username: string, project: createProjectPayload, files) => {
    try {
      const projectId = generateIdWithTimestamp('P')
      logger.info(projectId)
      if (files) {
        const { success, data } = await deps.storageService.uploadMultipleImages(uid, projectId, files)
        if (!success) {
          return failedResult(data)
        } else {
          project.images = []
          files.forEach(file => {
            project.images.push(file.cloudStoragePublicUrl)
          })
        }
      }

      const newProject = {
        ...project,
        creatorId: uid,
        creator: username,
        reactions: {
          like: {
            total: 0,
            authorsIds: [],
          },
          dislike: {
            total: 0,
            authorsIds: [],
          },
          hooray: {
            total: 0,
            authorsIds: [],
          },
          laugh: {
            total: 0,
            authorsIds: [],
          },
          rocket: {
            total: 0,
            authorsIds: [],
          },
          applause: {
            total: 0,
            authorsIds: [],
          },
          angry: {
            total: 0,
            authorsIds: [],
          },
          confused: {
            total: 0,
            authorsIds: [],
          },
          heart: {
            total: 0,
            authorsIds: [],
          },
        },
      }
      const { success, data } = await deps.projectService.createProject(newProject, projectId)
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
  const updateProject = async (uid: string, projectId: string, projectChanges: createProjectPayload, files) => {
    try {
      const { success, data } = await deps.projectService.getProject(projectId)
      const project = data
      if (!success) {
        return failedResult(data)
      } else {
        if (typeof project !== 'string') {
          // check owner ship of document to update
          if (userIsOwner(uid, project.creator) === false) {
            return failedResult('NOT OWNER OF THIS DOCUMENT')
          } else {
            // check total of uploaded files on the project
            if (files && project.images.length + files.length > 10) {
              return failedResult('10 files max')
            } else if (files && project.images.length + files.length <= 10) {
              // upload files
              const { success, data } = await deps.storageService.uploadMultipleImages(uid, projectId, files)
              if (!success) {
                return failedResult(data)
              } else {
                files.forEach(file => {
                  project.images.push(file.cloudStoragePublicUrl)
                  logger.info(file.cloudStoragePublicUrl)
                })
                projectChanges = {
                  ...projectChanges,
                  images: project.images,
                }
              }
            }
          }
        }
        // TODO: this might be a batch write
        // update project in Cloud firestore
        const { success, data } = await deps.projectService.updateProject(projectId, projectChanges)
        if (!success) {
          return failedResult(data)
        } else {
          // update project history subcollection
          const { success, data } = await deps.projectService.updateProjectHistory(uid, projectId, 'updated project')
          if (success) {
            return successResult(data)
          } else {
            return failedResult(data)
          }
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const deleteProjectImage = async (uid: string, projectId: string, image: string) => {
    try {
      // DELETE from storage
      const { success, data } = await deps.storageService.deleteOneImage(image, projectId)
      if (!success) {
        return failedResult(data)
      } else {
        // DELETE from project
        // TODO: this might be a batch write
        const { success, data } = await deps.projectService.deleteOneImage(projectId, image)
        if (!success) {
          return failedResult(data)
        } else {
          const { success, data } = await deps.projectService.updateProjectHistory(uid, projectId, 'deleted images')
          if (success) {
            return successResult(data)
          } else {
            return failedResult(data)
          }
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const deleteProject = async (uid: string, projectId: string) => {
    try {
      // Get project
      const { success, data } = await deps.projectService.getProject(projectId)
      const project = data
      if (!success) {
        return failedResult(data)
      } else {
        if (typeof project !== 'string' && project.images.length > 0) {
          // delete from storage
          const { success, data } = await deps.storageService.deleteAllImages(projectId)
          if (!success) {
            return failedResult(data)
          } else {
            // delete from firestore
            // TODO: this might be a batch write
            const { success, data } = await deps.projectService.deleteProject(projectId)
            if (!success) {
              return failedResult(data)
            } else {
              // save in project history
              const { success, data } = await deps.projectService.updateProjectHistory(uid, projectId, 'deleted project')
              if (success) {
                return successResult(data)
              } else {
                return failedResult(data)
              }
            }
          }
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const getUserProjects = async (userId: string) => {
    try {
      const { success, data } = await deps.projectService.getUserProjects(userId)
      if (success) {
        return successResult(data)
      } else {
        return failedResult(data)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const getProjects = async () => {
    try {
      const { success, data } = await deps.projectService.getProjects()
      if (success) {
        return successResult(data)
      } else {
        return failedResult(data)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const getProject = async (projectId: string) => {
    try {
      const { success, data } = await deps.projectService.getProject(projectId)
      if (success) {
        return successResult(data)
      } else {
        return failedResult(data)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  return { getUserProjects, getProjects, getProject, createProject, updateProject, deleteProjectImage, deleteProject }
}
