import Joi from 'joi'

// User routes
export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  displayName: Joi.string().trim(),
  photoURL: Joi.string().trim(),
  email: Joi.string().email().trim(),
})

// Project routes
export const createProjectSchema = Joi.object({
  title: Joi.string().trim().required(),
  summary: Joi.string().trim().required(),
  category: Joi.string().trim().valid('frontend', 'backend', 'fullstack').required(),
  description: Joi.string().required(),
  status: Joi.string().valid('public', 'private').required(),
  coCreators: Joi.array().items(Joi.string().trim()),
  participants: Joi.array().items(Joi.string().trim()),
})

export const updateProjectSchema = Joi.object({
  title: Joi.string().trim(),
  summary: Joi.string().trim(),
  category: Joi.string().trim().valid('frontend', 'backend', 'fullstack'),
  description: Joi.string(),
  status: Joi.string().valid('public', 'private'),
  coCreators: Joi.array().items(Joi.string().trim()),
  participants: Joi.array().items(Joi.string().trim()),
})

export const deleteProjectImageSchema = Joi.object({
  image: Joi.string().trim(),
})

// Comments routes
export const CommentSchema = Joi.object({
  content: Joi.string().trim().required(),
})

// Reactions routes
export const ReactionSchema = Joi.object({
  reaction: Joi.object({
    name: Joi.string().valid('like', 'dislike', 'fire', 'rocket', 'laugh', 'confused', 'applause', 'angry').required(),
    action: Joi.string().valid('add', 'remove').required(),
  }).required(),
})

// Admin routes
export const updateUserSchemaWithAsminSdk = Joi.object({
  uid: Joi.string().trim().required(),
  changes: Joi.object({
    displayName: Joi.string().trim(),
    photoURL: Joi.string().trim(),
    email: Joi.string().email().trim(),
    disabled: Joi.bool(),
    emailVerified: Joi.bool(),
    password: Joi.string().trim(),
  }).required(),
})

export const deleteUserSchemaWithAdminSdk = Joi.object({
  uid: Joi.string().trim().required(),
})

export const setCustomClaimsSchema = Joi.object({
  uid: Joi.string().trim().required(),
  claim: Joi.object({
    role: Joi.string().trim().required().valid('admin', 'developer'),
    bool: Joi.bool().required(),
  }).required(),
})

export const getUserByIdWithAdminSdk = Joi.object({
  uid: Joi.string().trim().required(),
})

export const getFirebaseIdTokenWithAdminSdk = Joi.object({
  uid: Joi.string().trim().required(),
})
