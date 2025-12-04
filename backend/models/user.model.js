import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyOtp:{
        type:String,
        default:""
    },
    verifyOtpExpireAt:{
        type:Date, 
        default:0
    },
    resetOtp:{
        type:String,
        default:""
    },
    resetOtpExpireAt:{
        type:Date, 
        default:0
    },
    token:{
        type:String,
    }
},{timestamps:true})

export const User = mongoose.model('User',userSchema);