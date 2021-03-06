import { logger } from '../utils/logger'

export const DB = firebase => {
  logger.info(`Initializing Cloud Firestore...`)
  const db = firebase.firestore()
  return { db }
}

export const AUTH = firebase => {
  logger.info(`Initializing Firebase Auth...`)
  const auth = firebase.auth()
  return { auth }
}

export const STORAGE = firebase => {
  logger.info(`Initializing Firebase Storage...`)
  const storage = firebase.storage()
  return { storage }
}
