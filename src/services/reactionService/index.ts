import { prepareReactionData } from '../../utils/utils'
import { ReactionResponse, ServiceError, ReactionPayload } from './reactionService.types'

export interface ReactionService {
  reactToProject: (uid: string, projectId: string, reaction: ReactionPayload) => Promise<ReactionResponse | ServiceError>
  reactToComment: (uid: string, projectId: string, commentId: string, reaction: ReactionPayload) => Promise<ReactionResponse | ServiceError>
}

export const ReactionService = ({ db }): ReactionService => {
  const reactToProject = async (uid: string, projectId: string, reaction: ReactionPayload) => {
    try {
      // TODO: Control before adding that the user has not already reacted with this reaction.name
      // TODO: Control before removing that the user has reacted with this reaction.name
      const documentRef = db.collection('projects').doc(projectId)
      const result = documentRef.update(prepareReactionData(reaction, uid))
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT REACT TO PROJECT' })
    }
  }
  const reactToComment = async (uid: string, projectId: string, commentId: string, reaction: ReactionPayload) => {
    try {
      // TODO: Control before adding that the user has not already reacted with this reaction.name
      // TODO: Control before removing that the user has reacted with this reaction.name
      const documentRef = db.collection('projects').doc(projectId).collection('comments').doc(commentId)
      const result = documentRef.update(prepareReactionData(reaction, uid))
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT REACT TO COMMENT' })
    }
  }
  return { reactToProject, reactToComment }
}
