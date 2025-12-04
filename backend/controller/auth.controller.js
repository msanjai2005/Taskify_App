import { User } from "../models/user.model.js";
import { mailverification,passwordChangedMail,sendResetPasswordOtp,welcomeMail } from "../send_mails/emails.js";
import generateOtp from "../utilities/generateOtp.js";
import { getTokenAndSetcookies } from "../utilities/getTokenAndSetcookies.js";
import { comparePassword, hashedPassword } from "../utilities/hashPassword.js";

export const Register = async(req,res)=>{
    const {Name, email, password} = req.body;
    if(!Name || !email || !password){
        return res.status(400).json({success:false,message:"All inputs are required"});
    }
    try {
        const Existuser = await User.findOne({email});

        if(Existuser){
            return res.status(400).json({success:false,message:"User already Exists"});
        }
        const hashPassword = await hashedPassword(password)
        const otp = generateOtp();
        
        const user = new User({
            name:Name,
            email,
            password:hashPassword,
            verifyOtp:otp,
            verifyOtpExpireAt:Date.now() + 30 * 60 * 1000 // 30 min
        })
        const token = await getTokenAndSetcookies(res,user._id);
        user.token = token;
        await user.save();

        await mailverification(user.email, user.verifyOtp, user.verifyOtpExpireAt);

        console.log(`User successfilly created ${user.name}`);
        return res.status(201).json({
            success:true,
            message:"Registered Successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
        
    }catch (error) {
        console.log('error in Register');
        return res.status(500).json({success:false,message:error.message});
    }
}

export const verifyEmail = async(req,res)=>{
    const { otp } = req.body;
    
    if(!otp) return res.json({success:false, message:"Missing Details"});
    try{
        const user = await User.findById(req.userId).select("-password");

        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        if(otp !== user.verifyOtp){
            return res.status(400).json({success:false,message:"Invalid otp"});
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.status(400).json({success:false,message:"otp is expired"});
        }
        if(user.isVerified){
            return res.status(400).json({success:false,message:"user already verified"});
        }

        user.isVerified = true;
        await user.updateOne({ $unset: { verifyOtp: 1, verifyOtpExpireAt: 1 } });
        await user.save();

        await welcomeMail(user.name,user.email);

        return res.status(200).json({success:true,message:"email verified",user});

    }catch(error){
        console.log("error in email verification");
        res.status(500).json({success:false,message:error.message});
    }
}

export const ReSendOtp = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        const otp = generateOtp();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = 30 * 60 * 1000;
        await user.save();

        await mailverification(user.email, user.verifyOtp, user.verifyOtpExpireAt);

        return res.status(200).json({success:true,message:"otp sent successfully"});

    } catch (error) {
        console.log("Error in resend otp");
        return res.status(500).json({success:false,message:error.message});
    }
}

export const Login = async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({success:false,message:"All inputs are required"});
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User not found. you must register"});
        }
        if(!user.isVerified){
            return res.status(400).json({success:false,message:"Must Verify your account!"})
        }
        const isMatch = await comparePassword(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid Cridentials"});
        }
        await getTokenAndSetcookies(res,user._id);

        user.lastLogin = Date.now();
        await user.save();

        console.log("successfully logged in")
        return res.status(200).json({
            success:true,
            user:{
                ...user._doc,
                password:undefined
            },
            message:"successfully logged in"
        });
    } catch (error) {
        console.log("error in login");
        res.status(500).json({success:false,message:error.message});
    }
}

export const Logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV == 'production'?'none':'strict'
        })
        console.log("Successfully logged out")
        res.status(200).json({success:true,message:"Logout successfully"});
    } catch (error) {
        console.log('error in logout');
        res.status(500).json({success:false,message:error.message});
    }
}

export const sendResetOtp = async(req,res)=>{
    const {email} = req.body;

    try {
        if(!email){
            return res.status(400).json({success:false,message:"Enter the email"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"});
        }
        const otp = generateOtp();
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 30 * 60 * 1000;
        await user.save();

        await sendResetPasswordOtp(user.email,otp);

        return res.json({ 
            success: true, 
            message: "reset OTP sent successfully" 
        });

    } catch (error) {
        console.log("errorn in send reset otp");
        return res.status(500).json({success:false, message:error.message});
    }
}

export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body;

    try {
        if(!email || !otp || !newPassword){
            return res.status(400).json({success:false, message:"Missing Details"});
        }
        if(newPassword.length < 6) {
            return res.status(400).json({success:false, message:"Password must be at least 6 characters"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({success:false, message:"User not found"});
        }
        if(otp !== user.resetOtp){
            return res.status(400).json({success:false,message:"Invalid otp"});
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.status(400).json({success:false,message:"Your otp is expired"});
        }
        user.password = await hashedPassword(newPassword);
        user.resetOtp = null;
        user.resetOtpExpireAt = null;
        user.save();

        console.log("before mail");
        await passwordChangedMail(user.name,user.email,newPassword);
        console.log("after mail");

        res.status(200).json({success:true,message:"Password Successfully Changed"});
        
    } catch (error) {
        console.log("Reset password Error");
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const resendResetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Email not found" });

    const otp = generateOtp();

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendResetPasswordOtp(user.email,otp);

    res.json({ success: true, message: "OTP Resent Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const isAuth = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");

        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"});
        }
        console.log(user);
        return res.status(200).json({success:true,user});
    } catch (error) {
        console.log("error in is auth");
        res.status(500).json({success:false,message:error.message});
    }
}