import { Router, Request, Response, NextFunction } from 'express'
import { RouterDeps } from '../types/app.types'
import { sendOk200Response, sendNotOk200Response, sendNotOk503Response, sendNotOk404Response } from './responses'

export const RouteHandler = (deps: RouterDeps): Router => {
    const { logger, controllers } = deps
    const router = Router()

    router.get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { success, data } = await controllers.indexController.index()
            if (success) {
                sendOk200Response(req, res, data)
            } else {
                sendNotOk200Response(req, res, data)
            }
        } catch (error) {
            next(error)
        }
    })

    router.get('/alive', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { success, data } = await controllers.aliveController.isAlive()
            if (success) {
                sendOk200Response(req, res, data)
            } else {
                sendNotOk503Response(req, res, data)
            }
        } catch (error) {
            next(error)
        }
    })

    // 404
    router.all('*', (req, res) => {
        sendNotOk404Response(req, res, 'Not found.')
    })

    return router
}