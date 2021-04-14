import { NotificationResponse, ServiceError } from './notificationService.types'

export interface NotificationService {
  sendShowInterestForProject: () => Promise<NotificationResponse | ServiceError>
  sendUserShowedInterestForProject: () => Promise<NotificationResponse | ServiceError>
  sendAcceptedToProject: () => Promise<NotificationResponse | ServiceError>
  sendUserReacted: () => Promise<NotificationResponse | ServiceError>
  sendUserCommented: () => Promise<NotificationResponse | ServiceError>
}

export const NotificationService = ({ db }): NotificationService => {
  const sendShowInterestForProject = async () => {
    try {
      return Promise.resolve({ success: true, data: '' })
    } catch (error) {
      return Promise.resolve({ success: false, data: '' })
    }
  }
  const sendUserShowedInterestForProject = async () => {
    try {
      return Promise.resolve({ success: true, data: '' })
    } catch (error) {
      return Promise.resolve({ success: false, data: '' })
    }
  }
  const sendAcceptedToProject = async () => {
    try {
      return Promise.resolve({ success: true, data: '' })
    } catch (error) {
      return Promise.resolve({ success: false, data: '' })
    }
  }
  const sendUserReacted = async () => {
    try {
      return Promise.resolve({ success: true, data: '' })
    } catch (error) {
      return Promise.resolve({ success: false, data: '' })
    }
  }
  const sendUserCommented = async () => {
    try {
      return Promise.resolve({ success: true, data: '' })
    } catch (error) {
      return Promise.resolve({ success: false, data: '' })
    }
  }
  return { sendShowInterestForProject, sendUserShowedInterestForProject, sendAcceptedToProject, sendUserReacted, sendUserCommented }
}
