import { Router, Request, Response, NextFunction } from 'express'
import { RouterDeps } from '../types/app.types'
import { sendOk200Response, sendNotOk200Response, sendNotOk503Response, sendNotOk404Response } from './responses'
import { dtoValidationMiddleware } from '../middlewares/dtoValidation.middleware'
import {
  createUserSchema,
  updateUserSchema,
  updateUserSchemaWithAsminSdk,
  getUserByIdWithAdminSdk,
  getFirebaseIdTokenWithAdminSdk,
  deleteUserSchemaWithAdminSdk,
  setCustomClaimsSchema,
  createProjectSchema,
  updateProjectSchema,
  deleteProjectImageSchema,
  CommentSchema,
  ReactionSchema,
} from '../utils/dtoValidationSchemas'
import { upload } from '../middlewares/fileUpload.middleware'

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

  // Admin
  router.post('/admin/getidtoken', dtoValidationMiddleware(getFirebaseIdTokenWithAdminSdk), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.body
      const { success, data } = await controllers.adminSdkController.getFirebaseIdToken(uid)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.get('/admin/user', dtoValidationMiddleware(getUserByIdWithAdminSdk), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.body
      const { success, data } = await controllers.adminSdkController.getUserRecord(uid)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.put('/admin/user', dtoValidationMiddleware(updateUserSchemaWithAsminSdk), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid, changes } = req.body
      const { success, data } = await controllers.adminSdkController.updateUser(uid, changes)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.delete('/admin/user', dtoValidationMiddleware(deleteUserSchemaWithAdminSdk), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid } = req.body
      const { success, data } = await controllers.adminSdkController.deleteUser(uid)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.put('/admin/setcustomclaims', dtoValidationMiddleware(setCustomClaimsSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid, claim } = req.body
      const { success, data } = await controllers.adminSdkController.setCustomClaim(uid, claim)
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

  router.put('/user', dtoValidationMiddleware(updateUserSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      const user = req.body
      const { success, data } = await controllers.userController.updateUser(uid, user)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.delete('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      logger.info(uid)
      const { success, data } = await controllers.userController.deleteUser(uid)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  // Project
  router.get('/project/:projectId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params
      const { success, data } = await controllers.projectController.getProject(projectId)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })
  router.post('/project', upload, dtoValidationMiddleware(createProjectSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      const project = req.body
      const files = req.files
      const { success, data } = await controllers.projectController.createProject(uid, project, files)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.put('/project/:projectId', upload, dtoValidationMiddleware(updateProjectSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      const { projectId } = req.params
      const changes = req.body
      const files = req.files
      const { success, data } = await controllers.projectController.updateProject(uid, projectId, changes, files)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.delete('/project/:projectId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      const { projectId } = req.params
      const { success, data } = await controllers.projectController.deleteProject(uid, projectId)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.delete('/project/:projectId/images', dtoValidationMiddleware(deleteProjectImageSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      const { projectId } = req.params
      const { image } = req.body
      const { success, data } = await controllers.projectController.deleteProjectImage(uid, projectId, image)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  // Reactions
  router.put('/project/:projectId/react', dtoValidationMiddleware(ReactionSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      const { projectId } = req.params
      const { reaction } = req.body
      const { success, data } = await controllers.reactionController.reactToProject(uid, projectId, reaction)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })
  router.put('/project/:projectId/comment/:commentId/react', dtoValidationMiddleware(ReactionSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      const { projectId, commentId } = req.params
      const { reaction } = req.body
      const { success, data } = await controllers.reactionController.reactToComment(uid, projectId, commentId, reaction)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  // Comments
  router.post('/project/:projectId/comment', dtoValidationMiddleware(CommentSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req['uid']
      const { projectId } = req.params
      const comment = req.body
      const { success, data } = await controllers.commentController.createComment(uid, projectId, comment)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.put('/project/:projectId/comment/:commentId', dtoValidationMiddleware(CommentSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, commentId } = req.params
      const changes = req.body
      const { success, data } = await controllers.commentController.updateComment(projectId, commentId, changes)
      if (success) {
        sendOk200Response(req, res, data)
      } else {
        sendNotOk503Response(req, res, data)
      }
    } catch (error) {
      next(error)
    }
  })

  router.delete('/project/:projectId/comment/:commentId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, commentId } = req.params
      const { success, data } = await controllers.commentController.deleteComment(projectId, commentId)
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
