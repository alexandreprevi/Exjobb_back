import firebase from 'firebase-admin'
import { logger } from '../../utils/logger'
import { generateIdWithTimestamp } from '../../utils/utils'
import { Project, ProjectResponse, ServiceError, createProjectPayload, ProjectHistoryResponse, updateProjectPayload } from './projectService.types'

export interface ProjectService {
    createProject: (project: createProjectPayload) => Promise<ProjectResponse | ServiceError>
    updateProject: (projectId: string, projectChanges: updateProjectPayload) => Promise<ProjectResponse | ServiceError>
    deleteProject: (projectId: string) => Promise<ProjectResponse | ServiceError>
    updateProjectHistory: (uid: string, projectId: string, action: string) => Promise<ProjectHistoryResponse | ServiceError>
}

export const ProjectService = ({ db }): ProjectService => {
    const createProject = async (project: createProjectPayload) => {
        try {
            const newProject = {
                ...project,
                created: firebase.firestore.FieldValue.serverTimestamp(),
            }
            const result = await db.collection('projects').add(newProject)
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
    const updateProjectHistory = async (uid: string, projectId: string, action: string) => {
        try {
            const result = await db.collection('projects').doc(projectId).collection('history').doc(generateIdWithTimestamp()).set({ event: { author: uid, action: action, timestamp: firebase.firestore.FieldValue.serverTimestamp() } }, { merge: true })
            return Promise.resolve({ success: true, data: result })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'COULD NOT UPDATE PROJECT HISTORY' })
        }
    }

    return { createProject, updateProject, deleteProject, updateProjectHistory }
}