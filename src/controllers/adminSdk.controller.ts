import { ControllerResult, Dependencies } from "../types/app.types";
import { UpdateUserWithAdminSdk } from '../services/userService/userService.types'
import { logger } from "../utils/logger";
import { failedResult, successResult } from "./controllerResults";
import { prepareUserObjectForFirestore } from "../utils/utils";
import { CustomClaim } from "../services/adminSdkService/adminSdkService.types";

export interface AdminSdkController {
    getFirebaseIdToken: (uid: string) => Promise<ControllerResult>
    getUserRecord: (uid: string) => Promise<ControllerResult>
    updateUser: (uid: string, changes: UpdateUserWithAdminSdk) => Promise<ControllerResult>
    deleteUser: (uid: string) => Promise<ControllerResult>
    setCustomClaim: (uid: string, claim: CustomClaim) => Promise<ControllerResult>
}

export const AdminSdkController = (deps: Dependencies): AdminSdkController => {
    const getFirebaseIdToken = async (uid: string) => {
        try {
            const { success, data } = await deps.adminSdkService.getCustomToken(uid)
            const customToken = data
            if (!success) {
                return failedResult(data)
            } else {
                const { success, data } = await deps.adminSdkService.getFirebaseIdToken(customToken)
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
    const getUserRecord = async (uid: string) => {
        try {
            const { success, data } = await deps.adminSdkService.getUserRecord(uid)
            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const updateUser = async (uid: string, changes: UpdateUserWithAdminSdk) => {
        try {
            const { success, data } = await deps.adminSdkService.updateUserInAuthDb(uid, changes)
            if (!success) {
                return failedResult(data)
            } else {
                if (changes.photoURL || changes.email || changes.displayName) {
                    const filteredUserForFirestore = prepareUserObjectForFirestore(changes)
                    const { success, data } = await deps.userService.updateUserInFirestore(uid, filteredUserForFirestore)
                    if (!success) {
                        return failedResult(data)
                    }
                }
                return successResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const deleteUser = async (uid: string) => {
        try {
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
    const setCustomClaim = async (uid: string, claim: CustomClaim) => {
        try {
            const { success, data } = await deps.adminSdkService.setCustomClaim(uid, claim)

            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    return { getFirebaseIdToken, getUserRecord, updateUser, deleteUser, setCustomClaim }
}