import axios from 'axios'
import { logger } from "../../utils/logger";
import { CustomIdTokenResponse, FirebaseIdTokenResponse, ServiceError } from "./adminSdkService.types";

export interface AdminSdkService {
    getCustomToken: (uid: string) => Promise<CustomIdTokenResponse | ServiceError>
    getFirebaseIdToken: (customToken: string) => Promise<FirebaseIdTokenResponse | ServiceError>
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

    return { getCustomToken, getFirebaseIdToken }
}