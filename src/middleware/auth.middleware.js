import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from either cookies or Authorization header
    const token =req.cookies?.accessToken 

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    // Optional: Check if user still exists in DB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token is not valid' });
  }
};
