import express from 'express';
import { isAuth, Login, Logout, Register, ReSendOtp, resendResetPasswordOtp, resetPassword, sendResetOtp, verifyEmail } from '../controller/auth.controller.js';
import { VerifyToken } from '../middleware/VerifyToken.middleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { getTokenAndSetcookies } from '../utilities/getTokenAndSetcookies.js';
import { mailverification } from '../send_mails/emails.js';
import generateOtp from '../utilities/generateOtp.js';
import { User } from '../models/user.model.js';

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


router.get('/google',passport.authenticate("google",{scope:["profile","email"]}));
router.get('/google/callback',
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        try {
            await getTokenAndSetcookies(res, req.user._id);

            const otp = generateOtp();
            const expireTime = Date.now() + 10 * 60 * 1000;

            const dbUser = await User.findById(req.user._id);

            dbUser.verifyOtp = otp;
            dbUser.verifyOtpExpireAt = expireTime;

            await dbUser.save();

            await mailverification(dbUser.email, otp, expireTime);

            return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
        } catch (error) {
            console.log("google login error");
            console.log(error.message);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
        }
    }
);

router.get('/me',VerifyToken,(req,res)=>{
    res.json({success:true,user:req.user});
})

export default router;