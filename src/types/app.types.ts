import { Logger } from 'winston'
import { Controllers } from '../controllers'
import { AliveService } from '../services/aliveService'
import { UserService } from '../services/userService'
import { ProjectService } from '../services/projectService'
import { CommentService } from '../services/commentService'
import { ReactionService } from '../services/reactionService'
import { AdminSdkService } from '../services/adminSdkService'

export interface Dependencies {
    logger: Logger
    db: any
    auth: any
    storage: any
    aliveService: AliveService // There are the typings, not the whole service
    userService: UserService
    projectService: ProjectService
    commentService: CommentService
    reactionService: ReactionService
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