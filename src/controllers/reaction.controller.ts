import { ReactionPayload } from '../services/reactionService/reactionService.types'
import { Dependencies, ControllerResult } from '../types/app.types'
import { failedResult, successResult } from './controllerResults'

export interface ReactionController {
    reactToProject: (uid: string, projectId: string, reaction: ReactionPayload) => Promise<ControllerResult>
    reactToComment: (uid: string, projectId: string, commentId: string, reaction: ReactionPayload) => Promise<ControllerResult>
}

export const ReactionController = (deps: Dependencies): ReactionController => {
    const reactToProject = async (uid: string, projectId: string, reaction: ReactionPayload) => {
        try {
            const { success, data } = await deps.reactionService.reactToProject(uid, projectId, reaction)
            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const reactToComment = async (uid: string, projectId: string, commentId: string, reaction: ReactionPayload) => {
        try {
            const { success, data } = await deps.reactionService.reactToComment(uid, projectId, commentId, reaction)
            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    return { reactToProject, reactToComment }
}