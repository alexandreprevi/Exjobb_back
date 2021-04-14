import { Dependencies, ControllerResult } from '../types/app.types'
import { successResult } from './controllerResults'

export interface IndexController {
  index: () => Promise<ControllerResult>
}

export const IndexController = (deps: Dependencies): IndexController => {
  const index = async () => {
    try {
      return successResult(true)
    } catch (error) {
      throw new Error(error)
    }
  }

  return { index }
}
