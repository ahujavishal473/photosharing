import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        const uploadPath=path.join(__dirname,'../../temp/public')
        fs.mkdirSync(uploadPath,{recursive:true})
        cb(null,uploadPath)
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const fileFilter=(req,file,cb)=>{
    const allowedTypes=['image/jpeg','image/png','video/mp4'];
    if(allowedTypes.includes(file.mimetype)) cb(null,true)
    else cb(new Error('Invalid File Type'))
}

export const upload=multer({
    storage,
    fileFilter,
    limits:{
        files:10,
        fileSize:1024*1024*500
    }
})

