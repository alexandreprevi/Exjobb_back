import { Dependencies } from '../types/app.types'
import { IndexController } from './index.controller'
import { AliveController } from './alive.controller'
import { UserController } from './user.controller'
import { AdminSdkController } from './adminSdk.controller'

export interface Controllers {
    indexController: IndexController
    aliveController: AliveController
    userController: UserController
    adminSdkController: AdminSdkController
}

export const Controllers = (deps: Dependencies): Controllers => {
    const indexController = IndexController(deps)
    const aliveController = AliveController(deps)
    const userController = UserController(deps)
    const adminSdkController = AdminSdkController(deps)

    return { indexController, aliveController, userController, adminSdkController }
}