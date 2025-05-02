import express from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { upload } from '../utils/multer.js'
import { uploadFiles } from '../controllers/upload.controller.js'
import { checkUploadPermission } from '../middleware/checkUploadPermission.middleware.js'
export const router=express.Router()

router.post('/group/:groupId',authenticate,checkUploadPermission,upload.array('files',10),uploadFiles)