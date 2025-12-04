import express from 'express';
import { VerifyToken } from '../middleware/VerifyToken.middleware.js';
import { deleteProfile, updatePassword, updateProfile } from '../controller/user.controller.js';

const router = express.Router();

router.put('/profile',VerifyToken,updateProfile);
router.put('/change-password',VerifyToken,updatePassword);
router.delete('/delete-profile',VerifyToken,deleteProfile);

export default router;