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
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        allowUploads: [
            {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            allowed: { type: Boolean, default: false }
          }
        ]
    },
    {
        timestamps:true
    }
)

export const Group=mongoose.model('Group',groupSchema)