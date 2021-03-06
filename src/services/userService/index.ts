import firebase from 'firebase-admin'
import { logger } from '../../utils/logger'
import { UserResponse, ServiceError, UsersResponse, User, UserRecord, createUserAuthDb, UserRecordResponse, createUserFirestore, UpdateUserPayload } from './userService.types'

export interface UserService {
  getUsers: () => Promise<UsersResponse | ServiceError>
  getUserByEmail: (email: string) => Promise<UserResponse | ServiceError>
  getUserById: (id: string) => Promise<UserResponse | ServiceError>
  createUserInAuthDb: (newUserAuthDb: createUserAuthDb) => Promise<UserRecordResponse | ServiceError>
  createUserInFirestore: (newUserFirestore: createUserFirestore) => Promise<UserResponse | ServiceError>
  updateUserInAuthDb: (uid: string, userChanges: UpdateUserPayload) => Promise<UserResponse | ServiceError>
  updateUserInFirestore: (uid: string, userChanges: UpdateUserPayload) => Promise<UserResponse | ServiceError>
  deleteUserInAuthDb: (uid: string) => Promise<UserResponse | ServiceError>
  deleteUserInFirestore: (uid: string) => Promise<UserResponse | ServiceError>
}

// NOTE: This is just for testing / example
// The GET operations for users should probably be done
// directly from the client instead

export const UserService = ({ db, auth }): UserService => {
  const getUsers = async () => {
    try {
      const result = await db.collection('users').get()
      const users = []
      result.forEach((doc: FirebaseFirestore.DocumentSnapshot) => {
        users.push({
          ...doc.data(),
          id: doc.id,
        })
      })
      return Promise.resolve({ success: true, data: users })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT GET USER BY EMAIL' })
    }
  }
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
        username: newUserFirestore.username,
        email: newUserFirestore.email,
        createdAt: new Date().toISOString(),
      }
      const result = await db.collection('users').doc(newUserFirestore.uid).set(user)
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT CREATE USER IN FIRESTORE' })
    }
  }
  const updateUserInAuthDb = async (uid: string, userChanges: UpdateUserPayload) => {
    try {
      const userRecord = await auth.updateUser(uid, userChanges)
      return Promise.resolve({ success: true, data: userRecord })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT UPDATE USER IN AUTH DB' })
    }
  }
  const updateUserInFirestore = async (uid: string, userChanges: UpdateUserPayload) => {
    try {
      const updatedUser = {
        ...userChanges,
        updatedAt: new Date().toISOString(),
      }
      const result = await db.collection('users').doc(uid).update(updatedUser)
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT UPDATE USER IN FIRESTORE' })
    }
  }
  const deleteUserInAuthDb = async (uid: string) => {
    try {
      const result = await auth.deleteUser(uid)
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT DELETE USER IN AUTH DB' })
    }
  }
  const deleteUserInFirestore = async (uid: string) => {
    try {
      const result = await db.collection('users').doc(uid).delete()
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT DELETE USER IN FIRESTORE' })
    }
  }

  return { getUsers, getUserByEmail, getUserById, createUserInAuthDb, createUserInFirestore, updateUserInAuthDb, updateUserInFirestore, deleteUserInAuthDb, deleteUserInFirestore }
}
