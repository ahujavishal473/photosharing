import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'

const limiter=rateLimit({
    windowMs:15*60*1000,
    max:100,
    message: 'Too many requests, please try again later',
})

export const applySecurityMiddleware=(app)=>{
    app.use(helmet())
    app.use(cors({
        origin: 'http://localhost:5173', 
        credentials: true, 
      }));
      
    app.use(limiter);
}