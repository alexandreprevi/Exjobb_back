import { Logger } from 'winston'
import { Controllers } from '../controllers'
import { AliveService } from '../services/aliveService'
import { UserService } from '../services/userService'
import { AdminSdkService } from '../services/adminSdkService'

export interface Dependencies {
    logger: Logger
    db: any
    auth: any
    aliveService: AliveService // There are the typings, not the whole service
    userService: UserService
    adminSdkService: AdminSdkService
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