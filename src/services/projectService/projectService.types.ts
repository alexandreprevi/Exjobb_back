export type ProjectResponse = {
    success: boolean
    data: string
}

export type ProjectHistoryResponse = {
    success: boolean
    data: Project
}

export type Project = {
    projectId: string
    title: string
    summary: string
    description: string
    status: string
    creator: string
    coCreators: string []
    participants?: Participant[]
    ratingCount?: number
    ratingTotalSum?: number
    ratingAverage?: number
}

export type createProjectPayload = {
    title: string
    summary: string
    description: string
    status: string
    creator: string
    coCreators: string []
    participants?: Participant[]
}

export type updateProjectPayload = {
    title: string
    summary: string
    description: string
    status: string
    coCreators: string []
    participants?: Participant[]
}

export type Participant = {
    userId: string
    role: string
}

export interface ServiceError {
    success: boolean
    data: string
}