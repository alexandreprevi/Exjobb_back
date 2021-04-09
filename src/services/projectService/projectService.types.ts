export type ProjectResponse = {
    success: boolean
    data: Project
}

export type Project = {
    title: string
    summary: string
    description: string
    status: string
    creator: string,
    coCreators: string [],
    participants?: Participant[]
    ratingCount?: number
    ratingTotalSum?: number
    ratingAverage?: number
}

export type Participant = {
    userId: string
    role: string
}

export type createProjectPayload = {
    title: string
    summary: string
    description: string
    status: string
    coCreators: string[]
    participants?: Participant[]
}

export interface ServiceError {
    success: boolean
    data: string
}