import { NextFunction, Request, Response } from 'express'
import { logger } from '../utils/logger'
import { sendNotOk401Response } from '../router/responses'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Apply authentication by default on all routes.
        // We can add exceptions manually here.
        // We'll allow non-authenticated checking whether the service is alive.
        const nonAuthRoutes = ['/alive']
        if (nonAuthRoutes.indexOf(req.path) > - 1) {
            next()
        } else {
            const authHeader = req.headers.authorization
            if(authHeader?.length > 0) {
                // We expect a Bearer XXXXX type token
                const [, token] = authHeader.split(' ')
                // TODO: Here we should in the future perform a jwt authentication with 'token'
                // loog in firebase admin sdk methods
                next()
            } else {
                sendNotOk401Response(req, res, 'Not authenticated.')
            }
        }
    } catch (error) {
        throw new Error('Oops something is wrong with the auth!')
    }
}