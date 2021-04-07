import { NextFunction, Request, Response } from 'express'

export const dtoValidationMiddleware = schema => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const options = {
                abortEarly: false,
                convert: false,
            }
            const value = await schema.validateAsync(req.body, options)
            req.body = value
            next()
        } catch (error) {
            error.status = 422
            next(error)
        }
    }
}
//