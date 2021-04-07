import { Dependencies } from '../types/app.types'
import { IndexController } from './index.controller'
import { AliveController } from './alive.controller'

export interface Controllers {
    indexController: IndexController
    aliveController: AliveController
}

export const Controllers = (deps: Dependencies): Controllers => {
    const indexController = IndexController(deps)
    const aliveController = AliveController(deps)

    return { indexController, aliveController }
}