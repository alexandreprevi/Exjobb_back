import { addSyntheticLeadingComment } from 'typescript'
import firebase from 'firebase-admin'
import { logger } from '../../utils/logger'
import { UserResponse, ServiceError, User, UserRecord, createUserAuthDb, UserRecordResponse, createUserFirestore } from './userService.types'

export interface UserService {
    getUserByEmail: (email: string) => Promise<UserResponse | ServiceError>
    getUserById: (id: string) => Promise<UserResponse | ServiceError>
    createUserInAuthDb: (newUserAuthDb: createUserAuthDb) => Promise<UserRecordResponse | ServiceError>
    createUserInFirestore: (newUserFirestore: createUserFirestore) => Promise<UserResponse | ServiceError>
}

// NOTE: This is just for testing / example
// The GET operations for users should probably be done
// directly from the client instead

export const UserService = ({ db, auth }): UserService => {
    const getUserByEmail = async (email: string) => {
        try {
            const result = await db.collection('users').where('email', '==', email.toLowerCase()).get()
            const data = result.docs.map(doc => {
                return doc.data()
            })
            return Promise.resolve({ success: true, data })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'COULD NOT GET USER BY EMAIL' })
        }
    }
    const getUserById = async (id: string) => {
        try {
            const result = await db.collection('users').doc(id).get()
            const data = result.data()
            return Promise.resolve({ success: true, data })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'COULD NOT GET USER BY ID' })
        }
    }
    const createUserInAuthDb = async (newUserAuthDb: createUserAuthDb) => {
        try {
            const userRecord = await auth.createUser(newUserAuthDb)
            return Promise.resolve({ success: true, data: userRecord })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'COULD NOT CREATE USER IN AUTH DB' })
        }
    }
    const createUserInFirestore = async (newUserFirestore: createUserFirestore) => {
        try {
            const user = {
                firstName: newUserFirestore.firstName,
                lastName: newUserFirestore.lastName,
                displayName: newUserFirestore.displayName,
                email: newUserFirestore.email,
                created: firebase.firestore.FieldValue.serverTimestamp(),
            }
            const result = await db.collection('users').doc(newUserFirestore.uid).set(user)
            return Promise.resolve({ success: true, data: result })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'COULD NOT CREATE USER IN FIRESTORE' })
        }
    }

    return { getUserByEmail, getUserById, createUserInAuthDb, createUserInFirestore }
}