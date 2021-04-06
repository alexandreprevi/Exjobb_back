import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import hpp from 'hpp'
import compression from 'compression'
import { stream } from './utils/logger'
import { Dependencies } from './types/app.types'
import { Controllers } from './controllers'
import { RouteHandler } from './router'


export const CreateServer = (deps: Dependencies) => {
    const { logger } = deps
    const controllers = Controllers(deps)
    const router = RouteHandler({logger, controllers})
    const app = express()


    const setupMiddleware = () => {
        if (process.env.NODE_ENV === 'production') {
            app.use(morgan('combined', { stream }))
            app.use(cors({ origin: 'mydomain.com', credentials: true }))
        } else if (process.env.NODE_ENV === 'development') {
            app.use(morgan('dev', { stream }))
            app.use(cors({ origin: true, credentials: true }))
        }

        app.use(hpp())
        app.use(helmet())
        app.use(compression())
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        app.use(cookieParser())
    }

    const start = () => {
        return app.listen(process.env.PORT, () => {
            logger.info(`Server running on port ${process.env.PORT}.`)
        })
    }

    setupMiddleware()

    app.use(router)

    return { start }
}