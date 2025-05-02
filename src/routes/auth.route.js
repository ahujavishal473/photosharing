import express from 'express';
import { forgotPassword, login, logout, refreshAccessToken, register, resetPassword, verifyOTP } from '../controllers/auth.controller.js';
import { validateSchema } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../utils/authValidate.js';

export const router=express.Router()
router.post('/register',validateSchema(registerSchema),register)
router.post('/login',validateSchema(loginSchema),login)
router.post('/verify-otp',verifyOTP)
router.get('/refresh-token',refreshAccessToken)
router.get('/logout',logout)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:token',resetPassword)
