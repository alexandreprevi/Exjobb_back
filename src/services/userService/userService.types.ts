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
    photoURL?: string
}

export type UpdateUserInAuthDb = {
    email?: string
    displayName?: string
    photoURL?: string
}

export type UpdateUserInFirestore = {
    email?: string
    firstName?: string
    lastName?: string
    displayName?: string
    photoURL?: string
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
    email: string
    emailVerified: boolean
    displayName: string
    photoURL: string
    disable: false
    metadata: {
        lastSignInTime: string | null,
        creationTime: string 
    },
    tokensValidAfterTime: string
    providerDate: [
        {
            uid: string
            displayName: string
            email: string
            providerId: string
            phoneNumber: string
            photoURL: string
        }
    ]
}

export interface ServiceError {
    success: boolean
    data: string
}