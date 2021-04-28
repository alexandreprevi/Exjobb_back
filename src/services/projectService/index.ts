import firebase from 'firebase-admin'
import { logger } from '../../utils/logger'
import { generateIdWithTimestamp } from '../../utils/utils'
import { Project, ProjectResponse, ProjectsResponse, ServiceError, createProjectPayload, ProjectHistoryResponse, updateProjectPayload, CreateProjectResponse } from './projectService.types'

export interface ProjectService {
  getUserProjects: (userId: string) => Promise<ProjectsResponse | ServiceError>
  getProjects: () => Promise<ProjectsResponse | ServiceError>
  getProject: (projectId: string) => Promise<ProjectResponse | ServiceError>
  createProject: (project: createProjectPayload, projectId: string) => Promise<CreateProjectResponse | ServiceError>
  updateProject: (projectId: string, projectChanges: updateProjectPayload) => Promise<ProjectResponse | ServiceError>
  deleteProject: (projectId: string) => Promise<ProjectResponse | ServiceError>
  deleteOneImage: (projectId: string, image: string) => Promise<ProjectResponse | ServiceError>
  updateProjectHistory: (uid: string, projectId: string, action: string) => Promise<ProjectHistoryResponse | ServiceError>
}

export const ProjectService = ({ db }): ProjectService => {
  const getUserProjects = async (userId: string) => {
    try {
      logger.info(userId)
      const result = await db.collection('projects').where('creatorId', '==', userId).get()
      const projects = []
      result.forEach((doc: FirebaseFirestore.DocumentSnapshot) => {
        logger.info(doc.data().title)
        logger.info(doc.id)
        projects.push({
          ...doc.data(),
          projectId: doc.id,
        })
      })  
      return Promise.resolve({ success: true, data: projects })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT GET USER PROJECTS' })
    }
  }
  const getProjects = async () => {
    try {
      const result = await db.collection('projects').orderBy('createdAt', 'desc').get()
      const projects = []
      result.forEach((doc: FirebaseFirestore.DocumentSnapshot) => {
        logger.info(doc.data().title)
        logger.info(doc.id)
        projects.push({
          ...doc.data(),
          projectId: doc.id,
        })
      })  
      return Promise.resolve({ success: true, data: projects })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT GET PROJECTS' })
    }
  }
  const getProject = async (projectId: string) => {
    try {
      const result = await db.collection('projects').doc(projectId).get()
      const project = {
        projectId: projectId,
        ...result.data(),
      }
      return Promise.resolve({ success: true, data: project })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT GET PROJECT' })
    }
  }
  const createProject = async (project: createProjectPayload, projectId: string) => {
    try {
      const newProject = {
        ...project,
        createdAt: new Date().toISOString(),
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
      const updatedProject = {
        ...projectChanges,
        updatedAt: new Date().toISOString()
      }
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
        .set({ event: { author: uid, action: action, timestamp: new Date().toISOString() } }, { merge: true })
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT UPDATE PROJECT HISTORY' })
    }
  }

  return { getUserProjects, getProject, getProjects, createProject, updateProject, deleteProject, deleteOneImage, updateProjectHistory }
}
