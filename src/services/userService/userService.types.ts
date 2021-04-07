export type UserResponse = {
    success: boolean
    data: User
}

export type UserRecordResponse = {
    success: boolean
    data: UserRecord
}

export type User = {
    firstName: string
    lastName: string
    displayName: string
    email: string
    password: string
}

export type UpdateUserPayload = {
    firstName?: string
    lastName?: string
    displayName?: string
    email?: string
}

export type createUserAuthDb = {
    email: string
    password: string
    displayName: string
}

export type createUserFirestore = {
    uid: string
    firstName: string
    lastName: string
    displayName: string
    email: string
}

export type UserRecord = {
    uid: string
    displayName: string
    email: string
    emailIsVerified: boolean
    metadata: {
        lastSignInTime: string | null,
        creationTime: string 
    },
    tokensValidAfterTime: string
    providerDate: []
}

export interface ServiceError {
    success: boolean
    data: string
}