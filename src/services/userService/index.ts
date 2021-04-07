import { logger } from '../../utils/logger'
import { UserResponse, ServiceError } from './userService.types'

export interface UserService {
    getUserByEmail: (email: string) => Promise<UserResponse | ServiceError>
    getUserById: (id: string) => Promise<UserResponse | ServiceError>
}

// NOTE: This is just for testing / example
// The GET operations for users should probably be done
// directly from the client instead

export const UserService = ({ db }): UserService => {
    const getUserByEmail = async (email: string) => {
        try {
            const result = await db.collection('users').where('email', '==', email.toLowerCase()).get()
            const data = result.docs.map(doc => {
                return doc.data()
            })
            return Promise.resolve({ success: true, data })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'SYSTEM_ERROR' })
        }
    }
    const getUserById = async (id: string) => {
        try {
            const result = await db.collection('users').doc(id).get()
            const data = result.data()
            return Promise.resolve({ success: true, data })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'SYSTEM_ERROR' })
        }
    }

    return { getUserByEmail, getUserById }
}