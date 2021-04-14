import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../types/app.types'
import { logger } from '../utils/logger'

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500
    const message: string = error.message || 'Something went wrong'

    logger.error(`Caught error: ${status}, message: ${message}.`)
    res.status(status).json({
      status: 'ERROR',
      message,
    })
  } catch (error) {
    // If something happens here, this will be sent to the express built-in error handler,
    // which is automatically put last in the stack of middlewares
    next(error)
  }
}
