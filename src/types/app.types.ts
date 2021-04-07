import { Logger } from 'winston'
import { Controllers } from '../controllers'

export interface Dependencies {
    logger: Logger
    db: any
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