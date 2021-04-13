export type CommentResponse = {
    success: boolean
    data: string
}

export type Comment = {
    content: string
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

export type CommentPayload = {
    content: string
}

export interface ServiceError {
    success: boolean
    data: string
}