import { Dependencies } from '../types/app.types'
import { IndexController } from './index.controller'
import { AliveController } from './alive.controller'
import { UserController } from './user.controller'
import { ProjectController } from './project.controller'
import { CommentController } from './comment.controller'
import { ReactionController } from './reaction.controller'
import { AdminSdkController } from './adminSdk.controller'

export interface Controllers {
    indexController: IndexController
    aliveController: AliveController
    userController: UserController
    projectController: ProjectController
    commentController: CommentController
    reactionController: ReactionController
    adminSdkController: AdminSdkController
}

export const Controllers = (deps: Dependencies): Controllers => {
    const indexController = IndexController(deps)
    const aliveController = AliveController(deps)
    const userController = UserController(deps)
    const projectController = ProjectController(deps)
    const commentController = CommentController(deps)
    const reactionController = ReactionController(deps)
    const adminSdkController = AdminSdkController(deps)

    return { indexController, aliveController, userController, projectController, commentController, reactionController, adminSdkController }
}