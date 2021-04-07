import { ControllerResult, Dependencies } from "../types/app.types";
import { logger } from "../utils/logger";
import { failedResult, successResult } from "./controllerResults";

export interface AdminSdkController {
    getFirebaseIdToken: (uid: string) => Promise<ControllerResult>
}

export const AdminSdkController = (deps: Dependencies): AdminSdkController => {
    const getFirebaseIdToken = async (uid: string) => {
        try {
            logger.info(uid)
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

    return { getFirebaseIdToken }
}