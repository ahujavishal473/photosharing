import mongoose from "mongoose";
const mediaSchema=new mongoose.Schema({
    url:{
        type:String,
    },
    type:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group"
    }
},{timestamps:true})

export const Media=mongoose.model('Media',mediaSchema)