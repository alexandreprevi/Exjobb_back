import 'dotenv/config'

import { Dependencies } from './types/app.types'
import { logger } from './utils/logger'
import { validateEnv } from './utils/validateEnv'
import { CreateServer } from './server'

validateEnv()

const main = async () => {
    // Intialize DB here

    // Setup server dependencies, then inject these to each of the controllers
    // allowing each service and controller to act in a modular and testable fashion.
    const deps: Dependencies = { logger }

    const server = CreateServer(deps)
    server.start()
}

main()