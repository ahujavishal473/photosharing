import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { createGroup, getUserGroup, groupDetail, joinGroup, setUploadPermission } from '../controllers/group.controller.js';
import { validateSchema } from '../middleware/validate.middleware.js';
import { groupSchema } from '../utils/authValidate.js';
export const router=express.Router()
router.post('/create',validateSchema(groupSchema),authenticate,createGroup)
router.post('/join',authenticate,joinGroup)
router.post('/permission',authenticate,setUploadPermission)
router.get('/mygroup',authenticate,getUserGroup)
router.get('/:groupId/details',authenticate,groupDetail)