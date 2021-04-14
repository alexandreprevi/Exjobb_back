import firebase from 'firebase-admin'
import { logger } from '../../utils/logger'
import { generateIdWithTimestamp } from '../../utils/utils'
import { Project, ProjectResponse, ServiceError, createProjectPayload, ProjectHistoryResponse, updateProjectPayload, CreateProjectResponse } from './projectService.types'

export interface ProjectService {
  getProject: (projectId: string) => Promise<ProjectResponse | ServiceError>
  createProject: (project: createProjectPayload, projectId: string) => Promise<CreateProjectResponse | ServiceError>
  updateProject: (projectId: string, projectChanges: updateProjectPayload) => Promise<ProjectResponse | ServiceError>
  deleteProject: (projectId: string) => Promise<ProjectResponse | ServiceError>
  deleteOneImage: (projectId: string, image: string) => Promise<ProjectResponse | ServiceError>
  updateProjectHistory: (uid: string, projectId: string, action: string) => Promise<ProjectHistoryResponse | ServiceError>
}

export const ProjectService = ({ db }): ProjectService => {
  const getProject = async (projectId: string) => {
    try {
      const result = await db.collection('projects').doc(projectId).get()
      return Promise.resolve({ success: true, data: result.data() })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT GET PROJECT' })
    }
  }
  const createProject = async (project: createProjectPayload, projectId: string) => {
    try {
      const newProject = {
        ...project,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      }
      const result = await db.collection('projects').doc(projectId).set(newProject)
      return Promise.resolve({ success: true, data: result.id })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT CREATE PROJECT' })
    }
  }
  const updateProject = async (projectId: string, projectChanges: updateProjectPayload) => {
    try {
      const result = await db.collection('projects').doc(projectId).update(projectChanges)
      return Promise.resolve({ success: true, data: result.id })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT UPDATE PROJECT' })
    }
  }
  const deleteProject = async (projectId: string) => {
    try {
      const result = await db.collection('projects').doc(projectId).delete()
      return Promise.resolve({ success: true, data: result.id })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT DELETE PROJECT' })
    }
  }
  const deleteOneImage = async (projectId: string, image: string) => {
    try {
      const result = await db
        .collection('projects')
        .doc(projectId)
        .update({
          images: firebase.firestore.FieldValue.arrayRemove(image),
        })
      return Promise.resolve({ success: true, data: result.id })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT DELETE IMAGE FROM PROJECT' })
    }
  }
  const updateProjectHistory = async (uid: string, projectId: string, action: string) => {
    try {
      const result = await db
        .collection('projects')
        .doc(projectId)
        .collection('history')
        .doc(generateIdWithTimestamp('H'))
        .set({ event: { author: uid, action: action, timestamp: firebase.firestore.FieldValue.serverTimestamp() } }, { merge: true })
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT UPDATE PROJECT HISTORY' })
    }
  }

  return { getProject, createProject, updateProject, deleteProject, deleteOneImage, updateProjectHistory }
}
