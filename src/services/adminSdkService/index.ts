import axios from 'axios'
import { logger } from '../../utils/logger'
import { UpdateUserWithAdminSdk, UserDeletedResponse, UserRecordResponse } from '../userService/userService.types'
import { CustomClaim, CustomClaimResponse, CustomIdTokenResponse, FirebaseIdTokenResponse, ServiceError } from './adminSdkService.types'

export interface AdminSdkService {
  getCustomToken: (uid: string) => Promise<CustomIdTokenResponse | ServiceError>
  getFirebaseIdToken: (customToken: string) => Promise<FirebaseIdTokenResponse | ServiceError>
  getUserRecord: (uid: string) => Promise<UserRecordResponse | ServiceError>
  updateUserInAuthDb: (uid: string, changes: UpdateUserWithAdminSdk) => Promise<UserRecordResponse | ServiceError>
  setCustomClaim: (uid: string, claim: CustomClaim) => Promise<CustomClaimResponse | ServiceError>
}

export const AdminSdkService = ({ auth }): AdminSdkService => {
  const getCustomToken = async (uid: string) => {
    try {
      const result = await auth.createCustomToken(uid)
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT CREATE A CUSTOM TOKEN' })
    }
  }
  const getFirebaseIdToken = async (customToken: string) => {
    try {
      const result = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_WEB_API_KEY}`, {
        token: customToken,
        returnSecureToken: true,
      })
      return Promise.resolve({ success: true, data: result.data })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT GET A FIREBASE ID TOKEN' })
    }
  }
  const getUserRecord = async (uid: string) => {
    try {
      const result = await auth.getUser(uid)
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT GET USER RECORD' })
    }
  }
  const updateUserInAuthDb = async (uid: string, changes: UpdateUserWithAdminSdk) => {
    try {
      const result = await auth.updateUser(uid, changes)
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT UPDATE USER IN AUTH DB' })
    }
  }
  const setCustomClaim = async (uid: string, claim: CustomClaim) => {
    try {
      const result = await auth.setCustomUserClaims(uid, { [claim.role]: claim.bool })
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT SET CUSTOM CLAIM' })
    }
  }

  return { getCustomToken, getFirebaseIdToken, getUserRecord, updateUserInAuthDb, setCustomClaim }
}
