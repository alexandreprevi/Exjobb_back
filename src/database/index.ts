import { logger } from '../utils/logger'

export const DB = firebase => {
    logger.info(`Initializing Cloud Firestore...`)
    const db = firebase.firestore()
    return { db }
}