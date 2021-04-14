import { AliveStatus, ServiceError } from './aliveService.types'

export interface AliveService {
  isAlive: () => Promise<AliveStatus | ServiceError>
}

export const AliveService = ({ db }): AliveService => {
  const isAlive = async () => {
    // We can add other critical systems checks here (like email, notifications...)
    // Checking if we have collections in Firestore seems like a
    // OK way to check if the database is working.
    try {
      const data = await db.listCollections()
      if (data?.length > 0) {
        return Promise.resolve({ success: true, data: { database: true } })
      } else {
        return Promise.resolve({ success: false, data: { database: false } })
      }
    } catch (error) {
      return Promise.resolve({ success: false, data: 'SYSTEM_ERROR' })
    }
  }

  return { isAlive }
}
