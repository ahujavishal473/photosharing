import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
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
    storageUsed:{
        type:Number,
        default:0
    },
    otp:{
        type:String
    },
    otpExpire:{
        type:Date
    },
    refreshToken:{
        type:String
    },
    resetToken:{
        type:String
    }
},{timestamps:true})

export const User=mongoose.model('User',userSchema)