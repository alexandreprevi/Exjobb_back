export type UserResponse = {
    success: boolean
    data: User
}

export type User = {
    firstName: string
    lastName: string
    email: string
}

export interface ServiceError {
    success: boolean
    data: string
}