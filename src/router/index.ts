import { Router, Request, Response, NextFunction, request, response } from 'express'
import { RouterDeps } from '../types/app.types'
import { sendOk200Response, sendNotOk200Response, sendNotOk503Response, sendNotOk404Response } from './responses'
import { dtoValidationMiddleware } from '../middlewares/dtoValidation.middleware'
import { createUserSchema } from '../utils/dtoValidationSchemas'

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

    // User
    router.get('/user/email/:email', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.params
            const { success, data } = await controllers.userController.getUserByEmail(email)
            if (success) {
                sendOk200Response(req, res, data)
            } else {
                sendNotOk503Response(req, res, data)
            }
        } catch (error) {
            next(error)
        }
    })

    router.get('/user/id/:id', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const { success, data } = await controllers.userController.getUserById(id)
            if (success) {
                sendOk200Response(req, res, data)
            } else {
                sendNotOk503Response(req, res, data)
            }
        } catch (error) {
            next(error)
        }
    })

    router.post('/createuser', dtoValidationMiddleware(createUserSchema), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.body
            const { success, data } = await controllers.userController.createUser(user)
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