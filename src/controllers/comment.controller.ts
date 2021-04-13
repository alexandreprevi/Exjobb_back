import { CommentPayload } from '../services/commentService/commentService.types'
import { Dependencies, ControllerResult } from '../types/app.types'
import { failedResult, successResult } from './controllerResults'

export interface CommentController {
    createComment: (uid: string, projectId: string, comment: CommentPayload) => Promise<ControllerResult>
    updateComment: (projectId: string, commentId: string, CommentChanges: CommentPayload) => Promise<ControllerResult>
    deleteComment: (projectId: string, commentId: string) => Promise<ControllerResult>
}

export const CommentController = (deps: Dependencies): CommentController => {
    const createComment = async (uid: string, projectId: string, comment: CommentPayload) => {
        try {
            const newComment = {
                ...comment,
                author: uid,
                reactions: {
                    like: {
                        total: 0,
                        authorsIds: []
                    },
                    dislike: {
                        total: 0,
                        authorsIds: []
                    },
                    fire: {
                        total: 0,
                        authorsIds: []
                    },
                    laugh: {
                        total: 0,
                        authorsIds: []
                    },
                    rocket: {
                        total: 0,
                        authorsIds: []
                    },
                    applause: {
                        total: 0,
                        authorsIds: []
                    },
                    angry: {
                        total: 0,
                        authorsIds: []
                    },
                    confused: {
                        total: 0,
                        authorsIds: []
                    },
                }
            }
            const { success, data } = await deps.commentService.createComment(projectId, newComment)
            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const updateComment = async (projectId: string, commentId: string, commentChanges: CommentPayload) => {
        try {
            const { success, data } = await deps.commentService.updateComment(projectId, commentId, commentChanges)
            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const deleteComment = async (projectId: string, commentId: string) => {
        try {
            const { success, data } = await deps.commentService.deleteComment(projectId, commentId)
            if (success) {
                return successResult(data)
            } else {
                return failedResult(data)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    return { createComment, updateComment, deleteComment }
}