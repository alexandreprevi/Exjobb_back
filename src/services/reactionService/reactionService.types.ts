export type ReactionResponse = {
  success: boolean
  data: string
}

export type ReactionPayload = {
  name: string
  action: string
}

export interface ServiceError {
  success: boolean
  data: string
}
