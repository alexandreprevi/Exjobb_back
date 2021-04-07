import { Logger } from 'winston'
import { Controllers } from '../controllers'
import { AliveService } from '../services/aliveService'

export interface Dependencies {
    logger: Logger
    db: any
    aliveService: AliveService // There are the typings, not the whole service
}

export interface RouterDeps {
    logger: Logger
    controllers: Controllers
}

export interface HttpException {
    status: number
    message: string
}

export type ControllerResult = {
    success: boolean
    data: any
}