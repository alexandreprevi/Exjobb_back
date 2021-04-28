import firebase from 'firebase-admin'
import { NextFunction, Request, Response } from 'express'
import { logger } from '../utils/logger'
import { sendNotOk401Response } from '../router/responses'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Apply authentication by default on all routes.
    // We can add exceptions manually here.
    // We'll allow non-authenticated checking whether the service is alive.
    const nonAuthRoutes = ['/alive', '/register', '/admin/getidtoken', '/admin/user', '/admin/setcustomclaims', '/projects']
    if (nonAuthRoutes.indexOf(req.path) > -1) {
      next()
    } else {
      // next()
      if (!req.headers.authorization) {
        return sendNotOk401Response(req, res, 'Not authenticated.')
      }
      // Get auth token
      let idToken: string
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        // Read token
        idToken = req.headers.authorization.split('Bearer ')[1]
        logger.info('Authorization header Found')
      } else {
        idToken = null
      }

      // Check token
      if (idToken) {
        try {
          const decodedToken = await firebase.auth().verifyIdToken(idToken)
          // Check if user email is verified
          if (!decodedToken.email_verified) {
            return sendNotOk401Response(req, res, 'Your account is pending. Please verify your email!')
          }
          // Extract uid and email
          req['uid'] = decodedToken.uid
          req['userEmail'] = decodedToken.email
          decodedToken.name ? (req['username'] = decodedToken.name) : (req['username'] = 'nousername')
          return next()
        } catch (error) {
          sendNotOk401Response(req, res, 'Not authenticated.')
        }
      }
    }
  } catch (error) {
    throw new Error('Oops something is wrong with the auth!')
  }
}
