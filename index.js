import connection from "./src/db/db.js";
import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from 'cors'
import {router as auth} from './src/routes/auth.route.js'
import {router as group }from './src/routes/group.route.js'
import { router as upload } from './src/routes/upload.route.js';
import {router as media} from './src/routes/media.route.js'
import { router as user } from './src/routes/user.route.js';
import { applySecurityMiddleware } from "./src/middleware/security.middleware.js";
dotenv.config()
const PORT=process.env.PORT || 5000

connection()
const app=express()
    app.use(cors({
        origin: 'http://localhost:5173', 
        credentials: true, 
      }));
applySecurityMiddleware(app)
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded())


app.use('/api/auth',auth)
app.use('/api/group',group)
app.use('/api/upload',upload)
app.use('/api/media',media)
app.use('/api/user',user)

app.use('/',(req,res)=>{
    res.json("Backend is working")
})

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})