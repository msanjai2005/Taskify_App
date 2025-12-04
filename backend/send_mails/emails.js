import transporter from "../config/nodemailerConfig.js";
import { otpVerificationTemplate, passwordChangedSuccessTemplate, passwordResetOtpTemplate, welcomeMailTemplate } from "./Email_Templetes.js";


export const welcomeMail =async (user_name,email)=>{

    const mailOptions = {
        from: process.env.SENDER_EMAIL, 
        to: email, 
        subject: 'Welcome to our  app!',  
        html: welcomeMailTemplate(user_name)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("SMTP USER:", process.env.SMTP_USER);
            console.log("SMTP PASS:", process.env.SMTP_PASS ? "OK" : "MISSING");

            console.log('❌ Error occurred: ', error.message);
        } else {
            console.log('✅ Email sent: ' + info.response);
        }
    });
}

export const mailverification = async(email,otp,expireTime)=>{

    const html = otpVerificationTemplate(
        email,otp,
        new Date(expireTime).toLocaleString()
    );

    const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:`Email Verification with OTP ${otp}`,
        html: html
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error occurred: ', error.message);
        } else {
            console.log('✅ Email sent: ' + info.response);
        }
    });
}

export const sendResetPasswordOtp = async(email,otp)=>{

    const mailOptions = {
        from: process.env.SENDER_EMAIL, 
        to: email, 
        subject: 'Password reset Otp',  
        html: passwordResetOtpTemplate(otp)
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if (error) {
            console.log('❌ Error occurred: ', error.message);
        } else {
            console.log('✅ Email sent: ' + info.response);
        }
    })
}

export const passwordChangedMail = async(name,email,password) =>{

    const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:"Password successfully Changed",
        html:passwordChangedSuccessTemplate(name,password)
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if (error) {
            console.log('❌ Error occurred: ', error.message);
        } else {
            console.log('✅ Email sent: ' + info.response);
        }
    })
}