import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const sendEmail=async(to,subject,text)=>{
    const transpoter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.USER_EMAIL,
            pass:process.env.USER_PASSWORD
        }
    })

    await transpoter.sendMail({
        from:process.env.USER_EMAIL,
        to,
        subject,
        text
    })
}
export default sendEmail;