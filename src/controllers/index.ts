import { Dependencies } from '../types/app.types'
import { IndexController } from './index.controller'

export interface Controllers {
    indexController: IndexController
}

export const Controllers = (deps: Dependencies): Controllers => {
    const indexController = IndexController(deps)

    return { indexController }
}