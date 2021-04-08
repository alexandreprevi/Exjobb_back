import Joi from 'joi'

export const createUserSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const updateUserSchema = Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    displayName: Joi.string().trim(),
    photoURL: Joi.string().trim(),
    email: Joi.string().email().trim(),
})

export const updateUserSchemaWithAsminSdk = Joi.object({
    uid: Joi.string().trim().required(),
    changes: Joi.object({
        displayName: Joi.string().trim(),
        photoURL: Joi.string().trim(),
        email: Joi.string().email().trim(),
        disabled: Joi.bool(),
        emailVerified: Joi.bool(),
        password: Joi.string().trim(),
    }).required()
})

export const deleteUserSchemaWithAdminSdk = Joi.object({
    uid: Joi.string().trim().required()
})

export const getUserByIdWithAdminSdk = Joi.object({
    uid: Joi.string().trim().required()
})

export const getFirebaseIdTokenWithAdminSdk = Joi.object({
    uid: Joi.string().trim().required()
})