import 'dotenv/config'
import firebase from 'firebase-admin'

import { DB, AUTH, STORAGE } from './firebase'
import { Dependencies } from './types/app.types'
import { logger } from './utils/logger'
import { validateEnv } from './utils/validateEnv'
import { AliveService } from './services/aliveService'
import { UserService } from './services/userService'
import { ProjectService } from './services/projectService'
import { CommentService } from './services/commentService'
import { ReactionService } from './services/reactionService'
import { CreateServer } from './server'
import { AdminSdkService } from './services/adminSdkService'
import { StorageService } from './services/storageService'

validateEnv()

const main = async () => {
    // Intialize DB here
    await firebase.initializeApp({
        credential: firebase.credential.cert(process.env.SERVICE_ACCOUNT),
        storageBucket: 'exjobb-dev.appspot.com',
    })

    // Setup server dependencies, then inject these to each of the controllers
    // allowing each service and controller to act in a modular and testable fashion.
    const { db } = DB(firebase)
    const { auth } = AUTH(firebase)
    const { storage } = STORAGE(firebase)

    const aliveService = AliveService({ db })
    const userService = UserService({ db, auth })
    const projectService = ProjectService({ db })
    const commentService = CommentService({ db })
    const reactionService = ReactionService({ db })
    const adminSdkService = AdminSdkService({ auth })
    const storageService = StorageService({ storage })

    const deps: Dependencies = { logger, db, auth, storage, aliveService, userService, projectService, commentService, reactionService, adminSdkService, storageService }

    const server = CreateServer(deps)
    server.start()
}

main()