export type AliveStatus = {
  success: boolean
  data: CriticalSystems
}

export type CriticalSystems = {
  database: boolean
}

export interface ServiceError {
  success: boolean
  data: string
}
