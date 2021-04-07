import Joi from 'joi'

export const createUserSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
})