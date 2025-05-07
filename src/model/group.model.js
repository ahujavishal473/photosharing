
import mongoose from "mongoose";
const groupSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        code:{
            type:String,
            required:true,
            unique:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        members:[
            {
                user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
                },
                allowed: {
                  type: Boolean,
                  default: false,  // Default to disallowed
                },
            }
        ],

    },
    {
        timestamps:true
    }
)

export const Group=mongoose.model('Group',groupSchema)