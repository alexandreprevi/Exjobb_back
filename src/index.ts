import 'dotenv/config'
import firebase from 'firebase-admin'

import { DB } from './database'
import { Dependencies } from './types/app.types'
import { logger } from './utils/logger'
import { validateEnv } from './utils/validateEnv'
import { CreateServer } from './server'

validateEnv()

const main = async () => {
    // Intialize DB here
    await firebase.initializeApp({
        credential: firebase.credential.cert(process.env.SERVICE_ACCOUNT),
    })

    // Setup server dependencies, then inject these to each of the controllers
    // allowing each service and controller to act in a modular and testable fashion.
    const { db } = DB(firebase)
    const deps: Dependencies = { logger, db }

    const server = CreateServer(deps)
    server.start()
}

main()