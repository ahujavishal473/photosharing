import mongoose from "mongoose";
import env from 'dotenv'
env.config()
const connection=async()=>{
    try{
        await mongoose.connect(process.env.mongoURI)
        console.log("Database Connected Sucessfully")
    }catch(err){
        console.log("Database Connection Error:",err)
    }
}
export default connection

