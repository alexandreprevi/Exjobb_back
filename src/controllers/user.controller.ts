import { User, UpdateUserPayload } from '../services/userService/userService.types'
import { Dependencies, ControllerResult } from '../types/app.types'
import { logger } from '../utils/logger'
import { prepareUserObjectForAuthDb, prepareUserObjectForFirestore } from '../utils/utils'
import { failedResult, successResult } from './controllerResults'

export interface UserController {
  getUserByEmail: (email: string) => Promise<ControllerResult>
  getUserById: (id: string) => Promise<ControllerResult>
  register: (user: User) => Promise<ControllerResult>
  updateUser: (uid: string, userChanges: UpdateUserPayload) => Promise<ControllerResult>
  deleteUser: (uid: string) => Promise<ControllerResult>
}

export const UserController = (deps: Dependencies): UserController => {
  const getUserByEmail = async (email: string) => {
    try {
      const { success, data } = await deps.userService.getUserByEmail(email)
      if (success) {
        return successResult(data)
      } else {
        return failedResult(data)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const getUserById = async (id: string) => {
    try {
      const { success, data } = await deps.userService.getUserById(id)
      if (success) {
        return successResult(data)
      } else {
        return failedResult(data)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const register = async (user: User) => {
    try {
      const { firstName, lastName, email, password } = user
      const displayName = `${firstName} ${lastName[0]}`
      const newAuthDbUser = {
        email,
        password,
        displayName,
      }
      const { success, data } = await deps.userService.createUserInAuthDb(newAuthDbUser)
      const userRecord = data
      if (!success) {
        return failedResult(data)
      } else {
        if (typeof userRecord !== 'string') {
          const newUserFirestore = {
            uid: userRecord.uid,
            firstName,
            lastName,
            email,
            username: userRecord.displayName,
          }
          const { success, data } = await deps.userService.createUserInFirestore(newUserFirestore)
          if (success) {
            return successResult(userRecord)
          } else {
            return failedResult(data)
          }
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const updateUser = async (uid: string, userChanges: UpdateUserPayload) => {
    try {
      // Check if user changed email, displayName or photoURL
      if (userChanges.displayName || userChanges.email || userChanges.photoURL) {
        // update user object in Auth DB
        const filteredUserForAuthDb = prepareUserObjectForAuthDb(userChanges)
        const { success, data } = await deps.userService.updateUserInAuthDb(uid, filteredUserForAuthDb)
        if (!success) {
          return failedResult(data)
        }
      }
      // update user in Firestore
      const filteredUserForFirestore = prepareUserObjectForFirestore(userChanges)
      const { success, data } = await deps.userService.updateUserInFirestore(uid, filteredUserForFirestore)
      if (success) {
        return successResult(data)
      } else {
        return failedResult(data)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const deleteUser = async (uid: string) => {
    try {
      logger.info('entering')
      const { success, data } = await deps.userService.deleteUserInAuthDb(uid)
      if (!success) {
        return failedResult(data)
      } else {
        const { success, data } = await deps.userService.deleteUserInFirestore(uid)
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

  return { getUserByEmail, getUserById, register, updateUser, deleteUser }
}
