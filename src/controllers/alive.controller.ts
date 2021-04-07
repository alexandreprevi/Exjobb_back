import { Dependencies, ControllerResult } from '../types/app.types'
import { failedResult, successResult } from './controllerResults'

export interface AliveController {
    isAlive: () => Promise<ControllerResult>
}

export const AliveController = (deps: Dependencies): AliveController => {
    const isAlive = async () => {
        try {
            const { success, data } = await deps.aliveService.isAlive()
            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    return { isAlive }
}