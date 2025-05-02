import jwt from 'jsonwebtoken'
import { User } from '../model/user.model.js'

export const authenticate=async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken;
    
        if (!token) {
          return res.status(401).json({ message: 'No token, authorization denied' });
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        // console.log(decoded)
    
        // Optionally, check user still exists
        const user = await User.findById(req.user.id);
        // console.log(user)
        if (!user) {
          return res.status(401).json({ message: 'Invalid user' });
        }
        req.user=user
        next();
      } catch (err) {
        return res.status(403).json({ message: 'Token is not valid' });
      }
}
