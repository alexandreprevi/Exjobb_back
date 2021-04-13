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
    comments: number
    reactions: {
        likes: {
            total: number
            authors: string[]
        }
        dislikes: {
            total: number
            authors: string[]
        }
        fire: {
            total: number
            authors: string[]
        }
        rocket: {
            total: number
            authors: string[]
        }
        laugh: {
            total: number
            authors: string[]
        }
        confused: {
            total: number
            authors: string[]
        }
        applause: {
            total: number
            authors: string[]
        }
        angry: {
            total: number
            authors: string[]
        }
    }
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