import { Dependencies, ControllerResult } from '../types/app.types'
import { logger } from '../utils/logger'
import { failedResult, successResult } from './controllerResults'

export interface UserController {
    getUserByEmail: (email: string) => Promise<ControllerResult>
    getUserById: (id: string) => Promise<ControllerResult>
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

    return { getUserByEmail, getUserById }
}