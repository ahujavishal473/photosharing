import exprees from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { deleteMedia, groupMedia } from '../controllers/media.controller.js'
export const router=exprees.Router()

router.get('/group/:groupId',authenticate,groupMedia)
router.post('/:mediaId',authenticate,deleteMedia)