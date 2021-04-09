import firebase from 'firebase-admin'
import { logger } from '../../utils/logger'
import { Project, ProjectResponse, ServiceError } from './projectService.types'

export interface ProjectService {
    createProject: (project: Project) => Promise<ProjectResponse | ServiceError>
}

export const ProjectService = ({ db }): ProjectService => {
    const createProject = async (project: Project) => {
        try {
            const newProject = {
                ...project,
                created: firebase.firestore.FieldValue.serverTimestamp(),
            }
            const result = await db.collection('projects').doc().set(newProject)
            return Promise.resolve({ success: true, data: result })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'COULD NOT CREATE PROJECT' })
        }
    }

    return { createProject }
}