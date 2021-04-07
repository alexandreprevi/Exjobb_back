import 'dotenv/config'
import firebase from 'firebase-admin'

import { DB, AUTH } from './database'
import { Dependencies } from './types/app.types'
import { logger } from './utils/logger'
import { validateEnv } from './utils/validateEnv'
import { AliveService } from './services/aliveService'
import { UserService } from './services/userService'
import { CreateServer } from './server'
import { AdminSdkService } from './services/adminSdkService'

validateEnv()

const main = async () => {
    // Intialize DB here
    await firebase.initializeApp({
        credential: firebase.credential.cert(process.env.SERVICE_ACCOUNT),
    })

    // Setup server dependencies, then inject these to each of the controllers
    // allowing each service and controller to act in a modular and testable fashion.
    const { db } = DB(firebase)
    const { auth } = AUTH(firebase)
    const aliveService = AliveService({ db })
    const userService = UserService({ db, auth })
    const adminSdkService = AdminSdkService({ auth })

    const deps: Dependencies = { logger, db, auth, aliveService, userService, adminSdkService }

    const server = CreateServer(deps)
    server.start()
}

main()