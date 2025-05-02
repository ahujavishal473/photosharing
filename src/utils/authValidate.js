import joi from 'joi'

export const registerSchema=joi.object({
    name:joi.string().min(3).max(50).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required()
})

export const loginSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(6).required()
})

export const groupSchema=joi.object({
    name:joi.string().min(3).max(25).required()
})