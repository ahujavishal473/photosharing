import express from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { getStorageUsage } from '../controllers/user.controller.js'
export const router=express.Router()
router.get('/storage',authenticate,getStorageUsage)