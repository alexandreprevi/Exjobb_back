export interface ServiceError {
    success: boolean
    data: string
}

export type CustomIdTokenResponse = {
    success: boolean
    data: string
}

export type FirebaseIdTokenResponse = {
    success: boolean
    data: {
        kind: string
        idToken: string
        refreshToken: string
        expiresIn: string
        isNewUSer: boolean
    }
}