import express from 'express';
import { isAuth, Login, Logout, Register, ReSendOtp, resendResetPasswordOtp, resetPassword, sendResetOtp, verifyEmail } from '../controller/auth.controller.js';
import { VerifyToken } from '../middleware/VerifyToken.middleware.js';

const router = express.Router();

router.get('/is-auth',VerifyToken,isAuth);

router.post('/register',Register);
router.post('/email-verify',VerifyToken,verifyEmail);
router.post('/resend-otp',VerifyToken,ReSendOtp);

router.post('/login',Login);
router.post('/logout',Logout);

router.post('/send-reset-password-otp',sendResetOtp);
router.post('/reset-password',resetPassword);
router.post('/resend-reset-password-otp',resendResetPasswordOtp);

export default router;