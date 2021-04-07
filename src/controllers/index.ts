import { Dependencies } from '../types/app.types'
import { IndexController } from './index.controller'
import { AliveController } from './alive.controller'
import { UserController } from './user.controller'

export interface Controllers {
    indexController: IndexController
    aliveController: AliveController
    userController: UserController
}

export const Controllers = (deps: Dependencies): Controllers => {
    const indexController = IndexController(deps)
    const aliveController = AliveController(deps)
    const userController = UserController(deps)

    return { indexController, aliveController, userController }
}