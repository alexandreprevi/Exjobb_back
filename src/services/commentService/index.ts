import firebase from 'firebase-admin'
import { CommentResponse, ServiceError, CommentPayload } from './commentService.types'

export interface CommentService {
  createComment: (projectId: string, comment: CommentPayload) => Promise<CommentResponse | ServiceError>
  updateComment: (projectId: string, commentId: string, commentChanges: CommentPayload) => Promise<CommentResponse | ServiceError>
  deleteComment: (projectId: string, commentId: string) => Promise<CommentResponse | ServiceError>
}

export const CommentService = ({ db }): CommentService => {
  const createComment = async (projectId: string, comment: CommentPayload) => {
    try {
      const newcomment = {
        ...comment,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      }
      await db.collection('projects').doc(projectId).collection('comments').add(newcomment)
      return Promise.resolve({ success: true, data: 'CREATED' })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT CREATE COMMENT' })
    }
  }
  const updateComment = async (projectId: string, commentId: string, commentChanges: CommentPayload) => {
    try {
      const result = await db.collection('projects').doc(projectId).collection('comments').doc(commentId).update(commentChanges)
      return Promise.resolve({ success: true, data: 'UPDATED' })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT UPDATE COMMENT' })
    }
  }
  const deleteComment = async (projectId: string, commentId: string) => {
    try {
      const result = await db.collection('projects').doc(projectId).collection('comments').doc(commentId).delete()
      return Promise.resolve({ success: true, data: 'DELETED' })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT DELETE COMMENT' })
    }
  }

  return { createComment, updateComment, deleteComment }
}
