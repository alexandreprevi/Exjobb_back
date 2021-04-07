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
    email: Joi.string(),
})